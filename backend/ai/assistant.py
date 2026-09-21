from __future__ import annotations

import difflib
import re
from typing import Any, Dict

from .context import build_context, format_timestamp
from .events import event_store


# ---------------------------------------------------------------------------
# Vocabulary used for lightweight spelling normalization.
# ---------------------------------------------------------------------------

VOCABULARY = {
    "stage",
    "movement",
    "moving",
    "position",
    "target",
    "speed",
    "motor",
    "drift",
    "vibration",
    "acceleration",
    "temperature",
    "pressure",
    "vacuum",
    "leak",
    "leakage",
    "laser",
    "risk",
    "warning",
    "critical",
    "alert",
    "error",
    "prediction",
    "anomaly",
    "machine",
    "system",
    "happened",
    "happen",
    "last",
    "current",
    "time",
    "why",
    "high",
    "low",
    "increasing",
    "increase",
    "decreasing",
    "decrease",
    "cause",
    "reason",
    "help",
    "what",
    "when",
    "how",
    "temperature",
    "thermal",
}


# Common user misspellings seen in the intended NanoPredict queries.
COMMON_CORRECTIONS = {
    "vibraion": "vibration",
    "vibraton": "vibration",
    "vibrtion": "vibration",
    "tempreture": "temperature",
    "tempereture": "temperature",
    "temperatue": "temperature",
    "presure": "pressure",
    "presssure": "pressure",
    "incresing": "increasing",
    "increasng": "increasing",
    "happend": "happened",
    "hapened": "happened",
    "machne": "machine",
    "machin": "machine",
    "predction": "prediction",
    "anomly": "anomaly",
    "vacuume": "vacuum",
    "vacum": "vacuum",
    "drfit": "drift",
    "positon": "position",
    "movng": "moving",
    "alret": "alert",
    "warnng": "warning",
    "critcal": "critical",
}


def normalize_question(question: str) -> str:
    """
    Normalize punctuation, common spelling mistakes, and close
    vocabulary matches without changing the meaning of the question.
    """

    if not isinstance(question, str):
        return ""

    text = question.strip().lower()

    text = re.sub(
        r"[^\w\s?]",
        " ",
        text,
    )

    words = text.split()
    normalized_words: list[str] = []

    for word in words:
        if word in COMMON_CORRECTIONS:
            normalized_words.append(
                COMMON_CORRECTIONS[word]
            )
            continue

        if word in VOCABULARY:
            normalized_words.append(word)
            continue

        matches = difflib.get_close_matches(
            word,
            VOCABULARY,
            n=1,
            cutoff=0.86,
        )

        if matches:
            normalized_words.append(matches[0])
        else:
            normalized_words.append(word)

    return " ".join(normalized_words)


# ---------------------------------------------------------------------------
# Intent classification
# ---------------------------------------------------------------------------

def classify_intent(question_normalized: str) -> str:
    q = question_normalized.lower()

    if any(
        phrase in q
        for phrase in (
            "what time",
            "current time",
            "time is it",
            "today",
            "current date",
        )
    ):
        return "time"

    if any(
        phrase in q
        for phrase in (
            "last error",
            "last warning",
            "last alert",
            "last critical",
            "last vibration alert",
            "last temperature alert",
            "last pressure alert",
            "last vacuum alert",
            "when did",
            "when was",
            "history",
            "recent alert",
            "recent error",
            "recent warning",
            "last 5",
            "last five",
            "last 10",
        )
    ):
        return "history"

    if any(
        phrase in q
        for phrase in (
            "what should i do",
            "what do i do",
            "what should we do",
            "how do i fix",
            "how can i fix",
            "what action",
            "next step",
        )
    ):
        return "action"

    if any(
        phrase in q
        for phrase in (
            "current risk",
            "risk level",
            "risk score",
            "what is the risk",
            "what's the risk",
            "how risky",
            "risk status",
        )
    ):
        return "risk"

    if any(
        phrase in q
        for phrase in (
            "what will happen",
            "what is likely",
            "likely to happen",
            "predict",
            "prediction",
            "forecast",
            "future",
        )
    ):
        return "prediction"

    if any(
        phrase in q
        for phrase in (
            "why",
            "cause",
            "reason",
            "what caused",
            "why is",
            "why are",
        )
    ):
        return "diagnosis"

    if any(
        phrase in q
        for phrase in (
            "what happened",
            "what is happening",
            "current condition",
            "current state",
            "machine status",
            "system status",
            "how is the machine",
        )
    ):
        return "current_state"

    return "general"


# ---------------------------------------------------------------------------
# Formatting helpers
# ---------------------------------------------------------------------------

def _fmt(value: Any, digits: int = 3) -> str:
    if value is None:
        return "not available"

    if isinstance(value, float):
        return f"{value:.{digits}f}"

    return str(value)


def _risk_status(context: Dict[str, Any]) -> str:
    risk = context.get("risk") or {}

    return str(
        risk.get("status")
        or risk.get("level")
        or "UNKNOWN"
    ).upper()


def _current_machine(context: Dict[str, Any]) -> Dict[str, Any]:
    return context.get("machine") or {}


# ---------------------------------------------------------------------------
# History helpers
# ---------------------------------------------------------------------------

def _extract_alert_type(question: str) -> str | None:
    q = question.lower()

    mapping = {
        "vibration": "vibration",
        "temperature": "temperature",
        "pressure": "vacuum",
        "vacuum": "vacuum",
        "drift": "drift",
        "motor": "motor",
        "stage": "stage",
    }

    for keyword, alert_type in mapping.items():
        if keyword in q:
            return alert_type

    return None


def _history_answer(
    question: str,
    context: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Handle historical alert/error questions using event_store directly.

    Important:
    - "last alert" searches alert events only.
    - "last warning" searches WARNING alerts only.
    - "last error" maps to CRITICAL alerts because the current backend
      has WARNING and CRITICAL severities, not a separate ERROR severity.
    """

    q = question.lower()

    severity = None

    if "warning" in q:
        severity = "WARNING"
    elif (
        "error" in q
        or "critical" in q
    ):
        severity = "CRITICAL"

    alert_type = _extract_alert_type(q)

    # "last N" support for common small values.
    count = 1

    number_match = re.search(
        r"last\s+(\d+)",
        q,
    )

    if number_match:
        count = max(
            1,
            min(
                int(number_match.group(1)),
                20,
            ),
        )
    elif "last five" in q:
        count = 5
    elif "last ten" in q:
        count = 10

    alerts = event_store.get_recent_alerts(
        limit=count,
        severity=severity,
        alert_type=alert_type,
    )

    # ---------------------------------------------------------
    # "Last" style question
    # ---------------------------------------------------------

    if (
        "last" in q
        or "when was" in q
        or "when did" in q
    ):
        if not alerts:
            if severity == "CRITICAL":
                return {
                    "answer": (
                        "No CRITICAL alert is recorded in the "
                        "current NanoPredict event history."
                    ),
                    "observations": [],
                    "causes": [],
                    "actions": [],
                }

            if severity == "WARNING":
                return {
                    "answer": (
                        "No WARNING alert is recorded in the "
                        "current NanoPredict event history."
                    ),
                    "observations": [],
                    "causes": [],
                    "actions": [],
                }

            return {
                "answer": (
                    "No matching alert is recorded in the "
                    "current NanoPredict event history."
                ),
                "observations": [],
                "causes": [],
                "actions": [],
            }

        if count == 1:
            event = alerts[0]

            severity_text = str(
                event.get("severity")
                or "UNKNOWN"
            ).upper()

            raw_timestamp = event.get("timestamp")

            if raw_timestamp is not None:
                try:
                    event_time = format_timestamp(float(raw_timestamp))
                except (TypeError, ValueError):
                    event_time = "time unavailable"
            else:
                event_time = "time unavailable"

            message = (
                event.get("message")
                or "No alert message recorded."
            )

            if (
                "error" in q
                and severity_text == "CRITICAL"
            ):
                answer = (
                    "NanoPredict currently records WARNING and "
                    "CRITICAL alert severities rather than a separate "
                    f"ERROR severity. The latest CRITICAL alert was "
                    f"at {event_time}: {message}"
                )
            else:
                answer = (
                    f"The latest {severity_text} alert was at "
                    f"{event_time}: {message}"
                )

            return {
                "answer": answer,
                "observations": [
                    message,
                    f"Recorded time: {event_time}",
                ],
                "causes": [],
                "actions": [],
            }

        lines = []

        for event in alerts:
            lines.append(
                f"{event.get('time', 'time unavailable')} — "
                f"{event.get('severity', 'UNKNOWN')} — "
                f"{event.get('message', 'No message')}"
            )

        return {
            "answer": (
                f"Here are the {len(alerts)} most recent matching "
                "alert events in the current event history."
            ),
            "observations": lines,
            "causes": [],
            "actions": [],
        }

    # ---------------------------------------------------------
    # Recent/history question without "last"
    # ---------------------------------------------------------

    if (
        "recent" in q
        or "history" in q
    ):
        recent = event_store.get_recent_alerts(
            limit=10,
            severity=severity,
            alert_type=alert_type,
        )

        if not recent:
            return {
                "answer": (
                    "There are no matching alert events in the "
                    "current NanoPredict event history."
                ),
                "observations": [],
                "causes": [],
                "actions": [],
            }

        lines = [
            (
                f"{event.get('time', 'time unavailable')} — "
                f"{event.get('severity', 'UNKNOWN')} — "
                f"{event.get('message', 'No message')}"
            )
            for event in recent
        ]

        return {
            "answer": (
                f"I found {len(recent)} matching alert event(s) "
                "in the current history."
            ),
            "observations": lines,
            "causes": [],
            "actions": [],
        }

    return {
        "answer": (
            "I can search the current NanoPredict alert history "
            "for warnings, critical alerts, and subsystem-specific alerts."
        ),
        "observations": [],
        "causes": [],
        "actions": [],
    }


# ---------------------------------------------------------------------------
# Current state
# ---------------------------------------------------------------------------

def _current_state_answer(
    context: Dict[str, Any],
) -> Dict[str, Any]:
    machine = _current_machine(context)

    stage = machine.get("stage") or {}
    temperature = machine.get("temperature") or {}
    vibration = machine.get("vibration") or {}
    vacuum = machine.get("vacuum") or {}
    laser = machine.get("laser") or {}

    risk = context.get("risk") or {}
    prediction = context.get("prediction") or {}

    if not machine.get("available"):
        return {
            "answer": (
                "NanoPredict does not have current machine telemetry yet, "
                "so I cannot describe the present machine condition."
            ),
            "observations": [],
            "causes": [],
            "actions": [],
        }

    observations = [
        (
            f"Stage: {stage.get('status', 'UNKNOWN')}, "
            f"position {_fmt(stage.get('position_mm'))} mm."
        ),
        (
            f"Drift: {_fmt(laser.get('drift_nm'))} nm."
        ),
        (
            f"Vibration: {_fmt(vibration.get('acceleration_g'))} g "
            f"({vibration.get('status', 'UNKNOWN')})."
        ),
        (
            f"Temperature: {_fmt(temperature.get('value_c'), 2)} °C."
        ),
        (
            f"Vacuum pressure: "
            f"{_fmt(vacuum.get('pressure_mbar'), 6)} mbar "
            f"({vacuum.get('status', 'UNKNOWN')})."
        ),
        (
            f"Risk: {_risk_status(context)} "
            f"(score {_fmt(risk.get('score'), 1)})."
        ),
        (
            f"Prediction: "
            f"{prediction.get('condition', 'UNKNOWN')}."
        ),
    ]

    return {
        "answer": (
            "Here is the current NanoPredict machine state based on "
            "the latest telemetry."
        ),
        "observations": observations,
        "causes": [],
        "actions": [],
    }


# ---------------------------------------------------------------------------
# Diagnosis
# ---------------------------------------------------------------------------

def _diagnosis_answer(
    question: str,
    context: Dict[str, Any],
) -> Dict[str, Any]:
    machine = _current_machine(context)

    if not machine.get("available"):
        return {
            "answer": (
                "Current machine telemetry is not available, so I "
                "cannot determine the present condition or give a "
                "telemetry-based cause."
            ),
            "observations": [],
            "causes": [],
            "actions": [],
        }

    stage = machine.get("stage") or {}
    vibration = machine.get("vibration") or {}
    vacuum = machine.get("vacuum") or {}
    temperature = machine.get("temperature") or {}
    laser = machine.get("laser") or {}

    q = question.lower()

    observations = []
    causes = []
    actions = []

    if "vibration" in q:
        vibration_value = vibration.get(
            "acceleration_g"
        )

        observations.append(
            f"Current vibration is "
            f"{_fmt(vibration_value)} g."
        )

        if stage.get("moving"):
            observations.append(
                "The stage is currently moving."
            )
            causes.append(
                "Mechanical excitation during stage movement "
                "can contribute to increased vibration."
            )

        if laser.get("drift_nm") is not None:
            observations.append(
                f"Current position drift is "
                f"{_fmt(laser.get('drift_nm'))} nm."
            )

        causes.append(
            "Other possible contributors include mechanical "
            "instability or vibration in the motion system."
        )

        actions.extend(
            [
                "Check whether the vibration remains elevated after stage movement stops.",
                "Check the motion system and mounting for mechanical instability.",
                "Compare the vibration trend with recent drift and risk events.",
            ]
        )

    elif (
        "pressure" in q
        or "vacuum" in q
    ):
        pressure = vacuum.get(
            "pressure_mbar"
        )

        observations.append(
            f"Current vacuum pressure is "
            f"{_fmt(pressure, 6)} mbar."
        )

        observations.append(
            f"Vacuum status is "
            f"{vacuum.get('status', 'UNKNOWN')}."
        )

        causes.extend(
            [
                "A pressure increase can indicate degradation of the vacuum condition.",
                "Possible contributors include leakage or vacuum-pump performance changes.",
            ]
        )

        actions.extend(
            [
                "Check whether the pressure is continuing to rise.",
                "Check the vacuum subsystem and pump condition.",
                "Inspect for possible leakage if the pressure trend remains abnormal.",
            ]
        )

    elif (
        "temperature" in q
        or "thermal" in q
        or "heat" in q
    ):
        value = temperature.get(
            "value_c"
        )

        observations.append(
            f"Current temperature is "
            f"{_fmt(value, 2)} °C."
        )

        causes.append(
            "Temperature changes can affect mechanical dimensions "
            "and therefore contribute to positioning drift."
        )

        actions.extend(
            [
                "Check whether temperature is continuously increasing.",
                "Compare the temperature trend with position drift.",
                "Check equipment cooling or thermal-management conditions if the rise persists.",
            ]
        )

    elif "drift" in q:
        drift = laser.get(
            "drift_nm"
        )

        observations.append(
            f"Current position drift is "
            f"{_fmt(drift)} nm."
        )

        if stage.get("moving"):
            observations.append(
                "The stage is currently moving."
            )

        if vibration.get(
            "acceleration_g"
        ) is not None:
            observations.append(
                f"Current vibration is "
                f"{_fmt(vibration.get('acceleration_g'))} g."
            )

        causes.extend(
            [
                "Increased vibration can contribute to positioning drift.",
                "Thermal changes can also contribute to mechanical position changes.",
                "The telemetry should be checked over time before assigning a single cause.",
            ]
        )

        actions.extend(
            [
                "Compare drift against the vibration trend.",
                "Check whether drift decreases after stage movement stops.",
                "Monitor temperature together with drift for thermal correlation.",
            ]
        )

    elif "risk" in q:
        risk = context.get("risk") or {}

        observations.append(
            f"Current risk level is "
            f"{_risk_status(context)}."
        )

        observations.append(
            f"Current risk score is "
            f"{_fmt(risk.get('score'), 1)}."
        )

        causes.append(
            "The risk score combines monitored vibration, drift, "
            "temperature, and vacuum conditions."
        )

        actions.append(
            "Check the individual contributing telemetry values "
            "rather than relying only on the overall risk score."
        )

    else:
        observations.append(
            "The question does not identify a specific subsystem."
        )

        observations.append(
            f"Current risk level is {_risk_status(context)}."
        )

        causes.append(
            "NanoPredict can analyze stage, drift, vibration, "
            "temperature, vacuum, risk, and prediction data."
        )

        actions.append(
            "Ask about a specific condition such as vibration, "
            "drift, temperature, pressure, or risk."
        )

    return {
        "answer": (
            "Based on the current NanoPredict telemetry, "
            "here is what can be established."
        ),
        "observations": observations,
        "causes": causes,
        "actions": actions,
    }


# ---------------------------------------------------------------------------
# Prediction
# ---------------------------------------------------------------------------

def _prediction_answer(
    context: Dict[str, Any],
) -> Dict[str, Any]:
    prediction = context.get("prediction") or {}

    condition = prediction.get(
        "condition",
        "UNKNOWN",
    )

    confidence = prediction.get(
        "confidence"
    )

    observations = [
        f"Prediction condition: {condition}.",
    ]

    if confidence is not None:
        observations.append(
            f"Prediction confidence: {_fmt(confidence, 2)}."
        )

    warnings = prediction.get(
        "warnings"
    ) or []

    observations.extend(
        str(item)
        for item in warnings
    )

    return {
        "answer": (
            "The prediction engine uses recent telemetry trends to "
            "identify developing conditions. It indicates what the "
            "current data suggests, not a guaranteed future event."
        ),
        "observations": observations,
        "causes": [],
        "actions": [
            "Continue monitoring the affected telemetry trend.",
            "Check the corresponding current alert and risk state.",
        ],
    }


# ---------------------------------------------------------------------------
# Action
# ---------------------------------------------------------------------------

def _action_answer(
    question: str,
    context: Dict[str, Any],
) -> Dict[str, Any]:
    machine = _current_machine(context)

    if not machine.get("available"):
        return {
            "answer": (
                "Current machine telemetry is unavailable. "
                "I cannot recommend a telemetry-specific action."
            ),
            "observations": [],
            "causes": [],
            "actions": [
                "Restore the NanoPredict telemetry connection.",
            ],
        }

    risk_status = _risk_status(context)

    actions = [
        "Check the current alert list and identify the affected subsystem.",
        "Compare the current value with its recent trend.",
        "Verify the physical subsystem before taking corrective action.",
    ]

    observations = [
        f"Current risk level: {risk_status}.",
    ]

    return {
        "answer": (
            "Use the current telemetry and alerts to identify the "
            "affected subsystem before taking corrective action."
        ),
        "observations": observations,
        "causes": [],
        "actions": actions,
    }


def _risk_answer(
    context: Dict[str, Any],
) -> Dict[str, Any]:
    """Explain the current machine risk using the calculated risk state."""

    risk = context.get("risk") or {}

    level = str(
        risk.get("status")
        or risk.get("level")
        or "UNKNOWN"
    ).upper()

    score = risk.get("score")

    health = str(
        risk.get("health")
        or "UNKNOWN"
    ).upper()

    contributions = risk.get("contributions") or {}

    observations = [
        f"Current risk level: {level}.",
    ]

    if score is not None:
        observations.append(
            f"Risk score: {_fmt(score, 1)}/100."
        )

    observations.append(
        f"System health: {health}."
    )

    causes = []

    contribution_items = sorted(
        contributions.items(),
        key=lambda item: float(item[1]),
        reverse=True,
    )

    for subsystem, value in contribution_items[:3]:
        causes.append(
            f"{subsystem.capitalize()} risk contribution: "
            f"{_fmt(value, 1)}."
        )

    if not causes:
        causes.append(
            "No individual risk contribution data is available."
        )

    actions = []

    if level == "CRITICAL":
        actions.extend([
            "Check the active critical alerts immediately.",
            "Verify the affected physical subsystem before continuing operation.",
            "Monitor the telemetry until the risk condition is resolved.",
        ])
    elif level == "WARNING":
        actions.extend([
            "Check the active warnings and identify the affected subsystem.",
            "Compare the contributing telemetry values with their recent trends.",
            "Continue monitoring for escalation toward CRITICAL.",
        ])
    else:
        actions.append(
            "Continue monitoring the telemetry and recent trends."
        )

    return {
        "answer": (
            f"Current NanoPredict risk is {level}"
            + (
                f" with a score of {_fmt(score, 1)}/100"
                if score is not None
                else ""
            )
            + f". System health is {health}."
        ),
        "observations": observations,
        "causes": causes,
        "actions": actions,
    }


# ---------------------------------------------------------------------------
# Main answer function
# ---------------------------------------------------------------------------

def answer_question(question: str) -> Dict[str, Any]:
    """
    Main synchronous assistant entry point.

    Returns structured data suitable for the frontend.
    """

    normalized = normalize_question(
        question
    )

    if not normalized:
        return {
            "question": question,
            "normalized_question": normalized,
            "intent": "general",
            "answer": "Please enter a question about NanoPredict.",
            "observations": [],
            "causes": [],
            "actions": [],
            "sources": [],
        }

    intent = classify_intent(
        normalized
    )

    context = build_context(
        normalized
    )

    if intent == "time":
        time_data = context["current_time"]

        result = {
            "answer": (
                f"The current NanoPredict server time is "
                f"{time_data['display']}."
            ),
            "observations": [
                f"Timezone: {time_data['timezone']}",
            ],
            "causes": [],
            "actions": [],
        }

    elif intent == "history":
        result = _history_answer(
            normalized,
            context,
        )

    elif intent == "current_state":
        result = _current_state_answer(
            context,
        )

    elif intent == "risk":
        result = _risk_answer(
            context,
        )

    elif intent == "diagnosis":
        result = _diagnosis_answer(
            normalized,
            context,
        )

    elif intent == "prediction":
        result = _prediction_answer(
            context,
        )

    elif intent == "action":
        result = _action_answer(
            normalized,
            context,
        )

    else:
        result = _current_state_answer(
            context,
        )

    result.update(
        {
            "question": question,
            "normalized_question": normalized,
            "intent": intent,
            "sources": [
                item.get("title")
                for item in context.get(
                    "knowledge",
                    [],
                )
            ],
        }
    )

    return result

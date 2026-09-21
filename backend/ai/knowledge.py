from typing import List, Dict


KNOWLEDGE_BASE: List[Dict[str, object]] = [
    {
        "id": "stage_movement",
        "title": "Stage Movement",
        "keywords": [
            "stage",
            "movement",
            "moving",
            "position",
            "target",
            "speed",
            "motor",
        ],
        "content": (
            "The lithography stage moves to precise target positions. "
            "Stage position, target position, movement state, and speed "
            "are monitored continuously. During movement, mechanical "
            "excitation can affect vibration and therefore positioning stability."
        ),
    },
    {
        "id": "drift",
        "title": "Position Drift",
        "keywords": [
            "drift",
            "position",
            "accuracy",
            "displacement",
            "laser",
            "nanometer",
            "nm",
        ],
        "content": (
            "Position drift is the deviation of the measured stage position "
            "from the intended position. NanoPredict measures drift in nanometers "
            "using the laser displacement measurement. Increasing drift can "
            "reduce positioning accuracy and may be associated with vibration, "
            "thermal changes, or mechanical instability."
        ),
    },
    {
        "id": "vibration",
        "title": "Stage Vibration",
        "keywords": [
            "vibration",
            "vibrations",
            "acceleration",
            "shake",
            "mechanical",
            "oscillation",
            "movement",
        ],
        "content": (
            "Stage vibration represents mechanical acceleration affecting the "
            "precision stage. Elevated vibration can disturb positioning and "
            "may contribute to position drift. When vibration increases during "
            "stage movement, mechanical excitation from the motion system is "
            "one possible explanation; the actual telemetry and operating "
            "condition must be considered before determining the cause."
        ),
    },
    {
        "id": "vacuum",
        "title": "Vacuum Pressure",
        "keywords": [
            "vacuum",
            "pressure",
            "leak",
            "leakage",
            "mbar",
            "pump",
        ],
        "content": (
            "The vacuum subsystem monitors chamber pressure in mbar. "
            "An increase in pressure means the vacuum level is degrading. "
            "Possible causes include leakage, pump performance problems, "
            "or changes in the vacuum system. A pressure increase should "
            "be interpreted together with the current vacuum status and alerts."
        ),
    },
    {
        "id": "temperature",
        "title": "Temperature",
        "keywords": [
            "temperature",
            "temp",
            "heat",
            "thermal",
            "hot",
            "heating",
        ],
        "content": (
            "Equipment temperature is monitored because thermal changes can "
            "affect mechanical dimensions and precision. A sustained increase "
            "in temperature can contribute to positioning drift. Temperature "
            "should be considered together with drift, vibration, and other "
            "telemetry rather than treated as the sole cause."
        ),
    },
    {
        "id": "risk",
        "title": "Risk Score",
        "keywords": [
            "risk",
            "score",
            "health",
            "warning",
            "critical",
            "normal",
            "severity",
        ],
        "content": (
            "NanoPredict calculates a risk score using vibration, position "
            "drift, temperature, and vacuum pressure. The current backend "
            "classifies the result as NORMAL, WARNING, or CRITICAL. "
            "The risk level summarizes the current monitored conditions and "
            "should be interpreted together with the individual contributing factors."
        ),
    },
    {
        "id": "prediction",
        "title": "Prediction",
        "keywords": [
            "prediction",
            "predict",
            "forecast",
            "future",
            "likely",
            "anomaly",
            "trend",
        ],
        "content": (
            "The prediction engine analyzes recent telemetry trends to identify "
            "developing anomalies. It can detect increasing drift, vibration, "
            "temperature, or vacuum pressure trends. A prediction indicates "
            "what the recent monitored data suggests; it is not proof that "
            "a future failure will occur."
        ),
    },
    {
        "id": "alerts",
        "title": "Alerts",
        "keywords": [
            "alert",
            "alerts",
            "error",
            "warning",
            "critical",
            "alarm",
        ],
        "content": (
            "NanoPredict generates alerts when monitored values cross configured "
            "thresholds. Current alert severities include WARNING and CRITICAL. "
            "The system does not currently use a separate ERROR alert severity. "
            "When a user asks about the last error, the assistant should therefore "
            "look specifically for CRITICAL alert events and explain this mapping."
        ),
    },
    {
        "id": "stage_vibration_drift",
        "title": "Stage, Vibration and Drift Relationship",
        "keywords": [
            "stage",
            "vibration",
            "drift",
            "moving",
            "movement",
            "relationship",
            "why",
        ],
        "content": (
            "Stage movement can introduce mechanical excitation. Increased "
            "vibration can disturb the precision stage and contribute to "
            "position drift. However, this relationship does not prove that "
            "movement is the cause of every drift event. The assistant should "
            "compare stage movement, vibration, drift, temperature, vacuum, "
            "risk, and recent history before giving a cause explanation."
        ),
    },
]


def retrieve_relevant_knowledge(
    question_normalized: str,
    limit: int = 4,
) -> List[Dict[str, object]]:
    """
    Return knowledge entries whose keywords overlap with the user's question.

    The retrieval is intentionally simple and deterministic for the first
    version of NanoPredict. It provides grounded engineering context to the
    assistant without inventing information.
    """
    question_words = set(question_normalized.lower().split())

    scored_entries = []

    for entry in KNOWLEDGE_BASE:
        keywords = {
            str(keyword).lower()
            for keyword in entry.get("keywords", [])
        }

        overlap = question_words.intersection(keywords)

        if overlap:
            scored_entries.append(
                (
                    len(overlap),
                    entry,
                )
            )

    scored_entries.sort(
        key=lambda item: item[0],
        reverse=True,
    )

    return [
        entry
        for _, entry in scored_entries[:limit]
    ]

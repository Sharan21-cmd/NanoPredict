import React from "react";

function Row({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 20,
        padding: "7px 0",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <span style={{ color: "#8fa6b5", fontSize: 12 }}>{label}</span>
      <span
        style={{
          color: "#e8f7ff",
          fontSize: 12,
          fontFamily: "monospace",
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function SubsystemInfoPanel({ telemetry, selected, onClose }) {
  if (!selected || !telemetry) return null;

  const stage = telemetry.stage || {};
  const vacuum = telemetry.vacuum || {};
  const vibration = telemetry.vibration || {};
  const temperature = telemetry.temperature || {};
  const distance = telemetry.distance || {};
  const risk = telemetry.risk || {};

  const titles = {
    stage: "WAFER STAGE",
    positioning: "PRECISION POSITIONING",
    vacuum: "VACUUM CHAMBER",
    vibration: "VIBRATION ISOLATION",
    optical: "OPTICAL MODULE",
    electronics: "CONTROL ELECTRONICS",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        width: 290,
        padding: 16,
        background: "rgba(7, 12, 17, 0.94)",
        border: "1px solid rgba(0, 229, 255, 0.35)",
        borderRadius: 10,
        boxShadow: "0 10px 35px rgba(0,0,0,0.45)",
        color: "#fff",
        backdropFilter: "blur(10px)",
        zIndex: 20,
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            color: "#00e5ff",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1.2,
          }}
        >
          {titles[selected] || selected.toUpperCase()}
        </div>

        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            color: "#8fa6b5",
            fontSize: 18,
            cursor: "pointer",
            lineHeight: 1,
          }}
          aria-label="Close subsystem panel"
        >
          ×
        </button>
      </div>

      {selected === "stage" && (
        <>
          <Row
            label="Position"
            value={`${Number(stage.positionMm ?? 0).toFixed(3)} mm`}
          />
          <Row
            label="Target"
            value={`${Number(stage.targetPositionMm ?? 0).toFixed(3)} mm`}
          />
          <Row label="Speed" value={`${Number(stage.speed ?? 0).toFixed(2)}`} />
          <Row label="Motion" value={stage.moving ? "MOVING" : "STATIONARY"} />
        </>
      )}

      {selected === "positioning" && (
        <>
          <Row
            label="Position"
            value={`${Number(stage.positionMm ?? 0).toFixed(3)} mm`}
          />
          <Row
            label="Target"
            value={`${Number(stage.targetPositionMm ?? 0).toFixed(3)} mm`}
          />
          <Row label="Speed" value={`${Number(stage.speed ?? 0).toFixed(2)}`} />
          <Row label="Drift" value={`${Number(distance.driftNm ?? 0).toFixed(2)} nm`} />
        </>
      )}

      {selected === "vacuum" && (
        <>
          <Row
            label="Pressure"
            value={`${Number(vacuum.pressurePa ?? 0).toFixed(2)} Pa`}
          />
          <Row label="Status" value={risk.status || "NORMAL"} />
        </>
      )}

      {selected === "vibration" && (
        <>
          <Row
            label="RMS Acceleration"
            value={`${Number(vibration.rmsG ?? 0).toFixed(4)} g`}
          />
          <Row label="Status" value={risk.status || "NORMAL"} />
        </>
      )}

      {selected === "optical" && (
        <>
          <Row
            label="Displacement"
            value={`${Number(distance.valueMm ?? 0).toFixed(3)} mm`}
          />
          <Row
            label="Drift"
            value={`${Number(distance.driftNm ?? 0).toFixed(2)} nm`}
          />
        </>
      )}

      {selected === "electronics" && (
        <>
          <Row
            label="Temperature"
            value={`${Number(temperature.valueC ?? 0).toFixed(2)} °C`}
          />
          <Row label="Risk Status" value={risk.status || "NORMAL"} />
          <Row
            label="Risk Score"
            value={`${Number(risk.score ?? 0).toFixed(1)}`}
          />
        </>
      )}
    </div>
  );
}

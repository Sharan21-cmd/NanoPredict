/*
 * Visualization-only thresholds.
 *
 * These values control how the 3D digital twin visually represents
 * temperature and vibration when a backend status is not available.
 *
 * They do NOT replace NanoPredict backend risk/anomaly logic.
 */

export const DIGITAL_TWIN_THRESHOLDS = {
  temperature: {
    warning: 30,
    critical: 35,
  },

  vibration: {
    warning: 0.96,
    critical: 0.98,
  },
};

export function getNumericStatus(value, thresholds) {
  if (!Number.isFinite(value)) {
    return "normal";
  }

  if (value >= thresholds.critical) {
    return "critical";
  }

  if (value >= thresholds.warning) {
    return "warning";
  }

  return "normal";
}

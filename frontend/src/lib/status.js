export const STATUS = {
  NOMINAL: 'nominal',
  WARNING: 'warning',
  CRITICAL: 'critical',
  INFO: 'info',
}

export const STATUS_STYLES = {
  [STATUS.NOMINAL]: {
    label: 'Nominal',
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
  },
  [STATUS.WARNING]: {
    label: 'Warning',
    dot: 'bg-amber-400',
    text: 'text-amber-400',
  },
  [STATUS.CRITICAL]: {
    label: 'Critical',
    dot: 'bg-rose-500',
    text: 'text-rose-500',
  },
  [STATUS.INFO]: {
    label: 'Info',
    dot: 'bg-sky-400',
    text: 'text-sky-400',
  },
}

export function getStatusStyle(status) {
  return STATUS_STYLES[status] ?? STATUS_STYLES[STATUS.NOMINAL]
}

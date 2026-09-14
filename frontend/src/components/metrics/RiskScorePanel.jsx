import Panel from '../layout/Panel'
import RiskGauge from './RiskGauge'
import { useTelemetry } from '../../telemetry/useTelemetry'

export default function RiskScorePanel() {
  const { telemetry } = useTelemetry()

  const riskScore =
    telemetry.risk?.riskScore ?? 0

  return (
    <Panel
      title="Risk Score"
      subtitle="Current anomaly risk"
      className="h-full"
    >
      <RiskGauge score={riskScore} />
    </Panel>
  )
}

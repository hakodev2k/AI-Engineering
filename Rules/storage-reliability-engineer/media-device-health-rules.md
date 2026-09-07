# Media and Device Health Rules

## Purpose
Detect failing storage media before they create correlated data loss or severe recovery load.

## Scope
Applies to disks, SSDs, NVMe devices, controllers, wear indicators, error counters, and device firmware health.

## MUST
- Monitor predictive health indicators, media errors, wear, resets, and abnormal latency.
- Define replacement thresholds based on evidence and redundancy state.
- Validate firmware compatibility and rollback before broad deployment.

## MUST NOT
- Leave repeatedly faulting devices in service solely because they have not fully failed.
- Replace multiple devices in one failure domain without checking redundancy exposure.
- Upgrade firmware fleet-wide without staged validation.

## SHOULD
- Trend device health by model, firmware, age, and workload class.
- Use fleet evidence to refine replacement policy.

## Exceptions
Deferred replacement requires explicit risk assessment, enhanced monitoring, and a bounded remediation date.

## Verification
Review device telemetry, SMART/vendor health data, error trends, replacement records, and firmware rollout evidence.
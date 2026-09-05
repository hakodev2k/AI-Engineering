# Runtime Detection Rules

## Purpose
Detect suspicious container behavior after deployment and provide evidence for investigation.

## Scope
Applies to process execution, syscall activity, file changes, network activity, privilege use, and runtime security telemetry.

## MUST
- Production detection coverage MUST include behaviors that indicate privilege escalation, unexpected process execution, suspicious network connections, and sensitive file access where relevant.
- Detection rules MUST distinguish expected workload behavior from meaningful anomalies to keep alerts actionable.
- High-severity runtime alerts MUST identify workload, image digest, namespace or equivalent boundary, node, and event context.
- Detection telemetry MUST be protected from tampering by ordinary application workloads.
- New workload patterns that trigger repeated false positives MUST be investigated before broad suppression.

## MUST NOT
- MUST NOT disable runtime monitoring merely because an application is noisy.
- MUST NOT depend only on image scanning for post-deployment compromise detection.
- MUST NOT collect sensitive payload content without explicit authorization and data-handling controls.

## SHOULD
- Baseline normal runtime behavior for critical workloads and tune detections using observed evidence.
- Correlate runtime alerts with orchestrator audit logs and deployment events.

## Exceptions
Reduced coverage requires documented limitation, compensating evidence sources, risk acceptance, and review date.

## Verification
Inspect runtime security rules, sample alerts, telemetry integrity, false-positive handling, and incident evidence.
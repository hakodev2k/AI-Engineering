# Detection Enablement
## Purpose
Translate intelligence into measurable defensive capability.
## Scope
Detection hypotheses, hunting leads, telemetry requirements, and validation.
## MUST
- Provide behavior, data-source requirements, expected signal, and known false-positive conditions with detection recommendations.
- Validate high-priority detection hypotheses against representative telemetry when available.
- Track whether intelligence-driven detections remain effective.
## MUST NOT
- Equate an IOC import with durable detection coverage.
- Recommend unavailable telemetry without stating the gap.
## SHOULD
- Favor adversary behaviors that are difficult to change over brittle observables.
## Exceptions
Emergency IOC detections may be deployed temporarily with expiry and review.
## Verification
Inspect detection tests, telemetry evidence, coverage mapping, false-positive results, and expiry.
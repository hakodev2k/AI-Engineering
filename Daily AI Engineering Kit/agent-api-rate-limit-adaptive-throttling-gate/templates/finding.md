# Rate Limit Finding

## Status
confirmed | rejected | blocked

## Finding
State the observed cause in one sentence.

## Evidence
- Timestamp/request ID/status/header evidence
- Request rate/concurrency evidence
- Retry-layer evidence
- Reproduction or deterministic gate evidence

## Confidence
low | medium | high

## Affected component
Name the client, endpoint, job, tenant, or workflow.

## Risk
Describe retry amplification, latency, dropped work, quota exhaustion, or provider impact.

## Recommended action
Specify the smallest safe code/config/telemetry change.

## Verification plan
List exact tests, simulations, and metrics that must pass.

## Approval required
none | provider-quota | production-config | bypass-gate | other

## Open questions
List only evidence gaps that materially affect the decision.

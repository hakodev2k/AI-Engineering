# Privacy Incident Response

## Purpose
Investigate and contain privacy incidents involving AI systems while preserving evidence, limiting further exposure, and producing technically defensible impact analysis.

## When to use
Use for suspected prompt leakage, cross-tenant disclosure, unintended model memorization, unauthorized dataset access, vendor retention failures, or accidental exposure of personal data.

## Inputs
- Incident description and timeline
- Logs, traces, model/version metadata
- Data-flow map
- Affected systems and vendors
- Access-control and retention configuration

## Context to inspect
Inspect model requests/responses, retrieval paths, training lineage, telemetry, object/vector stores, access logs, deployment changes, feature flags, and external processor activity.

## Core knowledge
Privacy incidents require both technical containment and accurate determination of what data, people, systems, and time windows were affected. AI incidents may involve probabilistic disclosure, so analysis should distinguish confirmed exposure, plausible exposure, and unverified hypothesis.

## Procedure
1. Establish incident scope and preserve relevant evidence.
2. Stop or restrict the affected feature without destroying evidence.
3. Identify the first known bad event and deployment/model versions involved.
4. Trace the affected data through retrieval, inference, storage, logging, and third parties.
5. Determine affected data classes and populations.
6. Test whether the exposure is reproducible.
7. Separate confirmed disclosures from potential reach.
8. Apply containment: revoke access, disable routes, purge caches, rotate credentials, or roll back models as appropriate.
9. Coordinate processor/vendor evidence collection.
10. Implement corrective controls and regression tests.
11. Produce a root-cause analysis and impact statement.
12. Hand required facts to privacy/legal/security stakeholders for notification decisions.

## Decision points
Prefer immediate feature restriction when continued operation can expand exposure. Preserve enough evidence for impact analysis before destructive cleanup unless ongoing harm requires immediate deletion.

## Common failure patterns
- Deleting logs before establishing scope
- Treating model output as deterministic evidence of all affected users
- Underestimating secondary logs or caches
- Failing to involve vendors
- Closing after containment without root-cause verification

## Verification
Reproduce the original failure in a safe environment, demonstrate that the mitigation prevents it, inspect all affected storage paths, and verify monitoring catches recurrence.

## Expected output
A privacy incident record with timeline, confirmed and potential scope, containment actions, root cause, corrective controls, regression evidence, and unresolved questions.

## Stop conditions
Escalate immediately when sensitive or large-scale personal data exposure is confirmed, evidence is incomplete for notification decisions, or containment requires production actions beyond authorized access.
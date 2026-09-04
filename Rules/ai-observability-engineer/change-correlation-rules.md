# Change Correlation Rules

## Purpose
Make regressions attributable to deployments, model changes, prompt changes, configuration, data, and routing decisions.

## Scope
Applies to release metadata, model/prompt versions, feature flags, retrieval/index versions, and infrastructure changes.

## MUST
- Production telemetry MUST include stable identifiers for materially relevant deployment, model, prompt, routing, and retrieval versions.
- Observability systems MUST preserve timestamps and change metadata needed to correlate incidents with releases.
- Significant quality, latency, reliability, or cost shifts MUST be checked against recent changes before broad remediation.
- Experiment and feature-flag cohort identifiers MUST be observable at an aggregate-safe level when they can alter AI behavior.
- Rollback verification MUST compare post-rollback telemetry with the affected baseline.

## MUST NOT
- Investigators MUST NOT infer causation solely from temporal proximity without supporting evidence.
- Configuration changes that materially affect AI behavior MUST NOT be invisible to operational telemetry.
- Version identifiers MUST NOT contain secrets or uncontrolled high-cardinality values.

## SHOULD
- Emit deployment markers into dashboards and traces.
- Preserve a queryable history of model, prompt, and routing changes.

## Exceptions
Low-risk internal changes may use coarser versioning if they cannot alter production behavior materially.

## Verification
Inspect telemetry attributes, deployment history, feature-flag records, and a known regression to confirm the exact change cohort can be reconstructed.
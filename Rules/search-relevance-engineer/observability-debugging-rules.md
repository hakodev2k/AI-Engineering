# Observability and Debugging Rules

## Purpose
Make relevance failures diagnosable with evidence rather than intuition.

## Scope
Applies to query traces, ranking explanations, signal telemetry, index versions, model versions, logs, metrics, and incident investigation.

## MUST
- Production search traces MUST identify the active index, ranking configuration, and model versions needed to reproduce material ranking behavior.
- Debug tooling MUST expose enough stage-level evidence to distinguish query-understanding, retrieval, filtering, feature, and ranking failures.
- Sensitive query or document data MUST be redacted or access-controlled according to policy.
- Root-cause claims MUST be supported by reproducible evidence or explicitly bounded hypotheses.

## MUST NOT
- MUST NOT log secrets, credentials, or unrestricted sensitive query content.
- MUST NOT treat a final score alone as sufficient explanation for a relevance regression.
- MUST NOT discard version metadata needed to compare pre- and post-release behavior.

## SHOULD
- Maintain representative golden queries and replay tools for regression investigation.

## Exceptions
Reduced telemetry requires documented privacy or cost rationale and alternative diagnostic evidence.

## Verification
Inspect traces, logs, version tags, replay output, access controls, dashboards, and incident records.
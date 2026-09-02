# Retention Storage and Cost Rules

## Purpose
Control tracing cost while preserving evidence needed for operations, engineering, and governance.

## Scope
Applies to retention tiers, indexing, archival, compression, sampling interaction, and backend capacity.

## MUST
- Retention policy MUST be based on diagnostic, regulatory, and incident-response requirements rather than arbitrary defaults.
- Indexed fields and long-retention datasets MUST have documented operational value and cost impact.
- Material changes to retention or indexing MUST assess effects on incident investigation windows.
- Cost controls MUST preserve explicitly required high-value trace classes.

## MUST NOT
- MUST NOT retain sensitive telemetry longer than approved data-handling requirements permit.
- MUST NOT reduce retention without confirming that post-incident and audit workflows remain viable.
- MUST NOT infer tracing efficiency solely from lower storage spend when diagnostic coverage has degraded.

## SHOULD
- Use tiered retention or selective archival when it preserves useful evidence at lower cost.
- Review cost per service, environment, attribute, and trace class where tooling permits.

## Exceptions
Exceptions require business or regulatory justification, cost/coverage trade-off, data-owner review, and a defined reevaluation date.

## Verification
Inspect backend retention configuration, index usage, storage growth, sampled trace classes, incident lookback requirements, and cost reports after policy changes.

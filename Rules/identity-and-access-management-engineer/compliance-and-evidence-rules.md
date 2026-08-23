# Compliance and Evidence Rules

## Purpose
Ensure IAM controls can be demonstrated with reliable, repeatable evidence rather than assertions.

## Scope
Access governance, authentication, privileged access, provisioning, reviews, incidents, policy changes, and audit support.

## MUST
- Control claims MUST be supported by current configuration, logs, reports, test results, or equivalent evidence.
- Evidence collection MUST preserve source, scope, time period, and control context.
- Compliance mappings MUST distinguish implemented controls from planned or compensating controls.
- Known control gaps MUST be tracked to accountable owners with risk, remediation, and due dates.
- Evidence supplied for audit or assurance MUST be reproducible from authoritative systems where practical.

## MUST NOT
- MUST NOT treat screenshots without provenance as sufficient evidence for critical controls when stronger evidence exists.
- MUST NOT claim universal compliance from a narrow sample without documenting sample boundaries.
- MUST NOT alter or curate evidence to conceal control failures.

## SHOULD
- Evidence generation SHOULD be automated and versioned where practical.
- Recurring control tests SHOULD produce trendable results and detect regressions.

## Exceptions
Manual evidence is acceptable when automation is unavailable, provided provenance, reviewer, scope, and limitations are documented.

## Verification
Inspect control mappings, evidence artifacts, source-system links, sampling methodology, open-gap register, recurring test results, and audit traceability.
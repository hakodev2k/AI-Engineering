# Incident and Troubleshooting Rules

## Purpose
Ensure integration incidents are investigated with evidence, contained safely, and resolved without creating secondary failures.

## Scope
Applies to production incidents, degraded integrations, data mismatches, delivery failures, and unexplained behavioral changes.

## MUST
- Investigation MUST begin with an explicit impact statement, affected boundaries, timeline, and available evidence.
- Root-cause hypotheses MUST be tested against logs, metrics, traces, payload metadata, configuration, and change history where available.
- Containment actions that alter production routing, data, credentials, or security controls MUST require appropriate human approval.
- Data loss or duplication risk MUST be assessed before replay, reprocessing, or manual correction.
- Incident resolution MUST capture the verified cause or clearly state what remains unproven.

## MUST NOT
- MUST NOT modify production data merely to make symptoms disappear without understanding downstream consequences.
- MUST NOT force retries or replays before idempotency and duplicate-impact risks are evaluated.
- MUST NOT treat agent confidence or temporal correlation as root-cause evidence.

## SHOULD
- Reproduction SHOULD be attempted in a safe environment when feasible.
- Corrective actions SHOULD address systemic contributors, not only the immediate symptom.

## Exceptions
Document why normal investigation or approval cannot be followed, urgency, risk, evidence, and incident commander authorization.

## Verification
Review incident timeline, telemetry, change records, hypotheses tested, containment approvals, reconciliation evidence, and post-incident corrective actions.
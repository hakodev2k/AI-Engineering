# Network Security Testing
## Purpose
Validate controls with evidence rather than configuration intent alone.
## Scope
Reachability, segmentation, firewall, exposure, resilience, and adversarial network tests.
## MUST
- Tests MUST define expected allowed and denied behavior before execution.
- Production-impacting tests MUST have authorization, scope, stop conditions, and recovery plan.
- Findings MUST distinguish confirmed behavior from hypothesis.
- Remediation MUST be retested for material findings.
## MUST NOT
- Security scanners MUST NOT be run against sensitive production targets without approved scope.
- Passing one tool MUST NOT be treated as proof of comprehensive security.
## SHOULD
- Tests SHOULD include negative cases, bypass attempts, and representative failure conditions.
## Exceptions
Emergency validation may use narrower procedures under incident authority.
## Verification
Inspect test plans, approvals, raw results, packet/flow evidence, findings, remediation, and retest records.
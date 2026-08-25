# Flaky Test Rules
## Purpose
Prevent nondeterministic tests from eroding trust in engineering feedback.
## Scope
Detection, quarantine, ownership, remediation, and reporting of flaky tests.
## MUST
- A suspected flake MUST be supported by repeated-run or historical evidence.
- Quarantined tests MUST retain an owner, reason, tracking item, and review deadline.
- Flake rate MUST be measured separately from functional failure rate.
- Root causes SHOULD be bounded using timing, ordering, state, dependency, or environment evidence.
## MUST NOT
- MUST NOT add unlimited retries or suppress failures permanently.
- MUST NOT classify a failure as flaky solely because rerun passed once.
## SHOULD
- High-impact flakes SHOULD be prioritized by developer time lost and gate disruption.
## Exceptions
Temporary quarantine requires bounded duration and compensating coverage where risk is material.
## Verification
Review rerun history, quarantine metadata, retry policy, and trend of unresolved flakes.
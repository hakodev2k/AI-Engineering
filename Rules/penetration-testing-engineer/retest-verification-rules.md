# Retest and Remediation Verification Rules

## Purpose
Verify that remediation removes the underlying security weakness without introducing regressions or relying on superficial blocking.

## Scope
Covers retesting, closure decisions, compensating controls, partial fixes, and regression evidence.

## MUST
- MUST retest the original vulnerable path under equivalent relevant preconditions.
- MUST test plausible bypass variants when the remediation could be narrowly tailored to the original proof.
- MUST verify both the security property and expected legitimate functionality when practical.
- MUST classify outcomes as remediated, partially remediated, not remediated, accepted risk, or not retestable with supporting evidence.
- MUST preserve new evidence and link it to the original finding.

## MUST NOT
- MUST NOT close a finding solely because code or configuration changed.
- MUST NOT treat a WAF signature or payload blacklist as root-cause remediation when the underlying unsafe behavior remains reachable.
- MUST NOT silently change severity or scope during retest without rationale.
- MUST NOT perform a higher-risk retest than the original authorization permits.

## SHOULD
- SHOULD include regression tests or durable verification recommendations for recurring defect classes.
- SHOULD confirm compensating controls are enforceable and monitored.

## Exceptions
If retesting is unsafe or impossible, document the limitation, alternative evidence, residual uncertainty, and accountable acceptance.

## Verification
Compare original and retest evidence, review change records, validate bypass attempts, inspect control configuration, and confirm closure status matches observed behavior.
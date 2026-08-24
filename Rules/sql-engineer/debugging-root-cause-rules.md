# Debugging and Root-Cause Rules

## Purpose
Resolve database incidents and defects from evidence rather than speculative changes.

## Scope
Incorrect results, timeouts, blocking, deadlocks, regressions, failed jobs, and data anomalies.

## MUST
- Investigation MUST establish or bound the symptom, affected scope, timeline, and reproducibility before broad corrective change.
- Hypotheses MUST be tested against query plans, waits, locks, logs, metrics, data state, or other relevant evidence.
- Fixes MUST address the demonstrated cause or explicitly document when only mitigation is possible.
- Evidence collection MUST preserve sensitive-data controls.

## MUST NOT
- MUST NOT make multiple uncontrolled production changes that destroy causal evidence.
- MUST NOT label correlation as root cause without validation.
- MUST NOT conceal uncertainty in incident conclusions.

## SHOULD
- Prefer the least invasive diagnostic action first.
- Record disproven hypotheses when they materially guide future investigation.

## Exceptions
During active severe incidents, mitigation may precede full root cause, but it requires rollback capability, monitoring, and follow-up analysis.

## Verification
Reproduce where safe, demonstrate causal linkage or bounded evidence, verify the fix against the original symptom, and check for regressions and residual anomalies.
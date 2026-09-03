# Compliance Testing and Validation Rules

## Purpose
Ensure control effectiveness is established through evidence and repeatable testing rather than assumption or design intent.

## Scope
Applies to manual and automated tests of preventive, detective, corrective, procedural, and compensating security controls.

## MUST
- Every material control test MUST define objective, population or scope, method, expected result, evidence, and pass/fail criteria before conclusion.
- Operating-effectiveness tests MUST evaluate actual control execution over the relevant period, not only configuration design.
- Failed tests MUST generate findings with severity, ownership, remediation plan, and retest requirements.
- Sampling MUST be risk-based and sufficiently documented to reproduce the selection.

## MUST NOT
- Testers MUST NOT change criteria after observing results solely to obtain a passing outcome.
- Design review MUST NOT be represented as operating-effectiveness evidence.
- A single successful sample MUST NOT be generalized to a population without justified sampling rationale.

## SHOULD
- Prefer deterministic automated tests for stable machine-verifiable controls.
- Include negative tests that demonstrate controls detect or block prohibited states.

## Exceptions
Alternative test methods require documented limitation, rationale, residual uncertainty, and reviewer approval when assurance is materially reduced.

## Verification
Review test plans, samples, source evidence, execution records, findings, retest results, and reproducibility of selected control tests.
# Exception and Risk Acceptance Rules

## Purpose
Ensure deviations from supply-chain security controls are explicit, bounded, reviewable, and temporary rather than becoming silent permanent weaknesses.

## Scope
Applies to exceptions involving dependencies, provenance, signing, vulnerability thresholds, CI/CD controls, registries, credentials, SBOMs, and release policy.

## MUST
- Every exception MUST identify the exact control being bypassed, affected systems or artifacts, reason, risk, compensating controls, accountable owner, approver, and expiration or review date.
- Exceptions affecting production integrity, signing, publishing, destructive actions, or weakened security controls MUST require explicit human approval.
- Expired exceptions MUST fail back to the normal control unless renewed through review.
- Risk acceptance MUST be based on evidence about actual exposure and business constraints, not agent or reviewer confidence alone.
- Repeated exceptions for the same condition MUST trigger evaluation of root cause or policy design.

## MUST NOT
- Blanket or indefinite exceptions MUST NOT be used when scope can be bounded.
- An exception MUST NOT silently authorize unrelated changes or artifacts.
- Engineers and AI agents MUST NOT execute actions beyond the authority granted by the approved exception.

## SHOULD
- Exception records SHOULD be machine-queryable and linked to release evidence where practical.
- Compensating controls SHOULD be independently verifiable.

## Exceptions
This rule governs exceptions and therefore has no informal bypass. Any deviation from this process requires approval from the authority responsible for the underlying security governance.

## Verification
Review exception records, approval identity, expiry enforcement, linked artifacts, compensating-control evidence, renewal history, and audit logs showing actual use remained within approved scope.
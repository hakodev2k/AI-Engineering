# Citation and Grounding Rules

## Purpose
Ensure generated claims can be traced to retrieved evidence and that citations accurately support the statements they accompany.

## Scope
Applies to source attribution, citation placement, claim-evidence mapping, grounded-answer policies, and unsupported-claim handling.

## MUST
- Material factual claims presented as grounded MUST be supported by retrieved evidence available to the response pipeline.
- Citations MUST identify the actual supporting source rather than a merely related document.
- Claim-to-source mapping MUST remain inspectable during evaluation and debugging.
- When evidence is insufficient, the system MUST surface uncertainty or decline to present the claim as established fact.
- Conflicting sources MUST be represented faithfully when the conflict affects the answer.
- Citation generation MUST preserve source access restrictions and MUST NOT leak hidden source metadata.

## MUST NOT
- A citation MUST NOT be fabricated, guessed, or attached to a source that does not support the associated claim.
- The model MUST NOT present parametric knowledge as retrieved evidence.
- Citation formatting MUST NOT conceal that evidence was truncated or unavailable.

## SHOULD
- Prefer citations close to the claims they support.
- Evaluate citation precision and recall separately from general answer quality.
- Preserve stable source identifiers even when display labels are transformed for users.

## Exceptions
Exceptions require documented product behavior, user-visible disclosure, risk assessment, and approval when citations are intentionally omitted in externally consumed outputs.

## Verification
Use claim-level grounding evaluations, citation precision checks, unsupported-claim tests, conflict cases, source-trace inspection, and adversarial tests for fabricated references.
# Code Review Rules

## Purpose
Use review to detect cross-layer correctness, security, operability, and maintainability risks.
## Scope
Pull requests and material technical changes.
## MUST
- Review behavior across affected layers, not only local syntax.
- Require evidence for material performance, security, migration, and compatibility claims.
- Flag changes to public contracts, authorization, data integrity, or production behavior explicitly.
## MUST NOT
- Approve changes with unresolved critical safety concerns merely to meet schedule pressure.
- Treat automated checks as a substitute for architectural judgment.
## SHOULD
- Keep changes reviewable and explain non-obvious trade-offs in the PR or decision record.
## Exceptions
Emergency review shortcuts require authorized risk acceptance and follow-up review.
## Verification
Inspect review history, CI evidence, unresolved comments, and change-risk annotations.
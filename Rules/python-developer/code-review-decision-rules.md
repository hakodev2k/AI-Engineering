# Code Review and Decision Rules
## Purpose
Apply Senior-level risk judgment to changes.
## Scope
Pull requests, architecture decisions, high-risk fixes, and technical trade-offs.
## MUST
- Review depth MUST scale with blast radius, reversibility, security, data, and compatibility risk.
- Significant architecture choices MUST record constraints, alternatives, and consequences.
- Unclear requirements affecting contracts, data, or security MUST be resolved before irreversible implementation.
- Reviewer concerns about correctness or safety MUST be closed with evidence, not assertion.
## MUST NOT
- MUST NOT approve solely because tests are green when critical risks are untested.
- MUST NOT silently exceed delegated authority for production or security-sensitive actions.
## SHOULD
- Prefer reversible decisions when evidence is incomplete.
## Exceptions
Urgent mitigations may use abbreviated review with explicit follow-up.
## Verification
PR evidence, ADR/design record where applicable, CI results, and approval history.
# Technical Debt Rules
## Purpose
Manage technical debt as explicit risk rather than invisible future cost.
## Scope
Maintainability, obsolete dependencies, architectural debt, and remediation planning.
## MUST
- Record material debt with impact, evidence, owner or owning team, and disposition.
- Prioritize debt using user, reliability, security, delivery, and cost impact rather than age alone.
- Reassess debt when system scale, ownership, or risk changes.
## MUST NOT
- Label disliked code as debt without explaining its measurable or credible cost.
- Allow critical security or reliability issues to remain hidden under a generic debt label.
## SHOULD
- Remediate debt incrementally near affected product work when efficient.
## Exceptions
Accepted debt requires explicit rationale and review trigger.
## Verification
Review debt register, incidents, delivery friction, dependency status, and prioritization evidence.
# Requirements and Risk Rules
## Purpose
Expose mobile-specific constraints before implementation creates expensive rework.
## Scope
Feature requirements, OS capabilities, offline needs, privacy, permissions, store policy, accessibility, and operational risk.
## MUST
- Requirements MUST clarify supported platforms, connectivity assumptions, data sensitivity, permissions, lifecycle/background needs, and failure expectations when relevant.
- High-risk assumptions MUST be validated with platform documentation, prototypes, or representative-device evidence before commitment.
- Irreversible or policy-sensitive behavior MUST identify the human decision owner.
## MUST NOT
- Desktop/web behavior MUST NOT be assumed to transfer unchanged to mobile constraints.
- Store review, permission, background, or device limitations MUST NOT be discovered only at release time when they were reasonably foreseeable.
## SHOULD
- Senior developers SHOULD surface trade-offs early in product language, including user impact and alternatives.
## Exceptions
Exploratory prototypes may defer full analysis when they cannot reach production users or data.
## Verification
Review requirement notes, risk register, prototypes, platform evidence, and acceptance criteria.
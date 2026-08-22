# Technical Decision Rules
## Purpose
Ensure consequential engineering decisions are explicit, evidence-based, and reversible where practical.
## Scope
Architecture, implementation strategy, dependencies, platforms, and technical standards.
## MUST
- Significant decisions MUST state constraints, alternatives, trade-offs, risks, and verification criteria.
- Decisions affecting multiple teams or public contracts MUST identify impacted owners before implementation.
- Assumptions MUST be distinguished from verified facts.
## MUST NOT
- Select a solution solely from familiarity, popularity, or agent confidence.
- Hide material operational or migration costs.
## SHOULD
- Prefer the simplest option satisfying current requirements and credible near-term constraints.
## Exceptions
Urgent decisions require documented rationale, risk, owner, and follow-up review.
## Verification
Review ADRs, design notes, evidence, approvals, and resulting tests or measurements.
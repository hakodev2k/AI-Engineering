# Decision Governance Rules

## Purpose
Ensure consequential AI product decisions are explicit, evidence-based, reversible where practical, and owned by the correct authority.

## Scope
Applies to launch decisions, risk acceptance, roadmap trade-offs, major model changes, policy changes, and high-impact exceptions.

## MUST
- Consequential decisions MUST record the decision, evidence, alternatives considered, assumptions, risks, owner, and review date when conditions may change.
- Decision authority MUST match the impact of the action; product ownership MUST NOT be treated as unlimited authority over security, privacy, legal, production, or safety controls.
- Irreversible or high-impact actions MUST require explicit human approval from the responsible authority.
- Material disagreements between product value and safety, reliability, privacy, security, or compliance requirements MUST be escalated rather than silently resolved by one function.
- Decisions based on incomplete evidence MUST state what is unknown and how exposure is bounded.

## MUST NOT
- MUST NOT present agent confidence, stakeholder seniority, or schedule pressure as evidence.
- MUST NOT bypass approval gates by reframing execution as experimentation when production impact is equivalent.
- MUST NOT make breaking public commitments or weaken critical controls without authorized review.

## SHOULD
- Prefer reversible decisions and staged commitments when uncertainty is high.
- Significant decisions SHOULD include explicit conditions that would cause reconsideration.

## Exceptions
Exceptions require documented urgency, authority, evidence limits, residual risk, compensating controls, and follow-up verification.

## Verification
Inspect decision records, approval history, risk acceptance, launch artifacts, escalation records, and whether stated review conditions were later evaluated.
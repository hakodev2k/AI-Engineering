# Architecture Decision Rules

## Purpose
Ensure cloud architecture decisions are explicit, evidence-based, reversible where possible, and traceable to requirements.

## Scope
Applies to material platform, service, topology, data, identity, networking, resilience, and vendor decisions.

## MUST
- Significant architecture decisions MUST document requirements, constraints, alternatives, trade-offs, failure modes, operational impact, cost impact, security impact, and migration consequences.
- Decisions MUST identify assumptions that could invalidate the chosen design.
- Claims about scalability, resilience, security, or cost MUST be supported by evidence appropriate to the decision.
- Irreversible or high-blast-radius decisions MUST receive accountable human approval before execution.

## MUST NOT
- MUST NOT select architecture solely from preference, trend, or vendor recommendation.
- MUST NOT treat agent confidence or diagrams as evidence.
- MUST NOT hide known trade-offs or defer critical risks without an owner.

## SHOULD
- Prefer simpler and more reversible designs when requirements are uncertain.
- Revisit decisions when assumptions materially change.

## Exceptions
Exceptions require documented rationale, alternatives considered, residual risk, verification plan, and approval proportional to impact.

## Verification
Review architecture decision records, requirement traceability, benchmark or operational evidence, approval records, and implementation diffs.
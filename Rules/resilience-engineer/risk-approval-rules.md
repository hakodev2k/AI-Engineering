# Risk and Approval Rules

## Purpose
Ensure resilience engineering distinguishes analysis, recommendation, preparation, and execution, with human authority retained for dangerous actions.

## Scope
Applies to production changes, destructive recovery, failover, data operations, security controls, infrastructure actions, and accepted resilience gaps.

## MUST
- Material resilience risks MUST identify affected outcomes, likelihood or uncertainty, blast radius, mitigations, evidence, owner, and review condition.
- Recommendations MUST distinguish verified facts from assumptions and unresolved uncertainty.
- High-risk production execution MUST follow the project's authorization model and obtain human approval where required.
- Destructive SQL, data deletion, irreversible migrations, infrastructure destruction, force pushes, history rewriting, secret rotation, security weakening, and breaking public contracts MUST NOT be executed by an AI agent without explicit authorized human approval.
- Risk acceptance MUST name an accountable owner and expiration or reassessment trigger.

## MUST NOT
- MUST NOT treat implementation convenience as acceptance of business risk.
- MUST NOT claim a system is resilient when a critical failure mode remains untested or unbounded without stating the limitation.
- MUST NOT silently expand execution authority from permission to analyze or prepare.

## SHOULD
- Resilience decisions SHOULD favor reversible actions when expected outcomes are comparable.
- Significant trade-offs SHOULD be recorded close to the architecture or operational decision they govern.

## Exceptions
Emergency authority may be broader only when pre-established incident policy explicitly grants it; actions remain auditable and subject to retrospective review.

## Verification
Review approvals, risk records, change history, incident actions, architecture decisions, and evidence cited for resilience claims. Confirm execution stayed within granted authority.
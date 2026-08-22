# Business Rules Analysis Rules

## Purpose
Make decision logic explicit, consistent, and testable.
## Scope
Policies, calculations, eligibility, state transitions, thresholds, and exception logic.
## MUST
- Express material business rules with conditions, outcomes, precedence, exceptions, and source authority.
- Detect conflicting or unreachable rules before approval.
- Separate policy intent from implementation details.
## MUST NOT
- Leave critical decision logic only in code, spreadsheets, or tribal knowledge when analysis owns the requirement.
- Infer regulatory or contractual rules without authoritative evidence.
## SHOULD
- Use decision tables or equivalent models for complex branching logic.
## Exceptions
Provisional rules require an owner, expiry or review point, and explicit uncertainty.
## Verification
Review decision tables, examples, source references, edge cases, and acceptance tests.
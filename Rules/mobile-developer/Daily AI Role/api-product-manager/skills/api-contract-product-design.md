# Skill: API Contract Product Design

**Purpose:** define the consumer promise before implementation commitment. **Trigger:** new endpoint/capability, material semantic change, quota/auth/error/lifecycle change.

## Procedure
1. Start from consumer tasks and outcome.
2. Define capability boundary, ownership, entities/actions, semantics, auth scope, errors, idempotency, pagination/ordering/consistency, limits, lifecycle, and observability expectations.
3. Compare with existing contracts for consistency and duplication.
4. Classify compatibility risk and affected consumers.
5. Run compatibility, DX, security, reliability, and economics reviews in parallel when independent.
6. Consolidate conflicts and record trade-offs.
7. Produce contract recommendation and acceptance criteria for engineering handoff.

## Constraints
Do not dictate implementation internals unless they are part of the consumer promise. Do not label a semantic change safe based only on syntax.

## Output
Product contract proposal, rationale, examples, edge cases, lifecycle state, metrics, risks, review findings, approvals.

## Verification
Consumer tasks map to operations; errors/limits are explicit; compatibility reviewed; docs/examples can be derived; unresolved high-risk conflict blocks completion.
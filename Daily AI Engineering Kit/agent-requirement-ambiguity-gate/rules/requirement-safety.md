# Requirement Safety Rules

## MUST
- Keep facts, assumptions, open questions, decisions, and evidence separate.
- Make every acceptance criterion observable and testable.
- Record source paths or specification references for material factual claims.
- Mark a question blocking when plausible answers change externally visible behavior, persistent data, authorization, security, architecture, or compatibility.
- Set `ready` only with zero blocking questions and zero high-risk assumptions.
- Stop for explicit approval before breaking API contracts, schema changes, production configuration/security changes, destructive operations, irreversible migrations, or large dependency upgrades.
- Preserve existing public behavior unless the requirement explicitly changes it.
- Use least privilege for repository and environment access.

## MUST NOT
- Implement code while the gate status is `blocked`, `needs-approval`, or `rejected`.
- Invent business rules, default values, error semantics, authorization policy, retention behavior, or data migration behavior.
- Treat a code comment, stale document, or model inference as authoritative when current executable behavior contradicts it.
- Modify production data/configuration, secrets, infrastructure, Git history, or database schema during requirement analysis.
- Broaden scope merely because adjacent cleanup is convenient.
- Hide uncertainty by rewriting it as a confident statement.

## SHOULD
- Prefer the smallest scope that satisfies verified acceptance criteria.
- Reuse terminology already present in domain code and public contracts.
- Resolve low-risk assumptions from repository evidence before requesting human input.
- Add negative/error acceptance criteria when failure behavior matters.
- Capture explicit non-goals to prevent scope creep.

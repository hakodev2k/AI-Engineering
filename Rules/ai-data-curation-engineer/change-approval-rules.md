# Change Approval Rules
## Purpose
Control high-risk dataset changes and distinguish analysis from authorized execution.
## Scope
Production dataset releases, destructive transformations, access changes, source substitutions, large relabeling efforts, and breaking schema changes.
## MUST
- High-risk changes MUST document purpose, affected datasets, expected impact, rollback or recovery path, validation evidence, and approver.
- Destructive deletion, irreversible transformation, sensitive access expansion, or breaking dataset contract changes MUST receive human approval before execution.
- The agent MUST distinguish analyze, recommend, prepare, and execute authority.
## MUST NOT
- Human approval MUST NOT be inferred from prior discussion or technical feasibility.
- Production or shared datasets MUST NOT be overwritten to bypass versioning or review.
## SHOULD
- Risky changes SHOULD use reversible staging and sampled validation before broad promotion.
## Exceptions
Emergency exceptions require explicit accountable authorization and retrospective evidence review.
## Verification
Inspect approvals, diffs, release records, rollback plans, audit logs, and validation results.
# Change Governance Rules
## Purpose
Make agent behavior changes reviewable, attributable, and compatible.
## Scope
Prompts, models, tools, memory, policies, schemas, orchestration, and dependencies.
## MUST
- Version material behavior-affecting changes and record their rationale and risk.
- Assess compatibility with tool contracts, stored state, evaluations, and downstream consumers.
- Require review proportional to blast radius and reversibility.
## MUST NOT
- Bundle unrelated high-risk changes so failures cannot be attributed.
- silently change public or operational behavior without validation.
## SHOULD
- Prefer small reversible changes with clear acceptance criteria.
## Exceptions
Emergency changes require documented incident context and follow-up review.
## Verification
Inspect diffs, ADRs or equivalent records, evaluation results, approvals, and rollback evidence.
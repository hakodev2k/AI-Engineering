# Training Change Review Rules

## Purpose
Apply senior engineering judgment to changes whose blast radius can waste substantial compute or invalidate model behavior.

## Scope
Training code, data mixtures, objectives, architecture, optimizer, distributed topology, dependencies, checkpoint conversion, and release gates.

## MUST
- Material changes MUST be reviewed for correctness, reproducibility, cost, safety, compatibility, and rollback/recovery impact before large-scale execution.
- Reviews MUST identify which assumptions changed and what evidence will validate them.
- High-risk changes MUST have staged validation or a justified reason why staging is impossible.
- Reviewers MUST distinguish analysis, recommendation, preparation, and execution authority.
- Breaking public/model contracts, large dependency migrations, or security-control changes MUST require authorized human approval.

## MUST NOT
- MUST NOT approve a costly change based only on author confidence.
- MUST NOT bundle unrelated high-risk changes when doing so prevents attribution of failures.
- MUST NOT bypass review because cluster capacity is temporarily available.

## SHOULD
- Reviews SHOULD focus on failure modes and evidence, not formatting preferences.
- Risky changes SHOULD include explicit stop conditions and recovery checkpoints.

## Exceptions
Urgent incident mitigation may use expedited review, but the decision, risk, and follow-up validation must be recorded.

## Verification
Inspect change diffs, review records, risk notes, staged-run evidence, approval history, stop criteria, and post-change validation.
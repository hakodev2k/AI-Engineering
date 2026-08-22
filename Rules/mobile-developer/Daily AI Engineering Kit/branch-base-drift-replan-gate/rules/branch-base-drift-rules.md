# Rules: Branch Base Drift Replan Gate

## MUST
- Bind every implementation plan to target SHA, head SHA, merge-base SHA, plan revision, and planned scope.
- Re-evaluate branch drift before implementation resumes after interruption and before final PR completion.
- Treat target-branch advancement as evidence requiring analysis, not as harmless metadata.
- Map drift to affected plan steps, assumptions, tests, contracts, generated artifacts, shared infrastructure, and dependency boundaries.
- Preserve evidence for the old plan revision when a replan is created.
- Use deterministic scripts for SHA resolution, changed-path calculation, record validation, and final gate evaluation.
- Require independent review when drift overlaps public contracts, database schema/migrations, security controls, infrastructure, deployment/config, shared libraries, or policy-defined high-risk paths.
- Stop before production deploy, destructive SQL, schema changes, force push/history rewrite, infrastructure/secret/config changes, breaking API changes, security weakening, irreversible migrations, or large dependency upgrades until explicit human approval exists.
- Distinguish `executed` from `verified`.

## MUST NOT
- Continue from a stale plan merely because the working branch itself did not change.
- Auto-rebase, auto-merge, force-push, or rewrite history to make the gate pass.
- Mark an overlapping change irrelevant without path/dependency evidence.
- Reuse old review evidence after target/head/base fingerprints change.
- Let the planner be the only verifier for high-risk drift.
- Retry validation/business-rule failures automatically.
- Store credentials, tokens, secrets, raw customer data, or secret-bearing environment values in records.
- Use unbounded retry loops.

## SHOULD
- Replan only affected steps rather than discarding unaffected verified work.
- Prefer merge-base and changed-path evidence over commit-count heuristics.
- Broaden test scope when shared infrastructure or dependency boundaries changed.
- Keep retry count to at most one for transient read/tool failures.
- Record facts, hypotheses, decisions, evidence, and open questions separately.
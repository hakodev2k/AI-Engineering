# Engineering Rules

## MUST
- MUST attribute every observed child-agent usage event to a `task_id`, `agent_id`, `parent_id`, and explicit `role` when the source telemetry provides or can deterministically derive them.
- MUST preserve combined-only child usage as `unknown_tokens`; never invent an input/output/cache split.
- MUST count cached reads/writes explicitly when provided by the platform.
- MUST establish a measured baseline before changing child count, context, routing, retry, or budget policy.
- MUST enforce a parent-tree token ceiling and a per-child ceiling at the orchestration layer when hooks are available.
- MUST run a pre-spawn budget check before optional child fan-out.
- MUST stop or escalate mandatory security/approval/review work that cannot fit its budget; do not bypass it.
- MUST bound retries and re-analysis attempts. Default maximum for an optimization experiment is two failed hypotheses before escalation.
- MUST compare tokens per useful completed outcome, not just aggregate session tokens.
- MUST distinguish **Implemented**, **Measured**, and **Verified** in reports.
- MUST retain raw telemetry read-only for reproducibility and produce derived reports without mutating source logs.
- MUST treat unattributed/background usage as a first-class incident signal rather than silently assigning it to the parent.
- MUST fail the regression gate when the configured unknown-token ratio is exceeded if precise cost claims are required.

## MUST NOT
- MUST NOT disable security reviewers, permission checks, or verification simply to reduce token usage.
- MUST NOT silently truncate context required for correctness or security.
- MUST NOT assume every child-agent token is billable at the same rate.
- MUST NOT infer cost from a combined token total unless the provider's pricing model makes that calculation valid; otherwise report a range or unknown.
- MUST NOT use unlimited recursive subagent spawning.
- MUST NOT allow background jobs to consume an unbounded shared quota envelope.
- MUST NOT retry a child that failed for context-window or quota reasons without changing a relevant condition and checking remaining budget.
- MUST NOT claim improvement based only on UI quota percentage if task-level telemetry contradicts or cannot support it.
- MUST NOT log prompt/response content merely to obtain token attribution when IDs and counters are sufficient.

## SHOULD
- SHOULD assign separate budgets to simple guardians/classifiers, reviewers, research agents, and memory/background jobs.
- SHOULD make hidden/platform-created child usage visible in the same report as user-created children.
- SHOULD expose parent-tree usage, child share, unknown ratio, cache ratios, and tokens per completed outcome.
- SHOULD version budget policy with code and review budget changes like performance/security changes.
- SHOULD use representative workload fixtures to detect token regressions in CI.
- SHOULD prefer model-free deterministic checks for budgets, counters, IDs, and reconciliation.
- SHOULD collect duration/tool-call counts alongside tokens when available to distinguish token and latency amplification.
- SHOULD set a lower child ceiling for high-frequency approval/classifier roles than for bounded evidence-heavy reviews.
- SHOULD alert when usage grows while no user-visible outcome is produced.
- SHOULD preserve a safe fallback path: stop, summarize evidence, and request human review rather than weaken controls.

## Observable checks
A compliant integration can answer all of these from machine-readable evidence:
1. How many child agents did this parent task spawn?
2. Which roles consumed the most tokens?
3. How many tokens could not be classified by type?
4. Did any child or role exceed its configured ceiling?
5. Were optional spawns prevented after envelope exhaustion?
6. Did mandatory verification still run?
7. Did tokens per completed outcome improve without quality regression?

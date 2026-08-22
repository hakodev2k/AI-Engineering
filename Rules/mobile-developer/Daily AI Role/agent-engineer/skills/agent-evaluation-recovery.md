# Skill: Agent Evaluation and Recovery

**Purpose:** Prove an agent works under normal and failure conditions and can recover safely.

**Trigger:** Before release, after material prompt/tool/model changes, or after a production failure.

**Inputs:** task contract, traces, golden cases, adversarial cases, tool failures, budgets, production incidents.

## Procedure
1. Define evaluation dimensions: task success, factual/tool grounding, side-effect correctness, recovery, latency, token/tool cost, approval compliance.
2. Build representative success, ambiguity, missing-context, tool-timeout, rate-limit, partial-write, stale-state, and permission-denied cases.
3. Measure end outcomes instead of only model text.
4. Capture failure point, state, tool calls, retries, and verifier result.
5. Classify failure: prompt/context, planning, tool contract, state, memory, orchestration, model, permission, evaluator, or external dependency.
6. Apply the smallest fix and rerun affected cases plus regression set.
7. Limit fix-test loops to two materially similar attempts before escalation/redesign.

**Output:** evaluation report with pass/fail evidence, regressions, residual risk, and release recommendation.

**Quality:** evaluations are reproducible and tied to user/business outcomes.

**Stop:** release criteria pass or blocker is documented with owner and next action.
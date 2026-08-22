# Workflow: Measure, Compact, Verify

## Trigger
Context crosses trigger ratio, compaction repeats within a few turns, or session payload grows abnormally.

## Goal
Create durable context headroom with equal-or-better task correctness.

## Inputs
Context export, provider usage metrics, `config/budget.example.json`, required-facts checklist.

## Baseline
Record tokens, utilization, headroom, latency, session bytes, compactions/turns, data-url chars, tool-output chars, duplicate chars.

## Stages
1. **Observe** — determine whether delay/cost is model work, compaction, tool output, or persistence.
2. **Measure baseline** — run `profile_context.py` and the pre budget gate.
3. **Diagnose** — rank payload contributors and identify why they survived prior compaction.
4. **Form hypothesis** — e.g. inline images dominate; repeated tool logs dominate; duplicate history survives; target has insufficient hysteresis.
5. **Optimize once** — deduplicate, summarize, reference reloadable artifacts, truncate low-value tool output, and preserve required facts.
6. **Measure again** — profile optimized context and run `check_budget.py --phase post`.
7. **Improved?** If no, allow one revised strategy. Never run more than two compaction attempts for the incident.
8. **Verify** — independent agent compares required facts and task tests.

## Responsible agents
Context analyst for diagnosis/optimization; Context Optimization Verifier for final verification.

## Checkpoints
- CP1 baseline captured.
- CP2 required-facts ledger frozen.
- CP3 post target/headroom pass.
- CP4 correctness regression check pass.

## Metrics
Tokens/task, utilization, headroom, compactions/10 turns, latency, data-url/tool/duplicate chars, persisted bytes, required-fact retention.

## Retry policy
Maximum 2 optimization attempts. The second attempt must change the diagnosed retention strategy.

## Stop conditions
Success when target/headroom and correctness pass. Stop and escalate when two attempts fail, required facts cannot fit, or measurement is unreliable.

## Failure path
Preserve baseline and failed profiles. Start a controlled fresh context using a verified handoff ledger rather than continuing an autonomous compaction loop.

## Verification
Use actual provider token counts when available; character-based estimate is diagnostic only. Confirm task tests and required facts before declaring savings.

## Definition of Done
Baseline and after metrics exist; context is below target; minimum headroom met; payload budgets pass; required facts retained; task quality does not regress; verifier signs off.

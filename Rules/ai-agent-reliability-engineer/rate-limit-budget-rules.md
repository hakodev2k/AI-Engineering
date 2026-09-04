# Rate Limit and Budget Rules

## Purpose
Bound resource consumption so agent autonomy cannot create uncontrolled cost, quota exhaustion, or dependency overload.

## Scope
Applies to model tokens, tool calls, API requests, workflow steps, parallel branches, compute, and externally billed operations.

## MUST
- Consequential production agents MUST enforce per-run resource budgets appropriate to task risk and expected value.
- Shared services MUST enforce aggregate quotas or concurrency limits where one agent can exhaust capacity needed by others.
- Provider rate-limit signals and retry guidance MUST be propagated into orchestration decisions.
- Budget exhaustion MUST produce a controlled outcome that identifies incomplete work rather than fabricating completion.
- Retry and fan-out policies MUST account for the same end-to-end budget.
- Cost-sensitive external operations MUST expose usage or estimated cost when practical enough to support monitoring.

## MUST NOT
- Agents MUST NOT bypass provider, tenant, or organizational limits by uncontrolled parallelization or credential rotation.
- Retry loops MUST NOT continue after the remaining budget cannot support a useful attempt.
- Cost or quota exhaustion MUST NOT be hidden behind a generic model or tool failure.

## SHOULD
- Workloads SHOULD prioritize critical steps before optional enrichment when budget pressure exists.
- Dynamic throttling SHOULD use observed service capacity rather than static concurrency alone where practical.

## Exceptions
Higher or disabled budgets require documented workload evidence, expected cost and capacity impact, safeguards, and approval from the accountable owner for production systems.

## Verification
Run quota-exhaustion, provider-rate-limit, parallel-fan-out, and cost-budget tests. Inspect metrics for calls, tokens, concurrency, retry consumption, rejection, and controlled partial completion.
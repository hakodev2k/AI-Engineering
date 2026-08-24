# Hook — Pre-Dispatch Latency Budget

## Trigger
At permission-classifier start/end and immediately before tool dispatch.

## Preconditions
The runtime can emit monotonic or wall-clock timestamps for permission phases and can associate them with a stable operation ID.

## Action
Persist trace events required by `scripts/analyze_permission_trace.py`; if the configured classifier budget is exceeded, stop classifier retry escalation and route to the host's safe fallback path.

## Script / command
Offline/CI analysis:
`python3 scripts/analyze_permission_trace.py trace.jsonl --classifier-budget-ms 30000 --dispatch-budget-ms 5000`

The host may use the same state-machine semantics online. This reference hook does not itself execute tools.

## Expected result
Every classified operation has attributable phase timing. Budget violations are visible and do not silently become tool latency.

## Failure behavior
Missing/malformed phase events block performance verification. Classifier timeout/unavailability must fall back to explicit manual approval, task suspension, or a pre-existing deterministic policy decision; never auto-execute merely because the classifier failed.

## Blocks completion
Yes for performance-verification claims when trace integrity is insufficient. A runtime may continue safely through its approved fallback policy.

## Security invariant
Latency handling cannot bypass the permission boundary.
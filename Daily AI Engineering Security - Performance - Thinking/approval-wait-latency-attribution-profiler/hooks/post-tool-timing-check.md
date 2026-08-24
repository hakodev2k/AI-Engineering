# Hook: Post-Tool Timing Attribution Check

## Trigger
Immediately after an approval-gated tool completes and before its elapsed time is supplied to a model, progress generator, optimizer, or performance dashboard.

## Preconditions
A correlated trace document includes call creation and execution timestamps; approval timestamps are included when the call was gated.

## Action
Run the phase profiler, reject invalid event ordering, and expose execution-only latency separately from approval wait and wall-clock.

## Script/command
`python scripts/latency_attribution.py <trace.json> --pretty`

## Expected result
Exit code `0`, `execution_evidence_valid=true`, and explicit phase metrics. Downstream technical performance reasoning should consume `tool_execution_ms`, not raw wall-clock.

## Failure behavior
Exit `1`: mark timing evidence invalid and block performance-driven implementation changes for that call. Exit `2`: reject malformed/unreadable input and request instrumentation repair.

## Blocking
Blocks technical performance conclusions and optimization decisions, but does not block normal completion of the underlying tool action when the tool itself succeeded.

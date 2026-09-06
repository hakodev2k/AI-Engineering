# Hook: Pre-Failover Check

## Trigger
Immediately before switching a stateful run to another model provider.

## Preconditions
A provider failure is classified; portable checkpoint exists; current tool ledger is readable; fallback compatibility is known.

## Action
Run the failover analyzer and require: retry budget available, no unresolved side-effect ambiguity, no provider-specific identifiers in the portable checkpoint, and compatible required tools/features.

## Script / command
`python scripts/failover_analyzer.py --trace run.jsonl --max-retries 3 --stall-ms 30000 --output failover-decision.json`

## Expected result
Exit `0` with `decision` equal to `RETRY` or `FAILOVER` and explicit evidence. `STOP`/`RECONCILE` or invalid input blocks automatic switching.

## Failure behavior
Preserve the current checkpoint and tool ledger; do not issue another provider request; surface a recoverable failure to the orchestrator.

## Blocks completion
Yes. Automatic failover MUST NOT proceed when this hook cannot prove a safe recovery path.

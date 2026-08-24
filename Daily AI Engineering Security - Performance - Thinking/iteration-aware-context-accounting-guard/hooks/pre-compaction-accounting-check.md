# Hook: Pre-Compaction Accounting Check

## Trigger
Immediately before an automatic compaction decision when detailed usage telemetry is available.

## Preconditions
Current trace/event is serialized; window and threshold are known; no telemetry is modified in-place.

## Action
Run the analyzer and compare top-level apparent input with reconstructed final-message context.

## Command
`python3 scripts/usage_accounting_guard.py analyze current-usage.json --window 272000 --threshold 244800`

## Expected result
Exit 0 when apparent and reconstructed accounting do not create a proven false-positive compaction decision. Exit 2 when top-level accounting crosses the threshold but reconstructed final-state context does not.

## Failure behavior
Exit 1 marks accounting indeterminate and blocks a token-optimization claim. The host may retain its conservative existing compaction behavior, but it must log the ambiguity.

## Blocks completion
Yes for verification of an accounting optimization. It does not force suppression of compaction when evidence is incomplete.
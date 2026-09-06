# Hook: Pre-Score Contamination Admission

## Trigger
Immediately before a run contributes to benchmark aggregate metrics.

## Preconditions
Trace JSONL and versioned policy JSON exist; external retrieval tracing is enabled when the agent has external search capability.

## Action
Run `python scripts/scan_trace_contamination.py "$TRACE" "$POLICY"`.

## Expected result
Exit 0 and JSON status `clean`.

## Failure behavior
Exit 1 quarantines the run as contaminated or indeterminate. Exit 2 blocks scoring because the evidence pipeline is malformed. Preserve non-secret evidence and escalate.

## Blocking
Yes. Any nonzero exit MUST block score admission.
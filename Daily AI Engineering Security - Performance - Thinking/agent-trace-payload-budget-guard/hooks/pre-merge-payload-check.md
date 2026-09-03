# Hook: Pre-Merge Payload Check

## Trigger
Before merging tracing/instrumentation changes or increasing captured prompt/tool/multimodal content.

## Preconditions
Representative JSON/JSONL traces and budget configuration exist.

## Action
Run `python scripts/trace_payload_profiler.py traces.jsonl --budget config/payload-budget.json` followed by `python -m unittest tests/test_trace_payload_profiler.py`.

## Expected result
Exit 0, no configured payload violations, and unit tests pass.

## Failure behavior
Block merge until payloads are reduced, transport constraints are addressed, or a documented exception is approved. Do not remove protected structural/error fields to obtain a pass.

## Blocking
Yes for unapproved budget violations or profiler/test failures.

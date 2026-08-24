# Hook — Pre-Track Size Gate

## Trigger
Before a change tracker/diff renderer ingests full file contents and before a history serializer persists a generated event.

## Preconditions
Configured file and record byte budgets are available. The hook can obtain file/record size without fully materializing an additional copy.

## Action
For repository preflight, run the equivalent of:

`python scripts/large_change_profiler.py --repo <repo> --max-file-bytes 5000000`

For existing JSONL/history validation:

`python scripts/large_change_profiler.py --jsonl <history.jsonl> --max-record-bytes 2000000`

At runtime, use the same comparison incrementally before full-content tracking/persistence. If over budget, route to metadata/hash/bounded-excerpt or controlled artifact-reference representation.

## Expected result
Within-budget inputs proceed through normal diff/history handling. Oversized inputs produce an explicit budget finding and invoke bounded representation before expensive duplicate copies occur.

## Failure behavior
If size cannot be determined safely, do not assume it is small. For unattended paths, use bounded streaming/reference handling or block and surface evidence.

## Blocks completion
A missing full textual diff does not block completion if a verified bounded representation preserves required change evidence. Silent elision or an unbounded persisted record blocks verification.

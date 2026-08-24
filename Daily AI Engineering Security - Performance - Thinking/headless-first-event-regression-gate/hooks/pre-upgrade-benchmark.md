# Hook: Pre-Upgrade Benchmark

## Trigger
Before an AI CLI/runtime version is promoted into a shared agent image or automation environment.

## Preconditions
Known-good baseline JSON exists and the benchmark fixture is unchanged.

## Action
Run `python3 scripts/measure_first_event.py --repeat 5 --warmup 1 --baseline <baseline.json> --output <candidate.json> -- <candidate command...>` with the organization's fixed stdin/model/tool/schema arguments.

## Expected result
Exit 0 and verdict `pass`; raw candidate JSON retained.

## Failure behavior
Exit 2 or any timeout blocks promotion. Investigate using `workflows/version-regression.md`. Do not increase timeout or thresholds merely to unblock.

## Blocks completion
Yes.

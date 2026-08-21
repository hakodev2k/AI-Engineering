# Hook — Pre-Merge Cache/Compression Regression Check

## Trigger
Before merging a prompt-template, compression, retrieval, tool-schema, or model-routing change.

## Preconditions
Baseline and candidate aggregate JSON files exist and use the same benchmark definition.

## Action
Run:

`python3 scripts/cache_compression_gate.py baseline.json candidate.json --policy config/policy.json --strict`

## Expected result
Exit code `0` with decision `accept`.

## Failure behavior
Exit code `2` means invalid/missing evidence. Exit code `3` means regression or insufficient improvement. Both block completion.

## Blocking
Yes. A failing deterministic gate MUST block automated acceptance. Human override requires documented rationale and MUST NOT override critical-context loss.
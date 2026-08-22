# Hook: Pre-release Refusal Leak Check

## Trigger
Before deploying a model, policy, router, guardrail, or refusal-template change.

## Preconditions
A directory of UTF-8 refusal outputs and `config/policy.json` exist.

## Action
Run the deterministic scanner over every captured refusal, then run unit tests.

## Command
```bash
set -e
python -m unittest discover tests -v
for f in artifacts/refusals/*.txt; do
  python scripts/refusal_leak_scanner.py "$f" --policy config/policy.json
done
```

## Expected result
All files exit 0 and unit tests pass.

## Failure behavior
Exit code 4 blocks release and requires evidence review. Exit code 2 blocks release as invalid test/config state.

## Blocking
Yes. An explicit security-owner exception is required to override a false positive, and the exception must document why the matched detail is public/non-sensitive.

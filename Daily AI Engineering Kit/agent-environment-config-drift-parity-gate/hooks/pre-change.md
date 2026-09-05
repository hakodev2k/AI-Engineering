# Hook: Pre Change

## Trigger
Before editing configuration keys, providers, environment templates, CI/deployment declarations, or feature-flag contracts.

## Preconditions
Repository and non-secret configuration metadata are readable.

## Action
1. Identify config sources and consumers.
2. Normalize current environment manifests.
3. Run `python scripts/config_parity_gate.py --policy config/policy.json ...`.
4. Preserve baseline report.
5. Confirm no secret retrieval or production mutation is required.

## Expected result
Known baseline parity state and source-of-truth map.

## Failure behavior
Invalid/incomplete baseline blocks parity claims. Transient reads retry at most twice.

## Blocking
Yes.

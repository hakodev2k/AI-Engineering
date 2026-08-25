# Hook: Pre-Destructive Operation

## Trigger
Immediately before an executor performs a filesystem-destructive operation.

## Preconditions
The host has serialized `operation`, `cwd`, `targets`, `allowed_roots`, `authorized_targets`, `recursive`, and `recoverable` into a JSON request. `authorized_targets` comes from task scope/approval, not from the executor implementation.

## Action
Run the deterministic target preflight and block automatic execution unless it returns `allow`.

## Script/command
```text
python scripts/target_guard.py --input <request.json> --policy config/policy.json --output <decision.json>
```

## Expected result
Exit `0` only for an exact target set satisfying policy. Exit `20` for block, `21` for review, and `2` for invalid input/validation failure.

## Failure behavior
Any non-zero exit blocks automatic execution. A `review` result may be retried only after read-only target enumeration and explicit approval according to `workflows/preflight-execute-verify.md`. Scanner failure must not be converted to allow.

## Blocks completion
Yes. Destructive cleanup cannot be reported complete without a passing preflight (or documented reviewed approval path) and independent postcondition verification.

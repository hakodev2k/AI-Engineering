# Hook: Pre-Destructive Command

## Trigger
Immediately before a shell/tool executor receives a filesystem-destructive command.

## Preconditions
The host has serialized `command`, `cwd`, `allowed_roots`, and `authorized_targets` into a JSON request file. `authorized_targets` must originate from task scope/approval, not from the command parser.

## Action
Run the deterministic preflight and block automatic execution unless it returns `allow`.

## Command
```text
python scripts/destructive_guard.py --input <request.json> --policy config/policy.json --output <decision.json>
```

## Expected result
Exit `0` only for non-destructive commands or exact non-recursive destructive targets that satisfy policy. Exit `20` for block, `21` for review, and `2` for invalid input/internal validation failure.

## Failure behavior
Any non-zero exit blocks the executor. A `review` result may be retried only after exact target enumeration and explicit approval according to the workflow. Scanner failure must not be converted to allow.

## Blocks completion
Yes. A task cannot claim destructive cleanup completed if this hook did not pass or if independent postcondition verification is absent.

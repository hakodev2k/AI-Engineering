# Hook: Pre Repository Write
## Trigger
Immediately before an agent performs a repository-changing or identity-affecting action.
## Preconditions
Actor identity, action, target branch, change reference, and approval metadata are serialized to an event JSON file.
## Action
Run:
```bash
python scripts/repo_action_guard.py --event <event.json> --policy config/policy.json
```
## Expected result
Exit `0` with `decision=allow` before execution.
## Failure behavior
Any non-zero exit blocks the action. Preserve reason codes and the immutable task/change reference; never log credentials.
## Blocking
Yes. The hook MUST fail closed.
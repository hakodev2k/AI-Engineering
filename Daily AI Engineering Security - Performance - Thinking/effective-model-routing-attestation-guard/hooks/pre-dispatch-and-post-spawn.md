# Hook — Pre-Dispatch and Post-Spawn Routing Gate

## Trigger
Pre-dispatch for routing-sensitive tasks and post-spawn/post-resume before result acceptance.

## Preconditions
The host can write an intent JSON record and export effective runtime routing metadata to an observed JSON record.

## Action
1. Pre-dispatch: require `task_id`, `model`, and `reasoning_effort`; persist optional provider/service tier/sandbox mode and `allow_inherit` when material.
2. Post-spawn: collect runtime metadata from a host-controlled source.
3. Execute:

```sh
python scripts/model_route_guard.py --intent .routing/intent.json --observed .routing/observed.json --output .routing/attestation.json
```

## Expected result
Exit code `0` and `status=pass`.

## Failure behavior
- Exit `2`: block acceptance, preserve attestation, diagnose drift, and allow at most two corrective redispatches through the workflow.
- Exit `3`: block acceptance because input/evidence is malformed or unreadable.
- Never convert failure to pass by weakening the intended profile after execution.

## Blocks completion
Yes, for any task marked routing-sensitive.

## Security and privacy
Observed metadata should contain routing fields and opaque task identifiers only. Do not copy prompts, credentials, access tokens, or unrelated transcript content into attestation artifacts.

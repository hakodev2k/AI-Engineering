# Hook — Pre Model Exposure

## Trigger
Immediately before sending the effective tool list to a model and after every dynamic tool refresh.

## Preconditions
Current inventory has stable server-instance identifiers and approval keys.

## Action
Run `python scripts/validate_tool_identities.py <inventory.json>`.

## Expected result
Exit code 0 and `decision=allow` with zero unresolved collisions.

## Failure behavior
Block the model request for the affected generation; do not silently drop or choose a collision winner.

## Blocking
Yes. Failure blocks exposure until the tool identity map is corrected and revalidated.

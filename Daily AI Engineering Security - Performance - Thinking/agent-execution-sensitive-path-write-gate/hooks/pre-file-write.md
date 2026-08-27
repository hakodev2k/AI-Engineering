# Hook — Pre File Write

## Trigger
Immediately before an AI agent performs a filesystem write.

## Preconditions
`path`, `workspace_root`, and approval state are available; policy file is readable.

## Action
Create a JSON request and run:

`python scripts/write_gate.py --request <request.json> --policy config/sensitive-paths.json`

## Expected result
Exit `0`: write may proceed. Exit `3`: explicit human approval required. Exit `4`: write blocked. Exit `2`: guard/configuration failure.

## Failure behavior
Any non-zero exit blocks the write. Guard/configuration errors fail closed.

## Blocking
Yes.

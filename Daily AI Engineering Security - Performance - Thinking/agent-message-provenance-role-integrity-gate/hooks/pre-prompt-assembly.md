# Hook: Pre Prompt Assembly

## Trigger
Before any normalized message is inserted into model context or used to authorize a tool.

## Preconditions
Message envelope and `config/policy.json` are available.

## Action
Serialize the candidate message and run:
`python scripts/message_provenance_guard.py --message <message.json> --policy config/policy.json`

## Expected result
Exit 0 only when role/source invariants and privileged-action requirements pass.

## Failure behavior
Exit 3 blocks prompt insertion/tool authorization and records message ID plus reason codes without content secrets. Exit 2 blocks on invalid input/configuration.

## Blocking
Yes.

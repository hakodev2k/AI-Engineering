# Pre-Handoff Validation Hook

## Trigger
Immediately before a structured AI artifact is consumed by another stage or tool.

## Preconditions
Candidate JSON exists; package root is current directory; Python and `jsonschema` are available.

## Action
Run `python scripts/run_gate.py <candidate-json>`.

## Expected result
Exit 0 and `VALID` on stdout.

## Failure behavior
Exit 1 blocks handoff and enters the bounded repair workflow. Exit 2/3 blocks handoff as environment/tool failure. Never bypass the hook by weakening the schema.

## Blocking
Yes.

# Hook: Pre-Resume Integrity Check

## Trigger
Immediately before replaying or resuming durable agent session state.

## Preconditions
Normalized session JSON and `config/integrity-policy.json` exist.

## Action
Run:

`python scripts/session_integrity.py SESSION.json --policy config/integrity-policy.json --strict`

Optionally supply `--compare OTHER_SESSION.json` to require normalized parity with an equivalent execution mode.

## Expected result
Exit code 0 and verdict `valid`.

## Failure behavior
- Exit 2: invalid input/config; block resume.
- Exit 3: integrity violation; block resume.
- Exit 4: manual review required because executed side effects cannot be proven safely committed.

## Blocking
Yes. Resume/replay is blocked on every non-zero result.

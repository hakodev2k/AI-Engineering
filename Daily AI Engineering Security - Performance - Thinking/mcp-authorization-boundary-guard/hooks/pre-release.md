# Hook: Pre-release Authorization Gate

## Trigger
Before merge/release of an MCP authorization, session, transport, or tool-permission change.

## Preconditions
Python 3.9+; project-specific policy copied from `config/policy.example.json` and reviewed.

## Action
Run deterministic authorization matrix tests before higher-level integration tests.

## Script/command
`python scripts/run_negative_tests.py --policy config/policy.example.json`

For a real project, point `--policy` at the reviewed project policy and extend the fixtures to cover its principals/resources/tools.

## Expected result
Exit code 0 and every expected-deny attack case reports `PASS`.

## Failure behavior
Block completion. Store the failed case name and checker decision. Do not automatically broaden permissions or disable checks.

## Blocking
Yes. Security failures are release-blocking.

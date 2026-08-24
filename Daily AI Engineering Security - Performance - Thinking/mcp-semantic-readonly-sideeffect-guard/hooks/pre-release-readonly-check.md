# Hook: Pre-Release Read-Only Check

## Trigger
Before releasing or enabling a changed MCP database integration.

## Preconditions
Python 3.10+, fixtures available, no production mutation target.

## Action
Run `python -m unittest tests/test_readonly_guard.py` and require a separate privilege attestation from the deployment environment.

## Expected result
All semantic-write fixtures are blocked and benign read fixtures are accepted.

## Failure behavior
Any failed test or missing privilege attestation blocks completion.

## Blocking
Yes. This hook MUST NOT be bypassed by lowering test coverage or broadening credentials.
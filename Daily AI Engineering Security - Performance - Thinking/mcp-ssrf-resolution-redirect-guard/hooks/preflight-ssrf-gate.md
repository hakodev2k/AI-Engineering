# Hook: Preflight SSRF Gate

## Trigger
Before merging or deploying changes to an MCP/browser/fetch code path that accepts URLs or follows redirects.

## Preconditions
Python 3.10+ is available; package files are checked out from the package root.

## Action
Run:

```bash
python -m unittest tests/test_url_guard.py
python scripts/url_guard.py --policy config/policy.json --url https://example.com --resolved-ip 93.184.216.34
```

Production integrations SHOULD add their own HTTP-client tests proving the same decision runs on every redirect and immediately before connection.

## Script/command
The unit suite is the blocking deterministic gate. The CLI invocation is a smoke check for an allowed public fixture.

## Expected result
Tests exit 0; safe fixture exits 0 with `allowed: true`; unsafe fixtures in the test suite are denied.

## Failure behavior
Block completion. Preserve the failing fixture and reason. Do not delete or relax an unsafe-address test to make the hook pass.

## Blocks completion
Yes.

# Pre-change Scan Hook

## Trigger
Before editing resilience or outbound-client code.

## Preconditions
Python 3 available; repository root is current directory; package `config/gate-policy.json` is present.

## Action
Run `python scripts/scan-resilience.py --root . --policy config/gate-policy.json --output circuit-breaker-findings.before.json`.

## Expected result
JSON baseline records current findings and blocking count.

## Failure behavior
Exit 1 means blocking findings exist and must be investigated; exit 2 means invalid environment/input. Preserve output. Retry environment/tool failure at most twice.

## Blocking
Yes for unexplained high/critical findings or invalid scanner execution. Existing accepted findings require explicit evidence, not silent suppression.

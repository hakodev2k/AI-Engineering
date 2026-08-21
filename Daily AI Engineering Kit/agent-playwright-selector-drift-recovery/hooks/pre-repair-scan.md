# Hook: Pre-Repair Selector Scan

## Trigger
Before editing a failing Playwright selector.

## Preconditions
Relevant Playwright test root is known and Python 3 is available.

## Action
Run:

`python scripts/scan-selectors.py <test-root> --json-out selector-scan.json`

## Expected result
A JSON inventory of brittle selector patterns and preferred locator guidance.

## Failure behavior
- Exit code `0`: no high-risk pattern detected; continue.
- Exit code `2`: high-risk patterns detected; continue investigation but require explicit evidence before preserving or adding such patterns.
- Other error: retry once only if the failure is transient; otherwise block automated repair and preserve stderr.

## Blocking
Tool execution failure blocks automated repair. A risk finding does not block investigation by itself.

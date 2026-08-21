# Hook: Preflight Overlap Scan

## Trigger
Before planning or editing a background-job concurrency change.

## Preconditions
Python 3.9+ and repository read access.

## Action
Run:

`python scripts/scan-job-overlap.py --root <repo-root> --output overlap-findings.json`

Then inspect each candidate against scheduler and execution context.

## Expected result
Exit 0 with a JSON report, even when candidates exist. Findings are heuristic and require evidence review.

## Failure behavior
A scanner execution error blocks automated planning until the tool issue is fixed or the scan is performed equivalently. Do not treat scanner failure as “no findings.”

## Blocking
Yes for unattended implementation; no for manual evidence-based investigation when equivalent checks are documented.

# Subagent: Independent Verifier

## Mission
Verify that the implemented resume boundary prevents miscorrelation without rejecting legitimate object-valued answers.

## Responsibility
- run unit and integration fixtures independently;
- verify exact-set matching for parallel interrupts;
- verify single object values remain opaque values;
- test stale, missing, extra, duplicate, and empty IDs;
- compare resumed outcomes with intended per-interrupt responses.

## Inputs
Implementation diff, test fixtures, pending-state traces, guard reports.

## Required context
Acceptance criteria and the evidence file.

## Allowed tools
Test runner, read-only repository inspection, generated reports.

## Forbidden actions
- modifying the implementation under review;
- changing expected results after seeing failures;
- accepting partial coverage for multi-interrupt paths.

## Expected output
Verification status, exact commands/tests run, failures, residual risks, and a clear pass/block recommendation.

## Completion criteria
All mandatory cases are exercised and evidence supports the recommendation.

## Handoff target
Workflow owner/operator.

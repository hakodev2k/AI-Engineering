# Workflow: Verify Regression
**Trigger:** changes to MCP registration, stdio spawning, allowlists, or approvals.  
**Goal:** prevent executable-only authorization from returning.

## Baseline
Known-good structured launches and known-bad wrapper/shell fixtures.

## Stages
1. Run unit tests.
2. Verify exact contract passes.
3. Verify `npx -c`, shell metacharacters, wrong package, and unknown server fail.
4. Inspect integration to confirm guard executes before spawn.
5. Confirm logs omit secrets.

## Metrics
Test pass rate, malicious fixture block rate, false positives.

## Retry policy
One implementation correction and one full rerun.

## Stop conditions
Any malicious fixture reaches spawn or any policy ambiguity remains.

## Verification
Reviewer must be different from implementer for high-risk changes.

## Definition of Done
All fixtures pass and the spawn boundary is no weaker than baseline.

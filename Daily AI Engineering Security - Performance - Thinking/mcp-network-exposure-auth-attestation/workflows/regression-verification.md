# Workflow: Regression Verification

## Trigger
Any change to MCP server version, container image, listener configuration, proxy, authentication middleware, or enabled tool set.

## Goal
Detect exposure regressions before release.

## Inputs
Known-good baseline, candidate effective-state snapshot, policy, unit tests.

## Baseline
Last independently verified listener/auth/capability state.

## Stages
1. Run `python -m unittest tests/test_exposure_attestor.py`.
2. Compare candidate listener count and bind scope with baseline.
3. Compare auth/TLS enforcement per listener.
4. Compare high-risk capability set and outbound/credential combination.
5. Run the attestor on candidate state.
6. If blocked, allow one configuration correction and one rerun.
7. Independent verifier reviews final evidence.

## Outputs
Test result, attestation result, baseline delta, verification decision.

## Metrics
Regression count, newly public listeners, newly enabled high-risk capabilities, policy pass rate.

## Retry policy
Maximum 1 correction cycle.

## Stop conditions
Any unresolved public unauthenticated listener, missing evidence, secret leakage, or failed test blocks completion.

## Failure path
Hold release and restore the last verified network/auth boundary when safe.

## Verification
Verifier must be separate from the implementer for public/high-risk deployments.

## Definition of Done
Tests pass, candidate state is measured, no weaker boundary exists without approved exception, and reviewer marks verification complete.

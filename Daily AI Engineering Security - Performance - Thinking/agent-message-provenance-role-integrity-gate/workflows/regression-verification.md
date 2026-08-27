# Workflow: Regression Verification

**Trigger:** any change to advisor, subagent, peer-session, structured-output, or message-normalization paths.  
**Goal:** prove role/source invariants before release.

## Inputs
Policy, guard script, test fixtures, routing diff.

## Baseline
Known-good authenticated-user messages and known-bad assistant/tool/subagent/peer-session promotions.

## Stages
1. Run unit tests.
2. Verify legitimate authenticated user messages remain accepted.
3. Verify every non-user source promoted to `role=user` is blocked.
4. Verify missing provenance fails closed.
5. Verify privileged actions require trusted origin and approval.
6. Inspect logs for secret-free reason codes.

## Checkpoints
After tests and before release sign-off.

## Metrics
Attack-fixture block rate = 100%; benign fixture pass rate = 100%; privileged approval coverage = 100%.

## Retry policy
One correction and one full rerun.

## Stop conditions
Any false allow for synthetic user role, secret exposure, or missing provenance blocks release.

## Failure path
Revert or disable the affected route; preserve evidence; escalate.

## Verification
Security Verifier must be independent of the implementer.

## Definition of Done
All deterministic tests pass and source-role boundaries are unchanged or stricter.

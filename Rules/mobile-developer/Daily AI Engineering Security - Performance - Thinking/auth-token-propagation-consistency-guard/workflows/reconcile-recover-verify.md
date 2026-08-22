# Workflow: Reconcile → Recover → Verify

## Trigger
Login completed, refresh failure, backend 401, reconnect, or pre-authenticated action contract failure.

## Goal
Restore one coherent authenticated principal across UI, credential store, app-server, and request layer without credential leakage or identity fallback.

## Inputs
Redacted component observations, auth events, expected principal if known.

## Baseline
Capture which components report authenticated, principal IDs, credential presence/expiry, and whether the last request attached a credential.

## Stages
1. Observe baseline and run the contract checker.
2. Diagnose missing credential, stale/expired credential, principal mismatch, or stale component state.
3. Form a recovery hypothesis.
4. If appropriate, perform one refresh attempt.
5. Recollect all observations and measure convergence.
6. If still incoherent, perform one explicit re-auth transition; never switch principals silently.
7. Recollect observations again and run a harmless authenticated identity/status check where supported.
8. Independent verifier returns PASS or BLOCK.

## Responsible agent
Auth implementation owner performs recovery; Auth Boundary Verifier validates the result.

## Outputs
Before/after redacted state, recovery events, verification result, final decision.

## Checkpoints
No privileged request when the request path lacks credentials. No principal substitution. No raw token logging. Every recovery transition followed by fresh observations.

## Metrics
401-after-login rate, split-brain detections, prevented tokenless requests, recovery latency, recovery attempt count, principal mismatch count.

## Retry policy
One refresh + one re-auth maximum.

## Stop conditions
Principal conflict, second failed recovery, unavailable auth metadata, or identity verification mismatch.

## Failure path
BLOCK authenticated operations, retain non-sensitive diagnostic evidence, surface a clear auth failure, and require operator/user re-establishment of the intended identity.

## Definition of Done
One principal is consistent across components, actual request path has a usable credential, verification succeeds, no secret material was logged, and independent review passes.
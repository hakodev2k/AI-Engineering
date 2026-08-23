# Token Policy Change Review

## Purpose
Review proposed authentication/authorization policy changes before merge or deployment.

## Inputs
Current and proposed issuer/audience/scope settings, affected routes, caller identities, tests, and rollout environment.

## Procedure
1. Diff current and proposed policy values.
2. Flag any broadened issuer, audience, scope, role, clock-skew, or claim requirement.
3. Confirm each new audience maps to an intended resource identifier.
4. Confirm scopes/roles map to operations and do not implicitly grant admin/write access.
5. Verify cryptographic validation is unchanged or stronger.
6. Run `scripts/token_gate.py` against representative pass/fail claim fixtures.
7. Run service unit/integration tests.
8. Require independent verification for any production relaxation.
9. Produce `passed`, `blocked`, or `approval-required` with concrete evidence.

## Verification
The proposed policy rejects wrong-resource tokens, insufficient permissions, expired/not-yet-valid tokens, unknown issuers, and missing client identity.

## Failure handling
Do not retry semantic validation failures. Tool/transient failures may retry twice. Stop on ambiguous production-impacting changes.

## Stop conditions
Production policy relaxation, new privileged scope/role, identity-provider change, or audience broadening requires explicit human approval.

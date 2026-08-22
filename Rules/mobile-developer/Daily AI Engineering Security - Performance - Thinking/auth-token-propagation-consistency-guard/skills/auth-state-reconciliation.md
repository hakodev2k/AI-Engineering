# Skill: Auth State Reconciliation

## Purpose
Verify that all components participating in an authenticated agent action agree on effective identity and credential availability without exposing secret material.

## Trigger
Login completion, refresh completion/failure, process reconnect, 401/403, or immediately before an authenticated backend/tool request.

## Inputs
Component observations: component name, `authenticated`, principal/account identifier, credential-present boolean, expiry state/time, credential generation/source, last transition timestamp.

## Preconditions
Raw tokens, refresh tokens, API keys, cookies, and biscuits are excluded from the reconciliation payload.

## Allowed tools
Safe auth metadata APIs, credential-store status, app-server auth status, deterministic `auth_state_contract.py`.

## Constraints
MUST NOT log raw credentials. MUST NOT silently switch to a different principal or credential class. MUST fail closed when identity continuity cannot be proven for a privileged action.

## Procedure
1. Collect observations from UI/session, credential store, app-server, and request layer.
2. Normalize principal identifiers and timestamps.
3. Reject any state where the UI says authenticated but the request path lacks a credential.
4. Reject conflicting non-empty principals.
5. Treat expired credentials as unavailable.
6. If all principals agree but credential is missing/expired, select bounded REFRESH/REAUTH rather than sending the request.
7. After recovery, recollect observations and verify convergence.

## Decision points
PASS only when the effective request path has a usable credential and no principal conflict. REFRESH when a refresh path is valid and bounded. REAUTH when refresh cannot restore coherence. BLOCK on mismatch, unknown principal for a privileged action, or repeated recovery failure.

## Expected output
A redacted JSON decision with component states, mismatches, decision, and verification timestamp.

## Metrics
Split-brain count, tokenless-request prevention count, principal mismatch count, 401-after-login rate, recovery attempts/latency.

## Verification
Issue a harmless authenticated identity/status request where available and compare returned principal with the contract before permitting higher-impact calls.

## Failure handling
One refresh attempt and one re-auth transition maximum; after that BLOCK and surface explicit auth failure.

## Stop conditions
Principal mismatch, two failed recovery transitions, or inability to obtain safe auth metadata.
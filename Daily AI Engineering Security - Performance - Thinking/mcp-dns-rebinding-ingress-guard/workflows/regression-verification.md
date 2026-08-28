# Workflow: Regression Verification

**Trigger:** SDK/server upgrade, proxy change, transport change, or security fix.  
**Goal:** prove ingress security did not regress.

## Baseline
Use the last passing policy and hostile request fixtures.

## Stages
1. Run `python -m unittest tests/test_ingress_guard.py`.
2. Confirm allowed local traffic remains usable.
3. Confirm attacker-controlled `Host` is rejected.
4. Confirm attacker-controlled `Origin` is rejected.
5. Confirm wildcard origin and public bind are rejected by policy.
6. Confirm consequential tools fail closed without authentication.
7. Inspect decision logs for reason codes and absence of secrets.
8. Independent reviewer validates the runtime layer actually applies equivalent controls.

## Metrics
All security fixtures pass; zero unapproved consequential-tool paths; zero secrets in test/log artifacts.

## Retry policy
One implementation correction followed by one complete rerun.

## Stop conditions
Any privileged action from hostile origin, secret exposure, or second failed run blocks completion.

## Failure path
Rollback the ingress change or disable HTTP transport; escalate to security owner.

## Verification
Must be performed by someone other than the implementation owner for high-risk changes.

## Definition of Done
Implemented controls are present, measured fixtures pass, and independent runtime verification is complete.

# Workflow: Regression Verification

**Trigger:** any change to tool registration, selection, authorization, dispatch, approval, or framework version.  
**Goal:** prove request-scoped authorization remains enforced at execution time.

## Baseline
Known-good fixtures for advertised allow, hidden deny, high-risk approval deny/allow, and context mismatch deny.

## Stages
1. Run unit tests.
2. Exercise dispatcher directly rather than relying on model behavior.
3. Compare advertised tool set with executed tool set.
4. Verify high-risk approval binding.
5. Verify authorization/dispatch context identity.
6. Inspect logs for reason codes and absence of secrets.

## Checkpoints
All four boundary fixtures must pass before completion.

## Metrics
Unauthorized-dispatch rate = 0; context-mismatch allows = 0; high-risk unapproved allows = 0.

## Retry policy
One correction and one complete rerun.

## Stop conditions
Any boundary bypass blocks completion.

## Failure path
Revert or disable the changed dispatch path and escalate.

## Verification
A reviewer other than the implementer confirms results.

## Definition of Done
All deterministic tests pass and execution scope is equal to or narrower than advertised scope.

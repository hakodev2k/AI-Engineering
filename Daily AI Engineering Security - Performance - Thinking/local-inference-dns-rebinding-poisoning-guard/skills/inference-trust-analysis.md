# Skill: Local Inference Trust Analysis

## Purpose
Verify that a local model server's effective network exposure and model template integrity match declared security policy.

## Trigger
Agent startup, inference-runtime upgrade, container-network change, model creation/update, or security review.

## Inputs
Listener state, authentication state, effective network scope, model template, approved template fingerprint.

## Preconditions
Inspection must not mutate models or network policy.

## Allowed tools
Read-only socket/listener inspection, model metadata queries, firewall/network-policy inspection, `scripts/inference_guard.py`.

## Constraints
MUST NOT expose an unauthenticated management API to non-loopback interfaces. MUST NOT silently rebaseline a changed model template.

## Procedure
1. Record declared bind/network policy.
2. Measure actual bind address and effective reachability.
3. Identify whether management endpoints are exposed and authenticated.
4. Hash the current model template and compare with approved baseline.
5. Run the deterministic guard.
6. On any mismatch, block agent startup and collect evidence.
7. Rebaseline only after independent review of the intended template change.

## Expected output
Pass/block decision with listener, policy and template-integrity reasons.

## Metrics
Non-loopback listeners, policy mismatches, fingerprint drift events, blocked startups, regression pass rate.

## Verification
Independent reviewer reproduces listener scope and fingerprint result.

## Failure handling
Fail closed; isolate the runtime; restore approved network/template state.

## Stop conditions
Stop on unexplained network exposure, template drift, or missing baseline. Maximum one remediation attempt before escalation.

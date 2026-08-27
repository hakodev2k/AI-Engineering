# Workflow: Startup Integrity Verification

## Trigger
Before a privileged agent connects to a local inference runtime.

## Goal
Verify network exposure and model integrity before granting the model influence over agent tools.

## Inputs
Runtime state, listener inventory, declared policy, model template, approved fingerprint.

## Baseline
Capture approved bind address, effective network scope, management API state and template fingerprint.

## Stages
1. Observe actual listeners and network policy.
2. Measure declared versus effective scope.
3. Diagnose unauthenticated management reachability.
4. Form the hypothesis that any mismatch creates an external control path.
5. Run `scripts/inference_guard.py`.
6. If blocked, remediate once by restoring approved bind/auth/template state.
7. Measure again.
8. Run regression tests and independent verification.

## Responsible agent
Inference Trust Analyst; Security Verifier is independent.

## Tools
Read-only socket/firewall inspection, model metadata inspection, guard script, unit tests.

## Outputs
Guard JSON, measured listener state, fingerprint result, reviewer decision.

## Checkpoints
After listener measurement; before rebaseline; after remediation.

## Metrics
Non-loopback listener count, policy mismatches, drift events, blocked startups, regression pass rate.

## Retry policy
Maximum 1 remediation attempt and 1 verification rerun.

## Stop conditions
Unauthenticated non-loopback management exposure, unexplained template drift, missing baseline, or exhausted retry blocks completion.

## Failure path
Stop the agent, isolate the inference runtime, restore approved state, escalate if integrity cannot be established.

## Verification
Run `python -m unittest tests/test_inference_guard.py`; independent reviewer reproduces listener scope and template hash.

## Definition of Done
Implemented guard integrated; measured effective state captured; verified tests and independent review pass with no unsafe exposure.

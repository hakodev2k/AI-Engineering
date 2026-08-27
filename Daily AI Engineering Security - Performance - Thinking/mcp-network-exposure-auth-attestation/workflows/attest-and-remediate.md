# Workflow: Attest and Remediate MCP Exposure

## Trigger
New deployment, restart, upgrade, proxy/network change, authentication change, or tool-capability change.

## Goal
Prove that effective runtime exposure matches the intended trust boundary.

## Inputs
Observed state JSON, policy, deployment topology, change diff.

## Baseline
Capture current listeners, TLS/auth enforcement, capabilities, outbound network and secret access before any change.

## Stages
1. **Observe:** collect runtime listener and route evidence.
2. **Measure baseline:** run `scripts/exposure_attestor.py` and store sanitized result.
3. **Diagnose:** map each reason code to listener/config/runtime source.
4. **Hypothesize:** define the smallest control change expected to remove the violation.
5. **Implement:** change bind/auth/TLS/capability configuration; dangerous or public exposure changes require human approval.
6. **Measure again:** recapture effective state and rerun the attestor.
7. **Improved?** If no, re-evaluate once; maximum 2 remediation attempts total.
8. **Verify:** independent Security Verifier reproduces state and tests.

## Tools
Runtime/socket inspection, config inspection, container/proxy metadata, Python attestor, unit tests.

## Outputs
Before/after state, reason-code delta, reviewer decision, residual risks.

## Checkpoints
After baseline, before public-listener changes, after remediation, before completion.

## Metrics
Violation count, unauthenticated public listener count, high-risk public listener count, verification coverage.

## Retry policy
Maximum 2 remediation attempts. Never weaken security or evidence requirements to force a pass.

## Stop conditions
Stop and block deployment on secret exposure, incomplete listener evidence, unresolved public high-risk access, or exhausted retries.

## Failure path
Bind service to loopback or disable the affected MCP endpoint; escalate to security owner.

## Verification
Unit tests pass and independent reviewer confirms effective state.

## Definition of Done
Implemented: deployment control changed where required. Measured: before/after effective state captured. Verified: policy passes independently with no secret exposure and no blocking issue.

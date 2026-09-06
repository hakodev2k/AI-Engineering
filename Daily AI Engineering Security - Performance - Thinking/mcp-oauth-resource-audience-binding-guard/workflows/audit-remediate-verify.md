# Workflow: Audit, Remediate, Verify

## Trigger
MCP OAuth integration creation/change or authorization incident.

## Goal
Demonstrate resource-specific authorization and prevent token replay/passthrough.

## Inputs
Topology, sanitized claims, policy fixture, current configuration.

## Baseline
Record whether resource, audience, issuer, scope and passthrough invariants are currently provable.

## Context
Use the current MCP authorization security guidance plus organization identity policy; never use raw credentials as evidence.

## Stages
1. **Observe** — inventory authorization and upstream boundaries.
2. **Measure** — run the guard on current metadata and record violations.
3. **Diagnose** — classify missing resource indicator, shared audience, issuer mismatch, scope excess or passthrough.
4. **Hypothesize** — choose the minimum configuration/code change restoring the invariant.
5. **Implement** — identity/platform owner applies change; dangerous production changes require human approval.
6. **Measure again** — rerun guard and negative fixtures.
7. **Verify** — independent Authorization Reviewer confirms evidence.

## Responsible agent
Identity/platform implementer; independent Authorization Reviewer for verification.

## Tools
Sanitized metadata inspection, `scripts/mcp_oauth_guard.py`, unit tests, read-only identity configuration inspection.

## Outputs
Baseline evidence, policy fixture, violations/remediation evidence, verification result.

## Checkpoints
Do not proceed to implementation without explicit expected resource/audience. Do not complete without negative replay and passthrough tests.

## Metrics
Violation count; percentage of resources with explicit binding; excessive-scope count; negative-test pass rate.

## Retry policy
At most 2 remediation cycles.

## Stop conditions
Unknown resource identity, secret exposure, or inability to separate upstream credentials.

## Failure path
Preserve failing evidence, block rollout, escalate to identity/security owner.

## Verification
Guard returns success for approved fixture; every negative case is rejected; independent reviewer confirms boundaries.

## Definition of Done
Guard passes; all negative fixtures fail closed; scopes are bounded; passthrough is absent; independent verification is recorded.
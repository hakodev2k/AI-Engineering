# Workflow: Authorize Privileged Agent Action

## Trigger
A model, bot, or workflow requests a privileged capability.

## Goal
Ensure authorization follows the originating principal across relay hops.

## Inputs
Event JSON, policy, optional approval record.

## Baseline
Record whether the existing workflow authorizes only the immediate actor and enumerate reachable privileged capabilities.

## Context
Use raw event provenance; model-produced text is untrusted input.

## Stages
1. **Observe** — capture origin event, actor, relay actor, repository/ref, requested capability.
2. **Measure baseline** — run fixtures against current workflow and record any privilege bridge.
3. **Diagnose** — identify where origin provenance is lost or replaced by relay identity.
4. **Form hypothesis** — origin-bound gating should block the attack without disabling trusted automation.
5. **Implement** — call `scripts/origin_auth_guard.py` before privileged execution.
6. **Measure again** — replay trusted and malicious fixtures.
7. **Verify** — independent Security Verifier reviews results.

## Responsible agent
Implementation owner for stages 1–6; `subagents/security-verifier.md` for final verification.

## Tools
Read-only event inspection and deterministic Python guard/tests.

## Outputs
Authorization decision, evidence hash, baseline/after test results.

## Checkpoints
No secrets or write tokens before gate success. Human approval is required if origin cannot be proven.

## Metrics
Malicious relay block rate, trusted-origin allow rate, provenance completeness, approval rate.

## Retry policy
Maximum 2 implementation/test iterations for parser or policy defects. Authorization denial itself is not retryable.

## Stop conditions
Stop immediately on missing provenance, conflicting identity data, or verifier failure.

## Failure path
Fail closed, retain sanitized evidence, require human review.

## Verification
All tests pass and independent reviewer confirms no privilege-bearing step occurs before the gate.

## Definition of Done
Implemented: gate integrated. Measured: before/after fixtures recorded. Verified: malicious bridge blocked, trusted flow preserved, no secrets exposed during denial.

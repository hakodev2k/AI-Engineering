# Workflow: Harden and Verify MCP Listener Exposure

## Trigger
Remote-capable HTTP/SSE MCP deployment or security review.

## Goal
Move from observed exposure to an evidence-backed, fail-closed listener boundary.

## Inputs
Current deployment, network topology, policy JSON, tool privilege map, authentication/authorization configuration.

## Baseline
Capture effective bind addresses, published ports, unauthenticated response behavior, proxy path, and privileged tool set before changes.

## Stages
1. **Observe** — assessor records runtime listener and reachable paths.
2. **Measure baseline** — run policy checker and safe unauthorized initialization/tool-call probe.
3. **Diagnose** — identify whether failure comes from bind scope, missing auth, missing authorization, proxy bypass, Origin handling, or credential amplification.
4. **Form hypothesis** — choose the smallest secure change: loopback-only binding, mandatory authentication, scoped authorization, backend isolation, Origin validation, or combinations.
5. **Implement improvement** — apply secure defaults without weakening tool or credential boundaries.
6. **Measure again** — rerun deterministic checker and negative probes.
7. **Improved?** If no, re-evaluate once and perform one revised implementation attempt. Maximum 2 implementation attempts.
8. **Independent verification** — security verifier reviews evidence and confirms unauthorized requests fail before dispatch.

## Responsible agent
Exposure assessor for diagnosis; implementation owner for changes; independent Security Verifier for final verification.

## Tools
`scripts/listener_policy_check.py`, deployment inspection, listener inspection, safe HTTP probes, existing auth tests.

## Outputs
Before/after policy result, network evidence, negative-test result, residual-risk record.

## Checkpoints
After baseline, after implementation, and before final approval.

## Metrics
Zero unauthenticated remote dispatches; zero proxy bypass paths; 100% required security tests passing.

## Retry policy
Maximum 2 remediation attempts. Never retry by broadening network access or disabling security controls.

## Stop conditions
PASS with independent verification, or blocked with explicit unresolved exposure.

## Failure path
Keep deployment blocked; preserve evidence; escalate to platform/security owner. Dangerous or irreversible production changes require explicit human approval.

## Verification
Unauthorized request rejected before tool handler; authenticated authorized request still works; policy checker passes; secrets absent from logs.

## Definition of Done
Implemented, measured, and independently verified with no blocking exposure remaining.

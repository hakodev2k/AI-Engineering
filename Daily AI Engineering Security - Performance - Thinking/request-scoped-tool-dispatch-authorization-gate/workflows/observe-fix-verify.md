# Workflow: Observe → Fix → Verify

## Trigger
A framework advisory, resolver change, dynamic tool injection, privilege-tier change, or failed authorization conformance test.

## Goal
Make request-scoped tool authorization a deterministic pre-dispatch invariant.

## Inputs
Representative requests, registry/tool metadata, subject/tenant context, policy config, dispatch traces, negative attack corpus.

## Baseline
Run the verifier against current traces and record unauthorized callbacks, decision coverage, false denials, and p95 gate latency.

## Context
The model may emit arbitrary tool names. Retrieved content and MCP/tool descriptions are untrusted. Security policy must therefore be evaluated outside model reasoning.

## Stages
1. **Observe** — Security reviewer maps advertisement → canonicalization → resolution → callback.
2. **Measure baseline** — Capture current decision matrix and any out-of-scope dispatch.
3. **Diagnose** — Identify broader-registry fallback, alias mismatch, missing identity binding, or late callback-only checks.
4. **Hypothesis** — State one falsifiable claim, e.g. "removing global resolver fallback blocks forged admin calls without denying authorized controls."
5. **Implement** — Add/repair immutable request allowlist and fail-closed gate.
6. **Measure again** — Re-run identical corpus.
7. **Improved?** — If no, re-evaluate once; maximum 2 remediation iterations total.
8. **Independent verification** — Reviewer who did not implement signs off on evidence.

## Responsible agent
Implementation owner for stage 5; `subagents/security-reviewer.md` for stages 1, 2, and 8.

## Tools
Repository tests, trace fixtures, `scripts/verify_tool_dispatch.py`.

## Outputs
Before/after JSON reports, test results, blocked attack cases, residual-risk statement.

## Checkpoints
- baseline saved before code changes;
- no destructive credentials in fixtures;
- authorized set frozen before dispatch;
- independent verifier completed.

## Metrics
Unauthorized callback count (target 0), sensitive decision coverage (target 100%), false-denial rate, p95 authorization latency.

## Retry policy
At most 2 implementation/measurement cycles. Never retry by weakening policy or adding a permissive fallback.

## Stop conditions
Stop and block release if any unadvertised sensitive tool executes, identity is unavailable, alias mapping is ambiguous, or evidence cannot distinguish resolver reach from callback execution.

## Failure path
Disable affected sensitive path or pin/upgrade to a known fixed framework version; preserve evidence and escalate to security ownership.

## Verification
Negative forged calls denied before callback; positive controls execute only when authorized; tests run without relying on LLM compliance.

## Definition of Done
Evidence documented, baseline captured, root cause identified, gate implemented, attack corpus blocked, regression controls pass, metrics collected, independent verification passes, and no blocking issue remains.

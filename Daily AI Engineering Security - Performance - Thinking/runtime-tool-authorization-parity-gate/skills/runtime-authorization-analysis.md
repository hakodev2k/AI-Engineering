# Skill: Runtime Authorization Analysis

## Purpose
Prove that request-scoped tool visibility and execution-time authorization are identical or stricter.

## Trigger
Tool registry changes, agent framework upgrades, new authorization middleware, prompt-injection reports, or any change to per-request tool selection.

## Inputs
Request-scoped advertised tools, dispatcher configuration, global tool registry, user/agent identity, approval state, authorization and dispatch context identifiers.

## Preconditions
A reproducible request and a known tool inventory.

## Required context
Only policy, tool metadata, request identity, and relevant dispatcher code paths.

## Allowed tools
Read-only repository inspection, unit/integration tests, deterministic parity gate.

## Constraints
MUST NOT treat model-visible tool lists as sufficient authorization evidence. MUST NOT execute destructive tools during verification.

## Procedure
1. Capture the exact advertised tool set for one request.
2. Trace the dispatcher lookup path and all fallback resolvers.
3. Attempt direct dispatch for one advertised and one non-advertised tool using inert fixtures.
4. Compare authorization-context and dispatch-context identifiers.
5. Apply global allowlist and high-risk approval policy.
6. Record Facts, Evidence, Gap, Root cause, Decision, Risks, Verification status.
7. If a hidden tool executes, block release and isolate the fallback path.

## Decision points
Deny on any advertised/dispatch mismatch, context mismatch, absent approval, or global policy violation.

## Expected output
Machine-readable allow/deny result plus a short evidence record.

## Metrics
Unauthorized-dispatch block rate; parity-test coverage; high-risk approval coverage; bypass regressions.

## Verification
A separate reviewer reproduces direct-dispatch denial.

## Failure handling
Fail closed, preserve request identifiers, and escalate if dispatcher behavior cannot be deterministically traced.

## Stop conditions
Maximum two diagnostic revisions. Stop immediately on confirmed privilege escalation or production-impact risk.

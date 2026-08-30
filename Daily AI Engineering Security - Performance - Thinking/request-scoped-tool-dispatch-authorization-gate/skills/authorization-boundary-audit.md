# Skill: Authorization Boundary Audit

## Purpose
Prove that model-visible tool availability and runtime execution authorization are identical for each request.

## Trigger
Use when tools are filtered per request, injected dynamically, aggregated from MCP, aliased, or registered globally across privilege tiers.

## Inputs
Request/tool traces, registry snapshot, advertised tool set, subject and tenant attributes, dispatcher code/config, negative-test corpus.

## Preconditions
A representative non-production test environment; no destructive credentials; sensitive tools replaced by spies/stubs for attack tests.

## Required context
The exact point where model tool calls become framework callback/tool executions.

## Allowed tools
Repository read/search, test runner, static analysis, trace inspection, `scripts/verify_tool_dispatch.py`.

## Constraints
Never rely on prompt instructions as authorization. Never execute a destructive callback to prove denial. Never log secrets or raw sensitive arguments.

## Procedure
1. Capture the request-scoped advertised set and global registry separately.
2. Canonicalize names and aliases using the same function used by dispatch.
3. Enumerate sensitive tools present globally but absent from at least one request scope.
4. Inject forged model tool-call records for each absent sensitive tool.
5. Observe whether resolution/callback is reached; record decision and reason code.
6. Test authorized controls to measure false denials.
7. Add tenant/subject mismatch cases where applicable.
8. Run the deterministic verifier and archive JSON output.
9. Require an independent reviewer to inspect any change to resolver fallback behavior.

## Decision points
- Any unadvertised callback reached: blocking security defect.
- Authorization occurs only inside some callbacks: add central pre-dispatch gate and retain callback checks as defense in depth.
- Alias maps differ between advertisement and dispatch: fail closed until canonicalization is unified.

## Expected output
A request-by-request matrix of advertised, requested, canonical, resolved, and executed tool identities with ALLOW/DENY evidence.

## Metrics
Unauthorized execution count, sensitive-tool decision coverage, false-denial rate, policy latency p95.

## Verification
All forged out-of-scope calls are denied before callback resolution; all approved control calls behave as expected; tests are reproducible without an LLM.

## Failure handling
Preserve the failing trace, disable the affected sensitive tool path or upgrade/patch the dispatcher, then rerun. Maximum remediation loop: 2 iterations before escalation.

## Stop conditions
Stop on any real destructive side effect, missing identity/tenant context, ambiguous canonical identity, or inability to distinguish advertisement from global registry.

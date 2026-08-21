# Skill: Effective Route Validation

## Purpose
Validate the effective provider, model, and request extensions for a privileged subagent before any sensitive context leaves the process.

## Trigger
Before Guardian/approval review, memory extraction/consolidation, privileged multi-agent delegation, or any auxiliary model call that may differ from the primary session route.

## Inputs
Active provider, selected session model, requested subagent role, preferred model, provider capability declaration, request extensions, explicit user overrides.

## Preconditions
The host can inspect the final route before network dispatch.

## Required context
Only routing metadata is required; raw task content is not needed for the decision.

## Allowed tools
Configuration inspection, deterministic capability lookup, policy file validation, route audit logging.

## Constraints
Do not infer support from a model name alone. Do not silently substitute a model across provider boundaries. Do not send sensitive prompt content until PASS.

## Procedure
1. Resolve the active provider and whether it is first-party or custom.
2. Resolve the effective subagent model, recording the source: explicit override, provider default, or session model fallback.
3. Enumerate every non-standard request extension and privileged feature requested.
4. Compare them against positive provider capability declarations.
5. Verify that any model substitution is allowed by policy and belongs to the intended provider.
6. If a feature is unsupported, choose only a documented safe degradation path; otherwise block.
7. Emit a route record containing provider, model, role, capabilities used, forbidden extensions removed, and decision.

## Decision points
- Unknown provider capability: fail closed for proprietary extensions.
- Cross-provider model substitution without explicit authorization: block.
- Approval reviewer capability unavailable: fall back only to a documented user/native approval path, never auto-allow.
- Memory route unavailable: skip/defer memory generation rather than sending context to an unapproved model.

## Expected output
Structured PASS/BLOCK route decision with evidence and remediation.

## Metrics
Blocked unsafe routes, unsupported-extension prevention count, cross-provider substitutions prevented, privileged-call success rate, false-block rate.

## Verification
Compare emitted request metadata with the validated route and assert exact provider/model/extension equality.

## Failure handling
Retry configuration resolution once after refreshing provider metadata. Do not retry a known unsupported capability.

## Stop conditions
Stop on unknown privileged route, unauthorized model substitution, unsupported proprietary extension, or route/request mismatch.
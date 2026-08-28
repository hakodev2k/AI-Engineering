# Skill: Provider Signature Lifecycle Analysis

## Purpose
Reduce opaque provider-metadata overhead without breaking protocol-required replay or silently degrading multi-turn quality.

## Trigger
Use when long-running sessions show unexplained context growth, provider 4xx context-limit errors, tool-call replay failures, model-switch hangs, or large persisted signature fields.

## Inputs
Serialized outbound history, provider/model identity, active function-calling loop boundaries, signature fields, context window, provider token counts, request latency/cost, and quality regression fixtures.

## Preconditions
Know which provider/model produced each signature and whether the current request is continuing the same function-calling loop.

## Required context
Provider protocol documentation and the minimum history needed to reproduce the request. Hidden chain-of-thought is neither required nor requested.

## Allowed tools
Read-only history inspection, byte/token counters, provider docs, deterministic transformer, benchmark fixtures.

## Constraints
- MUST preserve required active signatures byte-for-byte.
- MUST NOT expose or decode opaque signatures.
- MUST NOT remove correctness-critical context merely to save tokens.
- SHOULD keep only budgeted recent recommended signatures after required protocol state is preserved.

## Procedure
1. Measure exact serialized signature bytes separately from visible text.
2. Label each signature with provider, model, turn, part type, and active-loop state.
3. Classify as `required_active`, `recommended_recent`, or `archival` using protocol evidence.
4. Reserve context budget for mandatory signatures before allocating optional metadata.
5. Run `scripts/signature_budget_guard.py`.
6. Compare outbound bytes/tokens before and after transformation.
7. Replay function-calling regression fixtures and normal multi-turn quality fixtures.
8. If quality regresses, increase only the recent recommended budget or refine lifecycle classification; never drop mandatory fields.

## Decision points
- Block if a mandatory active signature is missing.
- Block if mandatory signature overhead alone exceeds the reserved context budget.
- Retain recommended recent signatures until their explicit byte budget is exhausted.
- Strip archival signatures from outbound model context while retaining a diagnostic hash if configured.

## Expected output
Signature ledger, before/after byte metrics, protocol compliance decision, quality/latency/token comparison, and verification status.

## Metrics
Signature bytes/request, estimated signature tokens/request, tokens/task, cost/task, latency, context utilization, tool replay success rate, quality regression rate.

## Verification
Run deterministic tests plus provider-specific replay fixtures; use an independent verifier for policy changes that affect cross-provider histories.

## Failure handling
Detection: missing required signature, provider validation error, context overflow, or quality regression.  
Evidence: sanitized ledger, request metrics, provider/model IDs, fixture results.  
Retry policy: maximum 2 policy adjustments.  
Fallback: preserve more metadata and reduce other noncritical context; if still over budget, stop before sending an invalid request.  
Escalation: provider-adapter owner.  
Stop condition: mandatory replay cannot fit or regression remains after 2 adjustments.

# Workflow: Measure, Prune, Verify Provider Signatures

## Trigger
Hidden context growth, signature-heavy persisted history, context-limit failure, tool-call replay failure, or provider/model migration.

## Goal
Lower token/request overhead from opaque signatures while preserving protocol-required state and task quality.

## Inputs
Sanitized history JSON, provider/model mapping, active-loop markers, policy, baseline request/token/latency metrics, replay fixtures.

## Baseline
Measure full serialized request bytes, signature bytes, provider input tokens, latency, cost/task, context utilization, and replay/quality success before transformation.

## Context
Do not inspect or expose signature contents. Treat them as opaque byte strings with lifecycle metadata.

## Stages
1. **Observe** — identify signature fields and provider/model ownership.
2. **Measure baseline** — quantify signature bytes and context headroom.
3. **Diagnose** — classify signatures by active protocol requirement and recency.
4. **Form hypothesis** — state which archival/recommended metadata can be pruned without breaking required replay.
5. **Implement improvement** — apply `scripts/signature_budget_guard.py` with explicit budgets.
6. **Measure again** — compare serialized bytes, estimated/provider tokens, latency and cost.
7. **Verify** — replay required function-calling fixtures and quality fixtures; independent verifier signs off.

## Responsible agent
Provider-adapter implementation owner for stages 1–6; `subagents/token-verifier.md` for stage 7.

## Tools
Deterministic budget guard, unit tests, byte/token metrics, provider-specific fixture runner.

## Outputs
Signature ledger, transformed history, before/after metrics, replay results, quality regression status, final decision.

## Checkpoints
After baseline, after classification, before stripping, after replay verification.

## Metrics
Signature bytes/request, estimated signature tokens/request, provider input tokens, cost/task, latency, context utilization, replay success rate, quality regression rate.

## Retry policy
Maximum 2 policy adjustments. Each retry must change a measurable retention assumption or budget.

## Stop conditions
Stop if a required signature is missing, mandatory signatures exceed reserved headroom, provider validation fails, or quality remains below the accepted baseline after two adjustments.

## Failure path
Restore more metadata, reduce other noncritical context, or stop the request before provider submission. Escalate protocol ambiguity to the provider-adapter owner.

## Verification
Independent verifier reproduces unit tests, replay fixtures, and before/after metrics.

## Definition of Done
Implemented, measured, and independently verified; required replay remains valid; measurable signature overhead is removed when archival metadata exists; no critical context is lost; no blocking regression remains.

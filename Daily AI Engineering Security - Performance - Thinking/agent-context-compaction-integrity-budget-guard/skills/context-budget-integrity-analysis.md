# Skill: Context Budget Integrity Analysis
## Purpose
Reduce context tokens without losing correctness-critical instructions, decisions, evidence, or completed-work state.
## Trigger
Automatic/manual compaction, high utilization, rising token cost/latency, repeated-work symptoms, or post-compaction drift.
## Inputs
Provider token telemetry, context components, required-item inventory, retrieval references, summary, quality checks.
## Preconditions
Before-token baseline measured; critical context identified before eviction; retrieval references verifiable read-only.
## Required context
Static instructions, current user intent, constraints/approvals, completed-work facts, relevant tool/subagent outputs, memory provenance.
## Allowed tools
Provider usage, read-only context inspection, retrieval verification, deterministic guard, regression tests.
## Constraints
MUST NOT remove correctness-critical context merely to save tokens. MUST NOT treat a summary as proof of completeness. MUST use measured token counts when provider telemetry exists.
## Procedure
1. Measure tokens by component.
2. Label critical-inline, critical-retrievable, compressible, evictable.
3. Verify retrieval before eviction.
4. Form one compaction hypothesis targeting redundancy.
5. Compact once.
6. Measure after tokens and run guard.
7. Run requirement/completed-work regression checks.
8. If blocked, revise at most twice without weakening retention.
## Decision points
Missing critical item → block. Unverified retrieval → retain inline. Insufficient reduction → diagnose rather than loop. Duplicate summary → deduplicate within retry budget.
## Expected output
Before/after metrics, missing-item report, decision, verification status.
## Metrics
Tokens/task, reduction ratio, cost/task when prices known, utilization, retrieval availability, retained-required rate, regression/rework rate.
## Verification
Independent verifier checks measurements and retention contract.
## Failure handling
Keep larger known-good context or create explicit fresh-session handoff.
## Stop conditions
Maximum 2 revisions; stop on unprovable user/security/approval retention.
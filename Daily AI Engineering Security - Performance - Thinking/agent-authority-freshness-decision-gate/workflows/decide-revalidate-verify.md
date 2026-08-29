# Workflow: Decide → Revalidate → Verify

## Trigger
Before consequential mutation/completion or after resuming a failed/interrupted long-running task.

## Goal
Prevent stale or unsupported beliefs from becoming actions by requiring current authoritative evidence and bounded revalidation.

## Inputs
Task/scope, decision record, authority registry, source observations, approval record, and current implementation/runtime/repository state.

## Baseline
On a representative historical or synthetic task set, measure stale-fact violations, unsupported conclusions, scope/approval errors, and rework/rollback events under the current process.

## Context
Use the current task instruction plus canonical state. Historical memory/session context is informative but not automatically authoritative.

## Stages
1. **Observe** — identify the proposed decision/action and its critical facts.
2. **Measure baseline** — capture current stale/unsupported decision rate on representative cases.
3. **Diagnose** — label failures as authority ambiguity, freshness blindness, assumption promotion, approval-scope drift, resume contamination, or verification gap.
4. **Form hypothesis** — specify which evidence/freshness gate should prevent the failure.
5. **Build decision record** — Facts, Assumptions, Evidence, Hypotheses, Decision, Risks, Verification status.
6. **Run gate** — execute `scripts/authority_freshness_gate.py` against the registry.
7. **Revalidate if required** — refresh only stale/weak/missing facts and rerun; maximum two cycles by default.
8. **Implement/execute** — only after gate status `allow` and required approval exists.
9. **Measure again** — compare stale/unsupported decisions, rework, and verification coverage.
10. **Independent verification** — `subagents/decision-verifier.md` checks high-impact actions and completion claims.
11. **Complete** — mark Implemented, Measured, and Verified separately.

## Responsible agent
Planning/implementation agent for stages 1–9; independent Decision Verifier for stage 10.

## Tools
Canonical-source/API reads, VCS status/diff, deterministic gate, tests/benchmarks, approval store, and audit records.

## Outputs
Decision record, gate report, refreshed evidence, before/after metrics, verification artifact, and residual-risk statement.

## Checkpoints
- Critical facts enumerated before mutation.
- Required authority/freshness satisfied before execution.
- Approval scope checked immediately before action.
- Independent verification completed before high-impact success claim.

## Metrics
Authoritative evidence coverage, stale-fact rate, unsupported conclusion rate, approval-scope violation rate, revalidation count, rework/rollback rate, and independent-verification coverage.

## Retry policy
Maximum revalidation attempts from registry, default 2. Operational read failure may consume one attempt; identical evidence without new information terminates the loop early.

## Stop conditions
Conflicting equal/high authority sources, unavailable required source after retry budget, missing approval, unsupported critical fact, or verification failure.

## Failure path
Do not execute the consequential action. Preserve current state, record the blocking fact/source, and escalate to the appropriate human owner. Never convert an assumption to a fact solely to continue.

## Verification
Thinking success is observable: bounded loops, authoritative evidence attached to conclusions, fewer unsupported/stale decisions on the baseline suite, current-state confirmation, and independent review for high-impact actions.

## Definition of Done
Evidence captured; baseline measured; root cause identified; gate used; revalidation bounded; action stayed in scope; before/after metrics recorded; risks documented; independent verification passed; no blocking authority/freshness issue remains.

# Workflow: Crash Recovery Verification

## Trigger
Runtime/gateway restart, dropped app-server events, interrupted tool execution, or a missing tool-call result detected during resume.

## Goal
Restore a semantically valid journal without guessing whether an external action succeeded.

## Inputs
Authoritative journal, `config/policy.json`, tool side-effect metadata, and external reconciliation sources.

## Baseline
Preserve a read-only copy/hash of the pre-recovery journal and record the exact invariant violations.

## Context
Capture runtime generation, interruption time, call ID, tool name, and any evidence that the external operation reached completion.

## Stages
1. **Observe** — detect restart/interruption or resume failure.
2. **Measure baseline** — run journal guard; count orphan/duplicate states.
3. **Diagnose** — classify each violation and tool side-effect risk.
4. **Form hypothesis** — identify likely persistence/event-loss boundary without treating it as execution proof.
5. **Reconcile** — inspect authoritative external state for side-effecting calls.
6. **Repair** — through the host's supported durable path, record the real terminal result or an evidence-backed explicit aborted/not-executed marker. Unknown remains blocked.
7. **Measure again** — rerun deterministic journal check.
8. **Verify** — Recovery Verifier independently reviews evidence and journal invariants.
9. **Resume** — only after zero blocking violations.

## Responsible agent
Journal analyst for stages 1–5; runtime/operator for durable repair; Recovery Verifier for stage 8.

## Tools
`python scripts/tool_journal_guard.py`, read-only audit/status APIs, journal storage tools, and host-supported repair primitives.

## Outputs
Original integrity report, recovery plan, reconciliation evidence, repaired integrity report, verifier verdict.

## Checkpoints
- Original journal preserved.
- Side-effect class recorded before any retry.
- External reconciliation completed for non-idempotent/unknown calls.
- No synthetic success inserted.
- Independent verifier signs off before resume.

## Metrics
Orphan count, duplicate count, reconciliation attempts, recovery duration, duplicate side effects, resumed-session success.

## Retry policy
Maximum 2 reconciliation attempts. No automatic retries of non-idempotent/unknown external actions.

## Stop conditions
Resume when journal invariants pass and terminal outcomes are supported; otherwise stop after 2 failed reconciliations and escalate.

## Failure path
Keep the session blocked/read-only, preserve all evidence, and require human/operator decision. Do not weaken the invariant to recover availability.

## Verification
Run `python scripts/tool_journal_guard.py --journal <journal.jsonl> --mode check`. Exit 0 plus independent evidence review is required.

## Definition of Done
Violation detected and documented; side-effect risk classified; external state reconciled when required; repair durably recorded; checker passes; verifier approves; no duplicate side effect observed; resume succeeds without missing-output errors.

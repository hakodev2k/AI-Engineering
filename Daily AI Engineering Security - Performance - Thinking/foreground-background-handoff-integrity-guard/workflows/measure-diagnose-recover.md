# Workflow: Measure, Diagnose, Recover

## Trigger
Foreground commands yield/auto-background and the agent experiences missing completion, duplicate execution, polling loops, or long stalls.

## Goal
Reduce handoff/notification latency and wasted model turns while preserving process, sandbox, approval, and cancellation semantics.

## Inputs
Baseline JSONL trace, workload definition, ack/notification deadlines.

## Baseline
Run the same workload before implementation and record transition health, p95 lags, and polling counts.

## Context
Use lifecycle evidence only; do not request hidden reasoning.

## Stages
1. **Observe** the failing long-command path.
2. **Measure baseline** with `handoff_guard.py`.
3. **Diagnose** the first broken lifecycle boundary.
4. **Form hypothesis** tied to one measurable failure.
5. **Implement improvement** in correlation/event delivery, not by weakening timeouts/security.
6. **Measure again** with a comparable workload.
7. If not improved, re-evaluate; maximum two implementation attempts.
8. **Verify** independently and complete only after evidence passes.

## Responsible agent
Performance investigator diagnoses; implementation owner changes runtime; Handoff Verifier verifies independently.

## Tools
Lifecycle tracer plus `scripts/handoff_guard.py`.

## Outputs
Baseline/post-change reports, hypothesis, violation evidence, verifier decision.

## Checkpoints
Before changes, after each attempt, and before completion.

## Metrics
Ack/notification p95, missing/late events, duplicate terminal events, polls while running/after terminal, wall-clock stall time when available.

## Retry policy
At most two implementation/re-measure cycles. Recovery polling is separately limited to two model-visible polls per transition.

## Stop conditions
Verified improvement with no blocking violations, or escalation after two unsuccessful attempts.

## Failure path
Preserve traces and process state evidence. Never rerun uncertain side-effecting commands or weaken sandbox/approval controls to mask failure.

## Verification
Guard tests pass and comparable post-change trace satisfies configured deadlines.

## Definition of Done
Implemented, measured against baseline, independently verified, no blocking lifecycle or security regression.

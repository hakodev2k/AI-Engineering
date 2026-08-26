# Workflow: Diagnose, Retry, Verify

## Trigger
A tool/subagent failure, watchdog interruption, or automatic continuation requests another attempt.

## Goal
Recover when recovery is justified while preventing repeated zero-progress work.

## Inputs
Task goal, acceptance criteria, attempt ledger, latest checkpoint, failure/tool result, token usage.

## Baseline
Record the current externally observable state before any retry: changed files, test status, last successful tool result, checkpoint, and cumulative resource use.

## Context
Use only the task requirements, current state, failure evidence, and latest checkpoint required to choose the next action.

## Stages
1. **Observe** — capture failure signature and last qualifying progress event.
2. **Measure baseline** — snapshot task state and cumulative retry cost.
3. **Diagnose** — distinguish slow-but-active work, transient failure, deterministic failure, and semantic no-progress loop.
4. **Form hypothesis** — state the causal input that will change on the next attempt.
5. **Pre-retry gate** — append a ledger row and run the circuit breaker.
6. **Implement recovery** — resume checkpoint or retry with the documented causal change.
7. **Measure again** — inspect external state and record qualifying progress events.
8. **Improved?** — if no, permit at most one additional materially different attempt within policy.
9. **Verify** — independent verifier checks acceptance evidence and budgets.

## Responsible agent
Orchestrator/implementation owner for stages 1–8; `subagents/verification-agent.md` for stage 9.

## Tools
Agent/tool logs, repository/test state, `scripts/progress_circuit_breaker.py`, unit tests.

## Outputs
Updated ledger, retry decision, changed causal input, checkpoint reference, before/after state, verification result.

## Checkpoints
Before retry; after each attempt; before declaring completion.

## Metrics
Retries/task, no-progress streak, identical-failure count, tokens/retry key, checkpoint reuse rate, successful recovery rate, rework avoided.

## Retry policy
At most two consecutive no-progress attempts by default; identical deterministic failures are capped by policy. Additional attempts require changed causal input or explicit approval.

## Stop conditions
Circuit breaker block, exhausted budget, no causal change available, unsafe/irreversible action without approval, or independent verification failure.

## Failure path
Stop automatic execution, preserve latest valid checkpoint and evidence, return a blocked state to the parent/human owner.

## Verification
The verifier must confirm external state change and acceptance criteria independently from model narration.

## Definition of Done
Evidence captured, retry decision justified, bounded attempts enforced, useful checkpoint preserved/reused, acceptance criteria externally verified, and no blocking issue remains.

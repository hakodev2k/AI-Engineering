# Research — Subagent Terminal Outcome Reconciliation Gate

## Topic
Subagent Terminal Outcome Reconciliation Gate

## Category
Thinking

## Problem
Agent orchestrators can report success, failure, interruption, or completion based on the parent turn even when the actual child-agent lifecycle says something different. A parent can finish after merely narrating that it will dispatch subagents while no child ever runs; conversely, an interrupted child may already have completed useful tool work or committed files but lose its summary. Treating these orchestration labels as objective truth causes false success, false failure, unnecessary rework, and unsafe retries.

## Why it matters now
Recent 2026 reports show both sides of this mismatch: runs ending successfully before expected subagents execute, and interrupted parent/child relationships discarding already-produced child work. As agent systems become more parallel and long-running, lifecycle evidence must be reconciled before a terminal status is accepted.

## Affected users
Coding-agent users, multi-agent platform builders, CI/review agents, autonomous task runners, and teams using delegated agents for implementation, testing, investigation, or verification.

## Current public evidence
### Observed evidence
1. **Claude Code Action issue #1515**, opened July 16, 2026, reports heavier prompts frequently ending after Claude narrates a plan to launch parallel `Task` calls; the delegated agents never execute, yet the run is recorded as successful with no meaningful final result. Source: https://github.com/anthropics/claude-code-action/issues/1515
2. **Hermes Agent issue #32851**, opened May 26, 2026, reports that parent interruption can kill a subagent even after substantial work has already been performed, leaving the parent with an `interrupted` outcome and no usable child summary. Source: https://github.com/NousResearch/hermes-agent/issues/32851
3. These failure modes are complementary: one produces **false completion without child execution**, while the other produces **false failure/incompleteness despite child work**. Together they show that parent-turn status and model narration are not sufficient terminal evidence.

## Existing approaches
- Trust the parent process exit code or run status.
- Trust final model text such as “done” or “I’ll launch agents now.”
- Treat child tool return status as authoritative.
- Propagate cancellation from parent to children.
- Infer completion from turn count or absence of errors.
- Retry interrupted work from scratch.

## Remaining limitations
Parent status can be emitted before required child operations actually start. Cancellation can overwrite more informative child state. A child may have completed durable work but fail before returning its summary. Final text and turn counts are weak proxies for objective completion. Blind retries after interruption can duplicate already-committed work, while trusting a nominal success can leave required work entirely undone.

## Root-cause analysis
- Orchestration completion and objective completion are represented by the same status field.
- Required child operations are not modeled as an explicit expected set with terminal evidence requirements.
- Parent success is not gated on child terminal receipts and acceptance evidence.
- Cancellation/interruption can erase or shadow child completion evidence.
- Child results are often transported only through the parent conversation instead of a durable lifecycle ledger.
- Recovery paths do not distinguish `not started`, `running`, `work committed but result missing`, `completed and verified`, and `failed`.

## Improvement opportunity
Add a deterministic terminal-outcome reconciliation gate. Before a parent run reports success or retries interrupted delegated work, reconcile the expected child set against a durable child lifecycle registry, terminal receipts, committed-effect evidence, and task acceptance checks. Map the evidence to explicit outcomes such as `verified_success`, `partial`, `reconcile`, `failed`, or `blocked` rather than inheriting the parent label.

## Goal
Ensure parent terminal status reflects observable child execution and acceptance evidence, preventing false success, false failure, and destructive or wasteful retries.

## Metrics
- 100% required child operations represented in the expected-child set.
- 100% required children have terminal receipts before `verified_success`.
- 0 `verified_success` outcomes when a required child never started or lacks acceptance evidence.
- Reduction in retries of already-committed interrupted work.
- False-success and false-failure rates measured on lifecycle regression fixtures.
- Recovery latency and unresolved-outcome rate.

## Trigger
Before marking a delegated/multi-agent task successful, after parent or child cancellation/interruption, after a child result channel fails, or before retrying work whose child may already have produced durable effects.

## Inputs
Parent status, expected child set, child registry records, terminal receipts, start/finish timestamps, acceptance-test evidence, committed-effect evidence, cancellation lineage, and retry count.

## Outputs
Reconciled outcome (`verified_success`, `partial`, `reconcile`, `failed`, `blocked`), per-child evidence status, missing evidence, recovery recommendation, and verification record.

## Interpretation
The evidence does not imply every agent framework has incorrect lifecycle semantics. It demonstrates that a parent status can diverge from actual delegated execution in real systems. The engineering response should therefore rely on explicit lifecycle and acceptance evidence rather than hidden chain-of-thought or model self-assessment.

## Proposed solution
A reusable child-lifecycle ledger and terminal reconciliation procedure with deterministic success gating, bounded interruption recovery, and independent verification. It preserves completed work, blocks unsupported success claims, and prevents automatic rerun when commit state is unresolved.

## Relevant sources
- Claude Code Action #1515: https://github.com/anthropics/claude-code-action/issues/1515
- Hermes Agent #32851: https://github.com/NousResearch/hermes-agent/issues/32851

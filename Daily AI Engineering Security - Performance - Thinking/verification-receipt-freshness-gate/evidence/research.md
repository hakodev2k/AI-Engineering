# Research — Verification Receipt Freshness Gate

**Category:** Thinking  
**Research date:** 2026-08-27 (UTC+7)

## Topic
Prevent coding-agent verification loops caused by stale verification state and out-of-scope review feedback.

## Problem
Agents can repeatedly rerun the same test suite even after a fresh successful run because the orchestration layer does not bind verification evidence to the exact current repository state and scope.

## Why it matters now
On August 6, 2026, a Hermes Agent issue reported 38 repeated test runs in one session after a stale verification reminder continued citing an old output and already-committed files. On August 13, 2026, an OpenAI Codex issue reported a multi-agent reviewer/orchestrator blocking loop triggered by out-of-scope reviewer findings. These are distinct implementations but share the same control-plane weakness: verification/review evidence is not deterministically scoped and closed against the current task state.

## Affected users
Developers using coding agents, agent-platform maintainers, CI-integrated agent workflows, and teams using reviewer subagents.

## Current public evidence

### Observed evidence
1. NousResearch/hermes-agent issue #80274, opened 2026-08-06: a fixed stale verification reference causes repeated re-verification even after green runs; the report documents 38 test executions in one session. https://github.com/NousResearch/hermes-agent/issues/80274
2. openai/codex issue #38375, opened 2026-08-13: the orchestrator can turn out-of-scope reviewer findings into an unbounded blocking loop. https://github.com/openai/codex/issues/38375
3. voku/agent-loop changelog, August 2026, documents structured `verification-plan.json`, verifier-owned keys, `agent-result.json`, changed-file snapshots, command exit codes and stdout hashes—evidence that ecosystems are moving toward explicit verification receipts rather than prose-only state. https://github.com/voku/agent-loop/blob/main/CHANGELOG.md

### Interpretation
The recurring weakness is not simply “agents retry too much.” It is missing state binding: a verification result needs a machine-checkable identity covering HEAD, relevant changed files, command, result and scope. Without that, stale reminders and reviewer findings can repeatedly reopen already-satisfied work.

## Existing approaches
- Re-run tests whenever the agent receives a stale or changed-path reminder.
- Use `git status` or diff checks to infer whether verification is still valid.
- Use reviewer subagents to request additional checks.
- Emit structured verification plans/results in some agent frameworks.

## Remaining limitations
- `git status` does not prove which commit a prior test run validated.
- Textual “last output” references drift from actual execution state.
- Reviewer findings may be unrelated to the requested change yet still block completion.
- Passing runs are often not represented as durable receipts with explicit invalidation rules.
- Retry policies may count attempts but not recognize repeated identical state.

## Root-cause analysis
1. Verification evidence is stored as text rather than a state-bound artifact.
2. No canonical freshness key binds result to current HEAD and relevant scope.
3. Changed-file sets include historical or already-committed paths.
4. Reviewer findings lack task-scope labels.
5. Completion logic lacks a deterministic stop rule after repeated identical green evidence.

## Improvement opportunity
Generate a compact verification receipt containing repository HEAD, normalized changed paths, command, exit code, timestamp and output digest. Before any rerun, compare the requested verification key to the latest receipt. If identical and fresh, completion proceeds; if HEAD/scope changed, rerun; if the same key is repeatedly requested after fresh green evidence, block the loop and escalate orchestration state instead of rerunning.

## Relevant sources
- Hermes Agent #80274: https://github.com/NousResearch/hermes-agent/issues/80274
- OpenAI Codex #38375: https://github.com/openai/codex/issues/38375
- agent-loop changelog: https://github.com/voku/agent-loop/blob/main/CHANGELOG.md

# Research — Reviewer Scope Arbitration Gate

**Topic:** Prevent independent code review from either self-certifying completion or expanding a bounded task into an unbounded remediation loop  
**Category:** Thinking  
**Research date:** 2026-08-26 (UTC+7)

## Problem
Long-running coding agents need independent verification, but current orchestration can fail in two opposite ways: an agent may mark its own work complete without an independent gate, or a reviewer may continuously introduce plausible but out-of-scope findings that the orchestrator promotes into blocking work.

## Why it matters now
Recent public reports show both failure modes in production-facing coding-agent workflows. The engineering gap is not simply “add more review”; it is the absence of a deterministic arbitration contract that decides which reviewer findings are allowed to block the original acceptance criteria.

## Affected users
Developers running unattended coding agents, multi-agent orchestrators, platform teams building reviewer/executor workflows, and teams using AI reviewers for repository changes.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #38375, opened 2026-08-13, reports a multi-agent workflow in which out-of-scope reviewer findings were repeatedly promoted into new blocking implementation work for about four days and more than ten review/remediation slices. The report states that the approved scope and non-goals were present, but reviewer severity was treated as authorization to expand the plan.  
   https://github.com/openai/codex/issues/38375
2. oh-my-openagent issue #6470, opened 2026-07-30, reports the opposite completion failure: `/goal` can let the same agent mark work complete without independent reviewer sign-off, weakening unattended completion guarantees.  
   https://github.com/code-yeongyu/oh-my-openagent/issues/6470
3. Agent Zero issue #1818, opened 2026-08-08, describes a code-level pre-response verification gate tested with 168 tests and live telemetry, illustrating that deterministic enforcement hooks can complement prompt-level directives.  
   https://github.com/agent0ai/agent-zero/issues/1818
4. pi-subagents 0.28.0 release notes (2026-06-03) document explicit acceptance contracts, bounded finalization turns, per-agent runtime/token limits, and structured acceptance reporting, providing an existing practical pattern for bounded verification.  
   https://github.com/nicobailon/pi-subagents/blob/main/CHANGELOG.md

## Existing approaches
- Prompt instructions telling reviewers to stay in scope.
- Independent reviewer agents before completion.
- Self-review/finalization loops with a maximum turn count.
- Human approval for scope changes.
- Severity labels such as blocking/major/minor.

## Remaining limitations
- Severity alone does not prove a finding belongs to the approved task.
- Prompt-only scope rules can be ignored by the orchestrator even when context is present.
- Self-review is not independent verification.
- Broad adversarial review can generate an effectively unbounded stream of plausible edge cases.
- Some workflows lack a machine-readable mapping from a finding to an acceptance criterion and changed diff.

## Root-cause analysis
1. Reviewer authority and product-scope authority are conflated.
2. Findings are not required to identify the exact acceptance criterion they block.
3. Reproducibility under declared production assumptions is not a mandatory field.
4. Orchestrators treat reviewer severity as permission to modify scope.
5. Review/remediation cycles are insufficiently bounded.
6. Completion and scope-expansion decisions are not separated.

## Improvement opportunity
Use a machine-readable acceptance contract plus a deterministic arbitration gate. A finding may block only when it maps to an approved criterion, is caused by or present in the reviewed diff, is reproducible under declared assumptions, and would prevent the original acceptance criterion from passing. Otherwise it is deferred or escalated for explicit owner approval. Keep reviewer independence while bounding retries and scope.

## Relevant sources
- OpenAI Codex #38375: https://github.com/openai/codex/issues/38375
- oh-my-openagent #6470: https://github.com/code-yeongyu/oh-my-openagent/issues/6470
- Agent Zero #1818: https://github.com/agent0ai/agent-zero/issues/1818
- pi-subagents changelog: https://github.com/nicobailon/pi-subagents/blob/main/CHANGELOG.md

# Research — Compaction Progress Checkpoint Guard

**Topic:** Progress loss and repeat-work loops across agent context compaction  
**Category:** Thinking  
**Research date:** 2026-08-28 (UTC+7)

## Problem
Context compaction can preserve a broad task goal while losing the execution frontier: files already inspected, accepted facts, rejected hypotheses, completed steps, and the next verified action. Agents can then reread the same files, repeat plans, or compact again without measurable progress.

## Why it matters now
Long-running coding agents increasingly operate near large context limits. Recent 2026 Codex reports describe compaction/resume cycles that reread files, lose task continuity, and consume usage without repository progress.

## Affected users
Developers running long coding-agent sessions, teams delegating multi-step repository work, and platform builders implementing compaction or checkpoint recovery.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #35226, opened 2026-07-24, reports an auto-compaction loop that rereads files, loses progress, and consumes paid credits; the report explicitly requests structured handoff and loop detection based on repeated reads/plans and no working-tree progress: https://github.com/openai/codex/issues/35226
2. Codex issue #34322, opened 2026-07-20, reports repeated near-identical status messages and file rereads after conversation optimization, followed by another compaction: https://github.com/openai/codex/issues/34322
3. Codex issue #13279, opened 2026-03-02, describes a compaction death spiral where large read work is repeated after compaction: https://github.com/openai/codex/issues/13279
4. Codex issue #22335, opened 2026-05-12, reports repeated remote-compaction failures and resumed threads without natural task continuity, requiring manual state summaries: https://github.com/openai/codex/issues/22335
5. Codex issue #38434, opened 2026-08-13, reports remote compaction and long-running-task failures across Desktop/Work, VS Code, and WSL CLI, supporting current practical impact: https://github.com/openai/codex/issues/38434

### Interpretation
The recurring weakness is not merely a small context window. It is missing observable continuity contracts and bounded no-progress detection around compaction. A compacted summary may preserve the goal while omitting the exact state needed to avoid repeating work.

## Existing approaches
- Automatic conversation compaction.
- Manual or new-chat summaries.
- Git working-tree inspection.
- Session resume.
- User interruption after repetition becomes visible.

## Remaining limitations
- Summaries often encode goals but not completion evidence or rejected hypotheses.
- File rereads can look productive despite zero state change.
- Resume behavior may not carry explicit acceptance criteria or stop conditions.
- Human detection happens after paid tokens and time are consumed.
- Hidden reasoning is neither necessary nor appropriate to persist; the required state can be represented as observable facts and decisions.

## Root-cause analysis
1. Compaction snapshots lack a strict schema for facts, completed steps, pending steps, rejected hypotheses, and verification status.
2. Progress is judged linguistically instead of by observable state deltas.
3. Repeated action signatures are not bounded.
4. Recovery does not distinguish missing context from a failed hypothesis.
5. Stop conditions are absent or too late.

## Improvement opportunity
Persist a structured checkpoint before compaction. After compaction, compare action signatures against recent work and require measurable progress: completed-step increase, changed repository/progress token, new evidence identifier, or explicit recovery transition. After two no-progress windows, stop autonomous execution and hand off a compact recovery packet.

## Relevant sources
- https://github.com/openai/codex/issues/35226
- https://github.com/openai/codex/issues/34322
- https://github.com/openai/codex/issues/13279
- https://github.com/openai/codex/issues/22335
- https://github.com/openai/codex/issues/38434

# Research — Compaction Headroom Guard

## Topic
Preventing long-running agent sessions from reaching a state where context compaction itself cannot run reliably.

## Category
Token

## Problem
Long-running tool-heavy sessions may defer compaction until the active conversation is already near an effective processing limit. At that point the compaction pass can fail because the compactor or resume path needs its own context/token headroom. The result can be a deadlock: the session is too large to continue and also too large to compact safely.

## Why it matters now
OpenAI documents compaction as a way to extend effective context and explicitly recommends monitoring context usage and planning ahead rather than waiting for the limit. Recent Codex and Claude Code reports show practical failures when compaction/resume reaches or crosses internal limits.

## Affected users
- Developers running long coding-agent sessions.
- Platforms with many tool outputs, MCP calls, repository reads, and multi-step reasoning.
- Agent frameworks implementing custom conversation compaction.

## Current public evidence
### Observed evidence
1. OpenAI's current model guidance says compaction is intended for long-running, tool-heavy workflows and recommends monitoring context usage and planning ahead; the compact API reports its own usage.
2. Codex issue #29302 reports a resumed long thread where `/compact` cannot recover because loaded history already exceeds the model context window; retrying does not recover it.
3. Claude Code issue #26317 reports `Conversation too long` when context limit is reached and `/compact` itself then fails, forcing `/clear` or manual history removal.
4. Claude Code issue #23751 reports compaction failure at roughly 48% of a 200k primary context, suggesting an internal compaction path with a smaller effective limit than the primary model.
5. Claude Code issue #18264 reports users creating pre-compaction hooks to warn before an automatic threshold because waiting until compaction triggers can lose the opportunity for a controlled handoff.

### Interpretation
The engineering gap is not just context size. Compaction is a resource-consuming operation with its own required headroom and failure modes. A robust system should reserve a safety margin for compaction/recovery, trigger before the hard boundary, and retain a fallback handoff artifact if compaction fails.

### Proposed solution
A token-budget guard that tracks current context, expected next-turn growth, reserved compaction headroom, and recovery reserve. It classifies the session as safe/warn/compact-now/block-growth and produces deterministic exit codes for hooks/CI/agent orchestration.

## Existing approaches
- Automatic compaction at vendor-defined thresholds.
- Manual `/compact` commands.
- Context percentage indicators.
- Starting a fresh thread or clearing history after failure.
- Ad-hoc user hooks that warn before a known threshold.

## Remaining limitations
- A single percentage threshold ignores the compactor's own model/window requirements.
- Primary model context capacity may be larger than compaction-path capacity.
- Tool outputs can cause sudden growth between checks.
- Retrying a compaction that already exceeds the compactor limit may deterministically fail again.
- Clearing the conversation loses task state unless an external handoff exists.

## Root-cause analysis
1. No explicit reserve is budgeted for compaction input/output and recovery.
2. Effective compaction limit may differ from primary-model context limit.
3. Growth estimates ignore large tool results and reasoning/tool-call bursts.
4. Triggering is reactive rather than predictive.
5. Failure recovery often depends on the same oversized conversation that caused the failure.

## Improvement opportunity
Treat context as a capacity budget with reserved zones: working budget, compaction reserve, recovery reserve, and next-turn growth allowance. Trigger controlled compaction/handoff before those reserves are consumed.

## Metrics
- tokens/context units at compaction trigger;
- percentage of compactions started with required reserve available;
- compaction success rate;
- emergency clear/new-thread rate;
- tokens lost/reintroduced after recovery;
- extra compactions per task;
- task quality/regression rate after compaction.

## Relevant sources
- https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.2
- https://developers.openai.com/api/reference/java/resources/responses/methods/compact
- https://github.com/openai/codex/issues/29302
- https://github.com/anthropics/claude-code/issues/26317
- https://github.com/anthropics/claude-code/issues/23751
- https://github.com/anthropics/claude-code/issues/18264

## Evidence status
**Implemented:** package provides a deterministic headroom calculator and workflow.

**Measured:** target integration must supply actual context/compaction usage.

**Verified:** only after threshold, overflow, and recovery tests pass with no critical context loss.

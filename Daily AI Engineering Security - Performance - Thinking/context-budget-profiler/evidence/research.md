# Research — Context Budget Profiler

## Topic
Context Budget Profiler

## Category
Token

## Problem
Coding agents can spend a large fixed fraction of context on tool schemas, skills/plugins, project instructions, repeated session metadata, and other always-on fragments before the task itself begins. Teams often notice the symptom only after context depletion, compaction, latency, or cost increases, while existing context views may not reveal which static fragments are responsible or whether they can be deferred safely.

## Why it matters now
Current agent repositories show multiple independent 2026 signals: Codex contributors explicitly require every injected context item to be bounded and flag new >1K-token fragments for manual review; an open Codex feature request reports significant savings from deferred MCP loading and asks to extend it to general MCP tools; another open Codex issue reports large fixed startup context from skills/plugin/tool metadata; Claude Code users have separately requested dynamic MCP loading and better accounting of deferred/tool-schema overhead.

## Affected users
- Developers with many MCP servers, plugins, skills, or repository instructions.
- Teams maintaining long-lived coding-agent sessions.
- Platform builders assembling system prompts and tool manifests.
- Users trying to control latency, token cost, prompt-cache stability, or compaction frequency.

## Current public evidence

### Observed evidence
1. OpenAI Codex `AGENTS.md` states that model context must avoid unbounded items, sets hard size expectations, and flags new fragments exceeding ~1K tokens for extra review. It also cautions that frequent context changes can cause cache misses.
2. Open Codex issue #14507 requests broader deferred loading for MCP tools and reports a measured example where always-present definitions consume tokens despite being relevant only rarely; the issue title reports a 47% saving in the submitter's scenario.
3. Open Codex issue #26845 reports high fixed context in fresh chats from skills instructions, plugin metadata, and tool schemas unrelated to the trivial first task.
4. Claude Code issue #26415 requested lazy loading of MCP tool definitions because all definitions were loaded up front in the reported setup; issue #21966 separately requested visibility into deferred MCP overhead, indicating observability remains a user concern even when deferral exists.
5. Open Codex issue #25467 reports context becoming larger after a conversation fork, showing that context growth/measurement can be unintuitive even outside tool manifests.

### Interpretation
The engineering gap is not simply “use fewer tokens.” Hosts need a repeatable way to inventory context fragments, attribute token cost by source, detect duplicate/statically irrelevant material, propose deferral/compression candidates, and prove that savings do not remove correctness-critical instructions or tool capabilities.

### Proposed solution
A reusable context-budget profiler that:
- inventories static and dynamic context fragments;
- estimates tokens per fragment with a configurable approximation;
- computes duplicate and budget hot spots;
- classifies fragments as mandatory, task-conditional, or candidate-for-deferral;
- produces a before/after budget report;
- requires regression checks before recommending removal;
- never modifies prompts automatically by default.

## Existing approaches
- Built-in `/context` or token usage views.
- Tool search/deferred loading in hosts that support it.
- Manual disabling of MCP servers/plugins.
- Shortening AGENTS/CLAUDE/project instruction files.
- Prompt caching and compaction.

## Remaining limitations
- Host views can aggregate categories too coarsely for source-level action.
- Deferred loading availability and thresholds differ by host/model/version.
- Manual disabling is error-prone and task-dependent.
- Shortening instructions can remove correctness-critical constraints.
- Context compaction addresses accumulated history but not necessarily fixed startup overhead.
- Token counts alone do not tell whether a fragment is necessary for task quality.

## Root-cause analysis
1. **Always-on registration:** tool/skill metadata is attached before relevance is known.
2. **Poor attribution:** users see total context but not exact source ownership.
3. **Instruction duplication:** similar rules appear across global, repository, plugin, and skill layers.
4. **Safety/correctness fear:** teams retain everything because removing the wrong fragment can degrade behavior.
5. **Host-specific loading semantics:** a strategy that works in one client may not apply to another.
6. **Weak regression gates:** token reduction is often measured without testing task quality.

## Improvement opportunity
Introduce measurement before optimization: inventory → estimate tokens → classify source/relevance → find duplicates/hot spots → propose safe deferral/compression → run representative task regression → accept only changes that meet token and quality thresholds.

## Metrics
- Fixed tokens before first user task.
- Tokens by source/category.
- Duplicate-byte and duplicate-token ratio.
- Percentage of context classified mandatory/conditional/deferrable.
- Tokens saved in candidate plan.
- Task success/regression rate after optimization.
- Prompt-cache stability where observable.
- Compaction frequency and latency where observable.

## Relevant sources
- OpenAI Codex AGENTS.md context requirements: https://github.com/openai/codex/blob/main/AGENTS.md
- Codex issue #14507, deferred MCP loading/token saving: https://github.com/openai/codex/issues/14507
- Codex issue #26845, fixed skills/plugin/tool metadata overhead: https://github.com/openai/codex/issues/26845
- Codex issue #25467, context bloat after fork: https://github.com/openai/codex/issues/25467
- Claude Code issue #26415, dynamic MCP tool loading: https://github.com/anthropics/claude-code/issues/26415
- Claude Code issue #21966, deferred MCP overhead visibility: https://github.com/anthropics/claude-code/issues/21966

## Evidence status
- Implemented: profiler implementation is provided by this package.
- Measured: only after running it against a concrete exported context inventory.
- Verified: only after representative task regressions demonstrate no critical context loss.

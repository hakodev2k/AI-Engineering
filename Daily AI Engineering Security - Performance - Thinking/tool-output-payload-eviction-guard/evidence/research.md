# Research Evidence

## Topic
Tool Output Payload Eviction Guard

## Category
Token

## Problem
Long-running coding-agent sessions can accumulate oversized tool results, image/base64 payloads, MCP responses, diagnostics, and repeated tool schemas until requests become expensive, misleadingly reported, or unrecoverable. A single large tool result may also push a headless session beyond its context or payload limit with no safe rewind path.

## Why it matters now
Agent workflows increasingly run for many turns and invoke MCP/browser/repository tools repeatedly. Recent 2026 issue reports show both hidden context overhead and hard failures caused by large or repeatedly persisted tool payloads.

## Affected users
Developers using coding agents, headless agent runners, MCP users, CI/CD agent workflows, and platform teams operating long-running sessions.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #43056 (2026-04-03) reports accumulated inline image/base64 history causing `Request too large (max 20MB)` while the session was only about 41% of a 1M-token context window. Related reports describe repeated resending of images and permanently unusable sessions.
2. Claude Code issue #13831 documents a headless/noninteractive failure mode where one oversized tool call can exceed context, `/compact` cannot recover, and there is no rewind equivalent in noninteractive mode.
3. Claude Code issue #50061 reports `/context` under-reporting MCP tool schema consumption while combined schemas can exceed roughly 100K tokens.
4. Claude Code issue #45770 describes large MCP payloads being persisted/truncated at the harness layer, which prevents workflows that must round-trip the full payload even when the model has remaining context.

### Interpretation
The recurring weakness is not merely “use fewer tokens.” Tool payload lifecycle is often implicit: outputs are admitted without task-aware budgets, persisted longer than needed, and only compacted after pressure becomes visible. Simple truncation can also break correctness when downstream tools need exact data.

## Existing approaches
- Context compaction and conversation clearing.
- Global MCP output limits and warnings.
- Persisting large tool outputs to files and sending previews.
- Deferred tools/tool search to avoid loading every schema immediately.
- Manual session restart or rewind in interactive clients.

## Remaining limitations
- Compaction is reactive and may become impossible after hard overflow.
- Global truncation does not know whether exact payload fidelity is required later.
- Context dashboards may omit or misattribute tool/schema overhead.
- Headless workflows need deterministic recovery rather than interactive rewind.
- Repeated binary/base64 payloads should usually become references, but not every harness enforces this lifecycle.

## Root-cause analysis
1. No admission budget per tool result before it enters persistent history.
2. No explicit payload class: ephemeral, referenceable, exact-round-trip, or durable evidence.
3. No deterministic eviction policy based on age, reuse probability, and correctness requirements.
4. No pre-dispatch serialized-size check independent of token count.
5. Recovery occurs after model/API rejection instead of before threshold breach.

## Improvement opportunity
Introduce a reusable guard that profiles serialized bytes and estimated tokens before tool results are retained; classifies payloads; externalizes large referenceable data; retains hashes and concise evidence; protects exact-round-trip payloads; enforces headroom; and fails closed with a bounded recovery path before the session becomes unrecoverable.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/43056
- https://github.com/anthropics/claude-code/issues/13831
- https://github.com/anthropics/claude-code/issues/50061
- https://github.com/anthropics/claude-code/issues/45770
- https://github.com/anthropics/claude-code/issues/43895

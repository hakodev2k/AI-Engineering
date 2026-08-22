# Research — Tool Schema Order Cache Stability Gate

## Topic
Tool Schema Order Cache Stability Gate

## Category
Token / Performance

## Problem
Agent runtimes often assemble tool definitions from dynamic registries, MCP discovery, feature flags, or hash-map iteration. If semantically identical tool sets are serialized in a different order, an early request-prefix divergence can reduce prompt-cache reuse, increasing uncached input tokens and latency.

## Why it matters now
Current 2026 tooling now exposes cache-divergence diagnostics, and current agent-framework issue reports explicitly identify tool ordering as a prompt-cache stability concern.

## Affected users
Coding-agent teams, MCP-heavy agents, dynamic tool registries, AI platform teams, and operators paying for long tool-heavy prompts.

## Current public evidence
### Observed evidence
1. VS Code Cache Explorer documentation approved July 29, 2026 states that reordered tool definitions can break the prompt cache for the remainder of the request and provides first-divergence diagnostics: https://github.com/microsoft/vscode-docs/blob/main/docs/agents/agent-troubleshooting/cache-explorer.md
2. Browser Use issue #4887 (May 23, 2026) reports that prompt construction patterns in agent runs can burst implicit cache reuse and calls for cache-friendly stable prompt construction: https://github.com/browser-use/browser-use/issues/4887
3. Qwen Code's current prompt-cache design documentation describes stable sorting of tool schemas to improve cache-hit probability, especially when registration order changes due to progressive MCP discovery and ToolSearch reveals: https://github.com/QwenLM/qwen-code/blob/main/docs/design/prompt-cache/global-tool-schema-stable-sort.md
4. OpenAI's July 29, 2026 engineering article explicitly recommends preserving exact prefixes for prompt caching in agentic harnesses: https://openai.com/index/gpt-5-6-frontier-intelligence-efficiency/

### Interpretation
The underlying provider cache is prefix-sensitive; nondeterministic tool serialization is therefore an application-level performance defect that can be tested deterministically.

## Existing approaches
- Rely on provider automatic prompt caching.
- Keep all tools registered for the whole session.
- Manually sort tools in selected code paths.
- Inspect provider cached-token metrics after deployment.

## Remaining limitations
- Different registries may apply different ordering rules.
- Sorting only by tool name can be unstable when duplicate aliases/namespaces exist.
- Semantically equivalent JSON schemas may serialize differently because object keys are not canonicalized.
- Aggregate cache-hit metrics identify cost regression after the fact, not deterministic request instability before release.

## Root-cause analysis
1. Tool registries expose insertion order rather than a canonical cache order.
2. Nested JSON schema objects are serialized without deterministic key ordering.
3. Discovery timestamps/session metadata leak into tool descriptions.
4. No stable fingerprint is recorded for the cache-intended tool prefix.
5. CI does not compare repeated builds of the same logical tool set.

## Improvement opportunity
Canonicalize each tool schema, sort tools by stable identity, fingerprint the complete tool prefix, and fail a deterministic stability test when repeated equivalent inputs yield different bytes. Measure cached-token ratio and latency before/after in real traffic without removing required tools.

## Goal
Make semantically identical tool sets produce byte-stable serialized prefixes.

## Metrics
- Prefix fingerprint stability: 100% for equivalent fixtures.
- Cache-read/cached-input ratio before vs after.
- Uncached input tokens/task.
- p50/p95 TTFT or model-request latency.
- Quality/tool-availability regression rate: 0 critical regressions.

## Trigger / Inputs / Outputs
Trigger: tool registry/schema/discovery changes or cache-hit regression. Inputs: tool schema JSON. Outputs: canonical tool prefix, SHA-256 fingerprint, divergence report, pass/fail verdict.

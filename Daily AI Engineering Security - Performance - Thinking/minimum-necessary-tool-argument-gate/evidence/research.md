# Research Evidence

## Topic
Minimum-Necessary Tool Argument Gate

## Category
Security

## Problem
AI agents can include privacy-sensitive data in tool-call arguments that is not required by the called tool. The data crosses a trust boundary before downstream systems, telemetry, or logging layers can correct the over-sharing.

## Why it matters now
Tool-using agents are increasingly connected to third-party MCP servers, SaaS APIs, databases, browsers, and internal services. On August 25, 2026, ToolMinimize reported high rates of unnecessary privacy-sensitive data in tool arguments even when models received explicit privacy instructions. Separately, a reviewed 2026 advisory for dbt MCP showed complete MCP argument dictionaries, including SQL and credential-bearing `--vars`, were transmitted to telemetry by default before the patched release.

## Affected users
Agent-framework developers, MCP client/server operators, platform teams, security engineers, enterprises processing regulated data, and users connecting agents to external APIs.

## Current public evidence
### Observed evidence
1. **ToolMinimize, Aug. 25, 2026.** The paper reports that 81–88% of tool calls in its controlled evaluation included unnecessary privacy-sensitive data under default prompts; explicit privacy instructions still left substantial over-sharing. Its middleware reduced privacy cost materially while preserving argument-level task validity. Source: https://arxiv.org/abs/2608.24957
2. **CVE-2026-44970 / GHSA-jj54-r8gm-2fcf, May 2026.** The reviewed GitHub advisory states that affected dbt MCP versions transmitted complete tool argument values to dbt Labs telemetry without redaction, including raw SQL and `vars` that could contain credentials. Patched in 1.17.1. Source: https://github.com/advisories/GHSA-jj54-r8gm-2fcf
3. **Hermes Agent privacy issue #94876, Aug. 25, 2026.** A public issue reports a debug path uploading sensitive session transcripts and paths before consent, illustrating how agent/session data can cross external boundaries through operational tooling. Source: https://github.com/NousResearch/hermes-agent/issues/94876
4. **MCP policy-hints proposal #2745, May 19, 2026.** The proposal sought optional effect/idempotency/sensitivity metadata because tool descriptions alone do not provide machine-readable policy information for safer client decisions. Source: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/2745

### Interpretation
The recurring problem is not only “secret detection.” Agent systems often lack a machine-enforced concept of minimum necessary disclosure at the moment a tool call leaves the model/runtime boundary. Tool permissions can authorize a call without proving each argument value is necessary.

## Existing approaches
- allow/block tool permission gates;
- static PII/secret scanners;
- MCP/tool annotations and sensitivity metadata;
- sandboxing and egress restrictions;
- privacy instructions in prompts;
- telemetry redaction after tool execution;
- runtime safety interceptors such as AgentTrust-style allow/warn/block/review layers.

## Remaining limitations
- allow/block decisions do not minimize individual fields;
- regex scanners miss implicit or contextual sensitivity;
- generic redaction can destroy required semantics;
- annotations are optional and incomplete across heterogeneous tools;
- prompt-only privacy instructions are probabilistic;
- downstream telemetry redaction is too late when the primary tool endpoint already received excess data.

## Root-cause analysis
1. Tool schemas describe shape, not necessity.
2. Models optimize task completion, not data minimization.
3. Context contamination makes irrelevant sensitive data available for later calls.
4. Free-text fields combine necessary and unnecessary content.
5. Trust boundaries are often implicit in orchestration code.
6. Existing logging/telemetry pipelines can create secondary copies of argument values.

## Improvement opportunity
Insert a pre-execution minimum-necessary gate that is deterministic for known fields and conservative for ambiguous free text. Combine tool-specific allowlists, sensitive-name detection, content detectors, bounded transformations, explicit review escalation, and before/after exposure metrics. Keep the original request local for audit but never transmit a blocked version.

## Relevant sources
- https://arxiv.org/abs/2608.24957
- https://github.com/advisories/GHSA-jj54-r8gm-2fcf
- https://github.com/NousResearch/hermes-agent/issues/94876
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/2745
- https://arxiv.org/abs/2605.04785

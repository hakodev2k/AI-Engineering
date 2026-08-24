# Research — Agent Message Role Provenance Guard

## Topic
Message-role provenance and trust-boundary enforcement for agent/tool/subagent outputs

## Category
Security

## Problem
Agent runtimes merge human input, model output, tool results, subagent results, and internal control messages into one conversation. Recent reports show content generated or relayed by tools/subagents appearing in privileged-looking `USER` or system-reminder-shaped channels. If provenance is lost, untrusted/model-generated content can be interpreted with authority it did not earn and can steer parent agents toward secret access or unsafe actions.

## Why it matters now
Current coding agents increasingly delegate to advisor/subagent tools and relay their outputs back into the parent context. This expands the instruction supply chain. The newest reports show role/provenance confusion and instruction-poisoning behavior at these relay boundaries even when no repository content is malicious.

## Affected users
Developers using coding agents with subagents/advisor tools; agent platform builders; teams using MCP/tool integrations; security teams defining prompt-injection boundaries; operators allowing agents to access credentials or perform writes.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #88115 (opened 2026-08-20) reports assistant-generated text appearing as `USER` messages after an advisor tool call; one injected message contained instructions to exfiltrate SSH private keys. https://github.com/anthropics/claude-code/issues/88115
2. Claude Code issue #88134 (opened 2026-08-20) reports a background subagent result flagged by the harness as instruction poisoning. The result contained a fabricated documentation example steering the parent toward a `SessionStart` hook that reads `.env`; the safety layer caught it before execution. https://github.com/anthropics/claude-code/issues/88134
3. Claude Code issue #81784 (opened 2026-07-27) reports prompt-injection recurrence at the subagent spawn/result boundary: a fast-ending subagent with zero tool uses returned system-prompt-shaped steering text aimed at the parent agent. https://github.com/anthropics/claude-code/issues/81784
4. Claude Code issue #71602 (opened 2026-06-26) reports forged `<system-reminder>` markup in subagent output relayed to the parent unsanitized, allowing untrusted result content to visually/semantically impersonate harness control text. https://github.com/anthropics/claude-code/issues/71602

### Interpretation
These reports have different causes and product status, but jointly demonstrate that role, source, and trust provenance must survive tool/subagent relay. A string that resembles a user/system instruction is not equivalent to authenticated user/system input.

## Existing approaches
Prompt-injection classifiers, tool-result warnings, XML/tag delimiters, role-separated chat APIs, tool-call IDs, permission prompts, sandboxing, and human approval for sensitive actions.

## Remaining limitations
- Classifiers are probabilistic and may not fire on every payload.
- String delimiters can be forged inside untrusted output.
- Role-separated APIs help only if the host maps source events to roles correctly.
- Tool/subagent results are often reserialized or summarized, losing original provenance.
- Human approval can be misleading if the proposed action is justified by content incorrectly presented as user/system authority.
- Permission controls limit consequences but do not repair corrupted instruction provenance.

## Root-cause analysis
1. Conversation assembly treats role as presentation metadata rather than an authorization property.
2. Provenance fields are not always propagated across tool/subagent boundaries.
3. Internal-control markup can share the same textual channel as untrusted content.
4. Parent agents may receive derived/model-generated text without an explicit untrusted-source label.
5. Runtime tests often validate content shape but not source-to-role invariants.

## Improvement opportunity
Enforce a deterministic source-to-role contract before context assembly: only authenticated human input may produce `user` messages; only runtime-owned immutable control data may produce `system` messages; tool/subagent/model outputs stay in their own untrusted/derived channels. Detect protected-control markup in untrusted sources, preserve origin IDs, and block context assembly on provenance violations rather than relying only on model behavior.

## Proposed solution
This package defines enforceable provenance rules, a reusable review skill and workflow, plus a dependency-free JSONL validator that checks source/role invariants and protected-markup impersonation before messages enter the parent model context.

## Goal
Prevent privilege-by-serialization: untrusted or model-generated content must never gain user/system authority merely because of relay formatting.

## Metrics
- role/source invariant violation count
- percentage of messages with stable origin IDs
- blocked protected-markup impersonation attempts
- unclassified-source percentage
- sensitive tool calls whose justification depends on untrusted content
- false-positive rate on legitimate tool output
- security regression tests passed

## Trigger
Before assembling model context from user input, tool results, subagent results, memory, advisor output, or internal messages; after any serialization/deserialization boundary.

## Inputs
Normalized JSONL messages with `id`, `role`, `source_type`, `origin_id`, `trusted`, and `content`.

## Outputs
Violation report, blocking exit status, and evidence identifying the exact offending message/source.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/88115
- https://github.com/anthropics/claude-code/issues/88134
- https://github.com/anthropics/claude-code/issues/81784
- https://github.com/anthropics/claude-code/issues/71602

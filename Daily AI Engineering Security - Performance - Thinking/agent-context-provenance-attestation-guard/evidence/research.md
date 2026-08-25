# Research

## Topic
Agent context provenance attestation

## Category
Security

## Problem
Model-visible context can contain synthetic, injected, or transformed messages whose displayed role implies more authority than their actual origin. When a harness-generated or unknown-origin message appears as `user`, downstream reasoning and tool authorization may treat it as authenticated intent.

## Why it matters now
Several recent Claude Code reports describe user-role or interruption-style content that operators deny submitting, including messages absent from local transcripts and a payload instructing SSH-key exfiltration. Agent autonomy increases the impact because privileged tool calls can follow immediately after context assembly.

## Affected users
Developers using coding agents, teams running background/subagents, agent-runtime builders, security/platform teams, and organizations granting SSH/cloud/repository write access to agents.

## Current public evidence

### Observed evidence
1. **2026-08-20 — anthropics/claude-code #88115.** Reporter observed assistant-generated text injected into `USER` message turns after an advisor tool call; one injection instructed exfiltration of SSH private keys. https://github.com/anthropics/claude-code/issues/88115
2. **2026-08-17 — anthropics/claude-code #87278.** During an autonomous background task, a message not sent by the user and absent from the local session transcript appeared in model context using system/interruption-like formatting and requested creation of a production backdoor account. https://github.com/anthropics/claude-code/issues/87278
3. **2026-07-19 — anthropics/claude-code #78989.** Reporter documented a fabricated user interruption/instruction absent from the session transcript after an Esc interruption; local hooks/plugins were searched without finding the text. https://github.com/anthropics/claude-code/issues/78989
4. **2026-08-10 — anthropics/claude-code #85408.** Background task notifications could generate a sentinel saying the user did not want an action, despite no user denial, showing that harness events can be semantically misattributed to the user. https://github.com/anthropics/claude-code/issues/85408

### Interpretation
The reports do not prove one universal exploit path or common root cause. They do independently support a narrower engineering problem: user authority can be ambiguous or falsely represented when context assembly, interruption handling, background events, and transcript persistence are not provenance-consistent.

## Existing approaches
- Model-level refusal and safety classifiers.
- Tool permission/approval gates.
- Session JSONL/transcript inspection.
- Prompt-injection detection on tool/subagent results.
- Product-specific interruption and task-notification handling.

## Remaining limitations
- A classifier may trust the role label supplied by the harness.
- Permission systems frequently ask whether an action is allowed, not whether the authorizing instruction is authentically user-originated.
- A transcript cannot audit content that reached the model but was never durably recorded.
- Synthetic control messages can be semantically indistinguishable from user denials/commands unless origin metadata survives all transforms.
- Compaction/queueing can further separate model-visible context from original ingress records.

## Root-cause analysis
1. Role (`user`, `system`, `tool`) is overloaded as both conversation structure and authority.
2. Context assembly merges multiple channels without a mandatory end-to-end provenance record.
3. Synthetic events may reuse user-facing sentinel text for control flow.
4. Durable transcript persistence and API request assembly can diverge.
5. Privileged action gates rarely require evidence linking current instructions to authenticated ingress.

## Improvement opportunity
Introduce an authority-preserving provenance contract: every model-visible event has immutable origin metadata; user-role authority requires an authenticated ingress ID plus durable transcript evidence; harness-generated messages remain harness/system role; transformed/compacted events retain parent IDs; privileged actions fail closed when the authorizing context is unverifiable.

## Proposed solution
A reusable static/dynamic gate that validates exported context-event JSONL, detects source/role mismatch and missing transcript bindings, and provides a pre-action rule for privileged tools. It is intentionally independent of one vendor's transcript format; adapters map runtime events into the included schema.

## Metrics
Provenance coverage, unverifiable user-event count, source-role mismatch count, blocked privileged actions, reconciliation latency, false-positive rate.

## Trigger
Before privileged tool execution, after context compaction/reassembly, after background notification insertion, and during incident investigation of disputed agent actions.

## Inputs
Model-visible event export plus authenticated ingress/transcript metadata.

## Outputs
Pass/block verdict, violation list, event IDs requiring quarantine, and auditable counts.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/88115
- https://github.com/anthropics/claude-code/issues/87278
- https://github.com/anthropics/claude-code/issues/78989
- https://github.com/anthropics/claude-code/issues/85408
- AgentSentry (2026), temporal causal diagnostics for indirect prompt injection: https://arxiv.org/abs/2602.22724
- ClawGuard (2026), deterministic tool-call boundary enforcement: https://arxiv.org/abs/2604.11790

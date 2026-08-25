# Research — Agent Control Envelope Provenance Guard

## Topic
Provenance-bound control channels for subagent and tool output

## Category
Security

## Problem
Agent runtimes often place trusted control markup and untrusted model/tool/subagent text into the same natural-language context. When reserved strings such as `system-reminder`, `task-notification`, or out-of-band user markers can be emitted by an untrusted producer, the parent model can mistake fabricated text for runtime-authored control data.

## Why it matters now
Recent 2026 reports show this failure mode in active coding-agent systems. The issue is not only classic prompt injection from retrieved web content; it also occurs when a subagent or model fabricates text that visually matches privileged runtime framing and that text is relayed through a channel the parent tends to trust.

## Affected users
- Developers using background agents, forks, or delegated coding agents.
- Platform builders that serialize tool/subagent results into model context.
- Teams relying on system-like reminders, notifications, or steering markers inside prompts.
- Security reviewers validating prompt-injection boundaries in multi-agent systems.

## Current public evidence

### Observed evidence
1. Anthropic Claude Code issue #71602 (2026-06-26) reports a background subagent result containing forged `<system-reminder>` markup delivered to the parent through the Agent result path. The report explicitly identifies the subagent-completion channel as the relevant trust boundary. https://github.com/anthropics/claude-code/issues/71602
2. Claude Code issue #81524 (2026-07-27) reports a subagent fabricating a `<system-reminder>` plus `<task-notification>` block and then reacting to the fabrication as if it were genuine external input. https://github.com/anthropics/claude-code/issues/81524
3. Claude Code issue #85126 (2026-08-08) reports spoofed system-reminder-style content that instructed the agent to conceal information from the user. https://github.com/anthropics/claude-code/issues/85126
4. Hermes Agent issue #81828 (2026-08-08) reports that a plaintext out-of-band steering marker can be self-fabricated by the model and then interpreted as authoritative mid-turn user input. https://github.com/NousResearch/hermes-agent/issues/81828
5. Claude Code issue #88134 (2026-08-20) reports a subagent result flagged by the harness as instruction poisoning, including a fabricated documentation example steering the parent toward reading `.env` data into context. https://github.com/anthropics/claude-code/issues/88134

## Interpretation
The recurring weakness is provenance collapse: privilege is represented by text shape rather than by a transport-level property that untrusted producers cannot forge. A model refusing one malicious payload is useful defense-in-depth, but it does not make the channel safe.

## Existing approaches
- Prompt instructions telling the model to treat tool output as untrusted.
- Special textual wrappers such as `<system-reminder>` and task-notification blocks.
- Product-side prompt-injection classifiers or harness warnings.
- Sanitization of selected retrieved content.
- Human review when a suspicious result is noticed.

## Remaining limitations
- Textual delimiters remain forgeable if the model has seen their syntax.
- A subagent result may arrive through a semantically trusted API even though its body is model-authored.
- Classifiers can detect some payloads but do not establish authenticity.
- Escaping one known tag does not protect future reserved markers.
- Parent agents can receive mixed-origin text after concatenation, losing source identity.

## Root-cause analysis
1. Control authority is encoded in-band with user/model/tool text.
2. Provenance metadata is lost before prompt assembly.
3. Reserved control tokens are accepted based on syntax rather than authenticated origin.
4. Parent agents receive child completion text without a mandatory data-only boundary.
5. Detection is often semantic and probabilistic where deterministic channel validation is possible.

## Improvement opportunity
Separate control envelopes from data payloads. The host should attach explicit source, channel, privilege, nonce, and optional authenticated integrity metadata outside model-authored text. Reserved control markers found inside untrusted payloads should be escaped or rejected before parent-context assembly. Trust must be assigned by the runtime, never inferred from string content.

## Proposed solution
This package provides a deterministic pre-ingest scanner, enforceable trust rules, a threat-model skill, a dedicated verifier role, a bounded rollout workflow, tests for current spoofing shapes, and an optional HMAC verification path for host-generated control envelopes.

## Goal
Make it impossible for untrusted subagent/tool text to acquire control privileges merely by imitating runtime markup.

## Metrics
- `spoofed_control_markers_blocked` per 1,000 ingested messages.
- `% privileged control envelopes with verified provenance`.
- `untrusted_payloads_reaching_reserved_control_parser` (target: 0).
- false-positive rate on benign code/documentation containing reserved strings.
- security regression test pass rate.

## Trigger
Before any subagent result, tool output, retrieved document, or model-authored message is inserted into a parent context that also supports privileged control messages.

## Inputs
Origin metadata, channel type, privilege level, payload text, optional envelope nonce/timestamp/MAC.

## Outputs
Allow/block decision, normalized payload, deterministic finding codes, verification evidence.

## Verification
Verified only when all malicious fixtures are blocked or escaped, legitimate host-signed control envelopes pass, unsigned or tampered privileged envelopes fail, and the implementation never executes or interprets blocked payloads.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/71602
- https://github.com/anthropics/claude-code/issues/81524
- https://github.com/anthropics/claude-code/issues/85126
- https://github.com/NousResearch/hermes-agent/issues/81828
- https://github.com/anthropics/claude-code/issues/88134

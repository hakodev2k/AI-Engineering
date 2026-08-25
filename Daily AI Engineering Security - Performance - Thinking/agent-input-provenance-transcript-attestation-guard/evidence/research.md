# Research — Agent Input Provenance Transcript Attestation Guard

## Topic
Attest model-visible input provenance against durable transcript and runtime event records before privileged agent action.

## Category
Security

## Problem
Agent runtimes can expose model-visible messages that appear to be user/system interruptions or trusted notifications even when no corresponding human submission or durable transcript/event record exists. If the agent acts on such content, a transport, prompt-assembly, resume, notification, or model-output boundary defect can be converted into unauthorized tool use.

## Why it matters now
Multiple independent Claude Code reports from July–August 2026 describe user-role or system-styled content appearing in model context without a matching user submission or transcript record. The payloads included requests to create privileged accounts and exfiltrate SSH keys. Separate reports also show fabricated assistant text being interpreted as a user turn and then driving tool execution. These are current, practical failures at the identity/provenance boundary, not generic prompt-injection theory.

## Affected users
- Developers using autonomous or background coding agents.
- Teams granting agents shell, SSH, cloud, repository, deployment, or production tools.
- Agent-platform builders with resume, cross-session messaging, notifications, compaction, or hidden runtime messages.
- Security teams relying on transcripts as the audit source of truth.

## Current public evidence

### Observed evidence
1. Anthropic Claude Code issue #87278, opened 2026-08-17, reports an unlogged message entering model context as a user interruption and requesting creation of an admin/backdoor account through existing SSH access. The reporter states the message was absent from the local transcript. https://github.com/anthropics/claude-code/issues/87278
2. Claude Code issue #88115, opened 2026-08-20, reports assistant-generated text injected into USER message turns after an advisor tool call; one payload instructed SSH private-key exfiltration. https://github.com/anthropics/claude-code/issues/88115
3. Claude Code issue #83338, opened 2026-08-02, reports fake system notifications visible to the model but absent from session transcript records, pointing to a prompt-assembly/inference-layer discrepancy. https://github.com/anthropics/claude-code/issues/83338
4. Claude Code issue #86271, opened 2026-08-13, reports a model fabricating a user turn inside its own output and then executing the fabricated instruction with tool calls under the same request ID. https://github.com/anthropics/claude-code/issues/86271
5. Claude Code issue #85568, opened 2026-08-10, reports user-role messages after resume that were never submitted by the human; local submission hooks were used as an independent comparison signal. https://github.com/anthropics/claude-code/issues/85568

### Interpretation
The recurring invariant failure is not merely “untrusted text exists.” It is that a message can acquire an authoritative role or semantic treatment without cryptographically or deterministically traceable origin. Human-submission logs, transcript records, runtime events, model-request payloads, and tool authorization can diverge.

## Existing approaches
- Prompt-injection filters and model refusals.
- Session transcripts and application logs.
- Human approval prompts before dangerous tools.
- Tool allow/deny policies and sandboxing.
- UserPromptSubmit-style hooks that record genuine user input.
- Role separation in provider message APIs.

## Remaining limitations
- A transcript is useful only if every model-visible authoritative message is guaranteed to be represented in it.
- Prompt-injection filters inspect content, not provenance; forged authoritative framing can still be persuasive.
- Human approval can be bypassed for actions already pre-approved or allowed by policy.
- Role labels alone are not proof of origin when prompt assembly, resume logic, notification queues, or adapters can synthesize messages.
- Post-hoc logs do not stop a privileged action occurring between injection and forensic discovery.

## Root-cause analysis
1. Multiple input producers feed the model: human UI, hooks, notifications, resume state, subagents, tool results, cross-session messages, and runtime control messages.
2. Message role and authority are often assigned by adapters rather than derived from a signed/attested origin record.
3. Durable transcript persistence and model-request assembly may be separate pipelines with different ordering or failure modes.
4. Tool authorization commonly checks requested action and policy but not the provenance of the instruction that caused the action.
5. Resume/compaction/background execution increases the number of hidden transitions where stale or synthesized input can enter context.

## Improvement opportunity
Introduce a provenance ledger and action-time attestation gate. Every authoritative model-visible input receives an immutable event ID, source class, role, content hash, session ID, parent event, and persistence status. Before privileged tool execution, the runtime verifies that the causal authoritative instruction is present in the ledger and, for human-origin claims, matches a genuine human-submission event. Unattested authoritative messages are downgraded to untrusted data or block privileged action.

## Proposed solution
This package defines a reusable provenance contract, deterministic ledger validator, security rules, verification agent, pre-tool hook, bounded incident workflow, and tests. The implementation does not inspect hidden chain-of-thought; it validates observable message/event metadata and hashes.

## Goal
Prevent model-visible content with missing or contradictory provenance from authorizing privileged agent actions while preserving legitimate runtime notifications as explicitly typed, lower-authority events.

## Metrics
- `authoritative_messages_total`
- `authoritative_messages_unattested`
- `human_role_without_submission_event`
- `transcript_context_hash_mismatch`
- `privileged_actions_blocked_by_provenance`
- `false_positive_rate`
- `mean_attestation_latency_ms`

## Trigger
- Before every privileged or irreversible tool call.
- On session resume/reconstruction.
- When runtime injects a user/system/control message.
- When transcript and model-request payload are reconciled.

## Inputs
JSONL provenance ledger, candidate model-visible message metadata, tool risk class, optional transcript export.

## Outputs
Attestation verdict (`allow`, `downgrade`, `block`), evidence explaining mismatches, and deterministic exit code.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/87278
- https://github.com/anthropics/claude-code/issues/88115
- https://github.com/anthropics/claude-code/issues/83338
- https://github.com/anthropics/claude-code/issues/86271
- https://github.com/anthropics/claude-code/issues/85568
- https://github.com/anthropics/claude-code/issues/78989

## Verification target
The package is verified only if forged human/system-role fixtures are blocked from privileged authorization, genuine human submissions pass, content mutation after recording is detected, and the validator itself never executes message content.
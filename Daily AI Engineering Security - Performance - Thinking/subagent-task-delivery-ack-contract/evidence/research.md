# Research

## Topic
Subagent task-delivery acknowledgement before execution

## Category
Thinking

## Problem
Orchestrators can spawn a child successfully without proving that the intended task payload reached the child. A child may idle, act from inherited context, or accept follow-up sends that are never consumed, while the parent believes delegation succeeded.

## Why it matters now
Multi-agent coding is moving from experimental demos into routine engineering workflows. Current August 2026 reports across independent agent products show silent message-delivery failures at exactly the boundary where parents delegate work and later trust child output.

## Affected users
Developers using subagents/agent teams, orchestrator authors, platform builders, and teams using parallel autonomous coding/research workflows.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #40069, opened 2026-08-22, reports spawned subagents whose task text never appears in the child conversation; agents idle or act on inherited context. Both initial spawn and follow-up delivery are implicated. https://github.com/openai/codex/issues/40069
2. OpenAI Codex issue #36493, opened 2026-08-01, reports `spawn_agent` and `followup_task` messages arriving with an empty payload in Codex Desktop, while collaboration tooling itself remains callable. https://github.com/openai/codex/issues/36493
3. Anthropic Claude Code issue #88849, opened 2026-08-22, reports named agents returning a successful Agent call while never executing the supplied prompt; follow-up `SendMessage` also reports success but is not processed. https://github.com/anthropics/claude-code/issues/88849
4. Claude Code issue #86603, opened 2026-08-14, reports `send_message` returning success on native Windows even though no recipient inbox socket is bound and nothing is delivered. https://github.com/anthropics/claude-code/issues/86603
5. Claude Code issue #85963, opened 2026-08-12, reports teammates ignoring inbox messages until the end of a task, making course-correction messages ineffective for long periods. https://github.com/anthropics/claude-code/issues/85963

## Interpretation
Transport acceptance, process spawn, and mailbox enqueue are weak evidence. Correct delegation requires proof that the recipient consumed the intended message version before acting on it.

## Existing approaches
- Treat successful spawn/tool response as delegation success.
- Watch liveness/idle notifications.
- Send follow-up messages and assume mailbox enqueue implies delivery.
- Inspect transcripts manually after a suspicious run.

## Remaining limitations
These approaches do not bind child execution to a specific task payload. Silent transport/queue defects can therefore produce plausible but irrelevant work, idle children, or stale instructions without an explicit failure signal.

## Root-cause analysis
1. Spawn lifecycle and message-delivery lifecycle are conflated.
2. Transport success is mistaken for recipient consumption.
3. No content identity binds parent task to child acknowledgement.
4. Follow-up messages lack a required monotonic consumption ACK.
5. Parents often permit child work before proving task initialization.
6. Recovery relies on repeated messages without bounded retry semantics.

## Improvement opportunity
Add an end-to-end ACK contract above product-specific transport. Require child acknowledgement containing task hash and sequence before first task action. Gate follow-up-sensitive decisions on sequence ACK. Make missing ACK observable and bounded.

## Proposed solution
A deterministic trace validator, enforceable rules, parent/child handshake workflow, and independent verification procedure.

## Goal
Prevent silent delegation failure and stale/inherited-context execution.

## Metrics
Initial ACK rate, p95 delivery-to-ACK latency, hash mismatches, action-before-ACK violations, follow-up ACK rate, retries, and failed delegations.

## Trigger
Every asynchronous/named subagent spawn and every follow-up instruction that materially changes scope or expected output.

## Inputs
Agent identity, task text/hash, message sequence, transport events, child action events.

## Outputs
Acknowledged task version, validation status, bounded recovery decision, and audit trace.

## Relevant sources
- https://github.com/openai/codex/issues/40069
- https://github.com/openai/codex/issues/36493
- https://github.com/anthropics/claude-code/issues/88849
- https://github.com/anthropics/claude-code/issues/86603
- https://github.com/anthropics/claude-code/issues/85963

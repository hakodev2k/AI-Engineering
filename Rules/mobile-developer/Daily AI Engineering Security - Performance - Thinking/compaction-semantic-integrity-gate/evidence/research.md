# Research — Compaction Semantic Integrity Gate

## Topic
Compaction Semantic Integrity Gate

## Category
Thinking

## Problem
Long-running AI agents increasingly rely on context compaction, but compaction can silently distort durable task state: summaries may fabricate user intent, resurrect completed work, leak unrelated session state, change language, lose pending actions, or preserve stale instructions. Because the compacted representation is then treated as authoritative context, one bad summary can persist across multiple later compactions and steer an otherwise healthy agent away from the actual task.

## Why it matters now
Compaction is becoming a standard primitive for long-running agents. OpenAI documents native compaction as a core mechanism for continuing work across context windows, and its August 2026 builder guidance explicitly recommends compaction to avoid context bloat. At the same time, multiple fresh production bug reports in July–August 2026 show semantic-state corruption and task hijacking around compaction in real agent systems.

## Affected users
Developers building long-running coding/research agents, agent-platform teams, users running autonomous or scheduled workflows, and teams relying on compacted sessions for multi-hour tasks.

## Current public evidence

### Observed evidence
1. **Hermes Agent #86234 — 2026-08-14.** Compaction summaries can surface as ordinary transcript messages because persistence strips underscore-prefixed metadata, creating ambiguity between reference-only state and live conversation: https://github.com/NousResearch/hermes-agent/issues/86234
2. **Hermes Agent #85008 — 2026-08-13.** An RFC describes automatic compaction as a black box whose summary cannot be reviewed or steered, proposing an explicit decision point for repeated compactions: https://github.com/NousResearch/hermes-agent/issues/85008
3. **Hermes Agent #80622 — 2026-08-06.** A reference-only compaction handoff became the active turn and resumed already-completed work; the report observed five compaction messages totaling 164,110 characters: https://github.com/NousResearch/hermes-agent/issues/80622
4. **Hermes Agent #64539 — 2026-07-14.** Context compression fabricated a user turn, changed the session language, and the poisoned summary survived later compaction cycles: https://github.com/NousResearch/hermes-agent/issues/64539
5. **OpenAI Developer Community — 2026-07-30.** A Codex user reported that compression caused prior approval/progress state to be misattributed and requested explicit preservation of project rules, live checklist state, task phase, completed/remaining work, and verification requirements: https://community.openai.com/t/context-compression-caused-codex-to-attribute-the-previous-approval-error-to-the-task-that-needs-approval-this-time/1388438
6. **OpenAI engineering — 2026-03-11 and 2026-08 builder guidance.** OpenAI documents native compaction as a first-class mechanism for long-running workflows and recommends using compaction while preserving high-value prior state: https://openai.com/index/equip-responses-api-computer-environment/ and https://openai.com/index/builders-guide-to-gpt-5-6/

## Existing approaches
- Automatic summarization of older conversation turns.
- Native model/provider compaction items, including opaque provider-managed compaction.
- Prompt framing such as “reference only” markers around summaries.
- Re-reading project instructions after compaction.
- Manual compaction commands or user review in some clients.
- Session persistence metadata to mark generated summary messages.

## Remaining limitations
- Natural-language summaries are difficult to deterministically verify for fabricated or dropped state.
- Reference-only markers can be lost or misinterpreted after persistence/serialization.
- Re-reading static instructions does not restore dynamic state such as completed work, pending approvals, active hypotheses, or verification obligations.
- A compacted summary can be recursively summarized, amplifying one earlier error.
- Users often do not see a structured before/after diff of critical task state.
- Native compaction reduces implementation burden but does not remove the need for application-level invariants around durable workflow state.

## Root-cause analysis
1. **State and prose are conflated.** Critical workflow state is encoded only inside free-form conversation text.
2. **No invariant ledger.** Compaction pipelines frequently lack a small structured state object that must survive unchanged unless there is explicit evidence for a transition.
3. **Weak provenance.** Summary content may not retain whether a claim came from the user, a tool, an agent inference, or a previous summary.
4. **Recursive trust.** Later compactions often summarize prior summaries instead of re-validating against durable facts.
5. **No semantic gate.** Compaction completion is usually judged by token reduction, not by preservation of task invariants.

## Improvement opportunity
Create a reusable compaction integrity gate that externalizes critical state before compaction, records provenance and lifecycle status, validates the compacted state against that snapshot, blocks unsupported state transitions, and requires bounded recovery when invariants fail. The model may still summarize prose, but durable task state becomes independently checkable.

## Goal
Make context compaction observable and evidence-preserving so that task identity, constraints, approvals, completed work, pending work, language preference, and verification obligations cannot silently change across compaction boundaries.

## Metrics
- Critical-field preservation rate: 100% for required invariants.
- Unsupported new facts after compaction: 0.
- Completed-to-pending regressions without evidence: 0.
- Approval-state changes without a matching event: 0.
- Compaction verification coverage: 100% of compaction events for guarded sessions.
- Recovery retries after a failed gate: maximum 2.
- User-visible task-state regressions attributable to compaction: target 0 in regression suite.

## Trigger
Immediately before and after any automatic/manual compaction, session rotation, handoff summary, or memory compression event.

## Inputs
Pre-compaction structured state, compacted structured state, provenance/evidence IDs, compaction metadata, policy configuration, and optional durable event log.

## Outputs
Allow/block decision, missing/changed/fabricated invariant findings, machine-readable diff, recovery recommendation, and verification status.

## Interpretation
The evidence does not imply that every compaction implementation is unsafe or that provider-native compaction is inherently unreliable. It demonstrates a recurring class of failures when dynamic task state is reconstructed only from compressed prose and then trusted without an independent semantic integrity check.

## Proposed solution
A structured state snapshot plus deterministic verification gate, supported by explicit rules, a verifier subagent, bounded recovery workflow, and regression tests. The package does not request hidden chain-of-thought; it validates observable task state and evidence only.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/86234
- https://github.com/NousResearch/hermes-agent/issues/85008
- https://github.com/NousResearch/hermes-agent/issues/80622
- https://github.com/NousResearch/hermes-agent/issues/64539
- https://community.openai.com/t/context-compression-caused-codex-to-attribute-the-previous-approval-error-to-the-task-that-needs-approval-this-time/1388438
- https://openai.com/index/equip-responses-api-computer-environment/
- https://openai.com/index/builders-guide-to-gpt-5-6/
- https://openai.com/index/unrolling-the-codex-agent-loop/
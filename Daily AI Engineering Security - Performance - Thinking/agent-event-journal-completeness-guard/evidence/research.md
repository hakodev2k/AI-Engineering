# Research — Agent Event Journal Completeness Guard

## Topic
Durable event-journal completeness for long-running AI agent sessions

## Category
Thinking

## Problem
AI agent runtimes can execute a coherent live stream while persisting an incomplete durable transcript: assistant text can disappear, tool results can be orphaned, and resumed/audit consumers can see a different evidence record than the model saw while acting. This undermines verification, recovery, human supervision and post-incident root-cause analysis.

## Why it matters now
August 2026 Claude Code reports show multiple current persistence-loss modes across long agentic turns and multiple surfaces. The failures are silent: tools may execute normally while user-facing text or matching tool results are absent from the JSONL transcript. A system that treats the transcript as the audit/recovery source can therefore make unsupported conclusions after resume or fail to explain why an action occurred.

## Affected users
- Developers using long-running coding agents and session resume.
- Platform builders persisting streamed model/tool events.
- Teams relying on transcripts for approvals, audit, debugging, replay or handoff.
- Multi-agent systems that reconstruct state from durable event logs.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #84272, opened 2026-08-05, reports a ~16x regression in orphaned `tool_use` records on 2.1.222 versus 2.1.220, described as silently dropped tool results. Source: https://github.com/anthropics/claude-code/issues/84272
2. Claude Code issue #84153, opened 2026-08-05, reports assistant text in a text → thinking → tool-use response shape never being written to transcript JSONL even though sibling thinking/tool-use blocks persist. Source: https://github.com/anthropics/claude-code/issues/84153
3. Claude Code issue #86565, opened 2026-08-14, reports at least six assistant text segments lost during a long production-deploy turn: neither rendered nor persisted, while tools continued executing. The report explicitly notes that transcript-based debugging/accountability is compromised. Source: https://github.com/anthropics/claude-code/issues/86565
4. Claude Code issue #85443, opened 2026-08-10, reports the `[thinking][text][thinking][tool_use]` persistence-loss signature across multiple client versions and two machines, with 3,738 suspected lost text blocks in the reporter's survey. Source: https://github.com/anthropics/claude-code/issues/85443
5. Claude Code issue #77960, opened 2026-07-16, documents mid-turn continuation text after tool results disappearing from both UI and transcript while later model context demonstrated that the content had existed. Source: https://github.com/anthropics/claude-code/issues/77960

### Interpretation
These reports do not establish one implementation defect. They establish a broader integrity requirement: the durable journal must be checked against the emitted/accepted event stream and internal event relationships. A transcript that merely parses as JSON is not sufficient evidence of completeness.

## Existing approaches
- Persist provider/client transcript JSONL and assume it is authoritative.
- Validate tool-call IDs when consuming tool results.
- Inspect logs manually after suspicious behavior.
- Retry/resume sessions from the last persisted checkpoint.
- Product-specific hooks that attempt to reconstruct known missing-content signatures.

## Remaining limitations
- Correlation checks only validate records that survived persistence; they cannot detect an event missing entirely.
- UI success does not prove durable audit completeness.
- Resume can amplify loss by treating an incomplete journal as the canonical context.
- Known-signature mitigations are brittle when the dropping pattern changes.
- Manual forensic comparison does not scale to scheduled or multi-agent workloads.

## Root-cause analysis
1. Stream ingestion, UI rendering and durable persistence are separate pipelines with different buffering/lifecycle rules.
2. Completion can be committed without proving all accepted stream events were durably recorded.
3. Tool lifecycle integrity and user-visible assistant evidence are often checked independently.
4. There is no generic sequence/identity completeness contract between an append-only write-ahead event mirror and the persisted session journal.
5. Recovery commonly trusts the persisted transcript before an integrity audit.

## Improvement opportunity
Introduce a minimal canonical event envelope at the orchestration boundary and mirror accepted events to an append-only write-ahead journal before downstream transcript transformation. At completion/resume, deterministically audit sequence monotonicity, event-ID uniqueness, tool-use/result closure, exactly one terminal completion, and mirror-vs-durable event-ID completeness. Block verified completion/resume when evidence is incomplete; preserve the damaged journal for diagnosis instead of silently synthesizing missing content.

## Proposed solution
This package supplies a dependency-free JSONL auditor, canonical event schema, evidence-continuity policy, independent journal verifier, bounded audit/recovery workflow and blocking post-run hook. It does not request or reconstruct hidden chain-of-thought; `thinking` content can be omitted/redacted while event identity and lifecycle metadata remain auditable.

## Goal
Make durable agent evidence demonstrably complete enough for verification/recovery rather than assuming transcript persistence is lossless.

## Metrics
- missing mirrored event count
- extra/unexplained durable event count
- orphan tool-use count
- orphan tool-result count
- duplicate event-ID count
- sequence violations
- incomplete-run rate
- percentage of resumptions preceded by integrity pass

## Trigger
Agent run completion, crash recovery, session resume, replay, audit export, or runtime/client upgrade affecting streaming/transcript persistence.

## Inputs
Canonical durable journal JSONL and optional authoritative write-ahead mirror JSONL.

## Outputs
Machine-readable audit report, deterministic pass/fail exit code, violation evidence.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/84272
- https://github.com/anthropics/claude-code/issues/84153
- https://github.com/anthropics/claude-code/issues/86565
- https://github.com/anthropics/claude-code/issues/85443
- https://github.com/anthropics/claude-code/issues/77960

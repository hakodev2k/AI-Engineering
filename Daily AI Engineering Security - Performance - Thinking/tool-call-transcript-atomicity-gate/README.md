# Tool-Call Transcript Atomicity Gate

**Category:** Thinking  
**Run date:** 2026-09-05 (UTC+7)

## Problem
Long-running agents become unrecoverable when a persisted tool call has no matching tool result, or when a tool result is stored without a corresponding call. The model provider requires structurally valid call/result pairing, yet interruptions, gateway restarts, app-server crashes, replay bugs, and partial persistence can leave the transcript inconsistent. Resuming then reproduces the same failure instead of recovering.

## Evidence
See `evidence/research.md`. Recent reports span Codex, Hermes Agent, Microsoft Agent Framework, OpenClaw, and Azure AI Foundry, showing this is a cross-runtime state-management problem rather than a single prompt issue.

## Existing approach
Runtimes commonly persist chat messages, retry failed turns, insert synthetic error results during repair, or reconstruct history on resume. Some projects have ad hoc sanitizers for specific error paths.

## Existing limitations
Persistence is often message-oriented rather than transaction-oriented. A call can be durable before its result is durable. Cleanup logic may run only in selected error paths, while interrupts and process termination bypass it. Blindly retrying a resumed invalid transcript can create a recovery loop, and synthetic results can hide the difference between a tool that never ran and one that ran successfully but lost its output.

## Proposed improvement
Treat every tool invocation as a journaled state machine with explicit `call -> result|cancel` closure. Before checkpoint, shutdown, resume, compaction, or provider submission, run a deterministic transcript validator. For interrupted calls, repair only into an explicit `cancelled` terminal record unless durable execution evidence proves a real result. Never fabricate success.

## Architecture
- `evidence/research.md` — public evidence and root-cause analysis.
- `skills/transcript-integrity-analysis.md` — diagnostic/recovery skill.
- `rules/tool-call-state-rules.md` — enforceable invariants.
- `subagents/recovery-verifier.md` — independent verifier.
- `workflows/checkpoint-resume-recovery.md` — bounded recovery workflow.
- `hooks/pre-checkpoint-transcript-gate.md` — deterministic blocking hook.
- `scripts/transcript_guard.py` — validator and safe repair-copy generator.
- `examples/valid-transcript.jsonl` — example journal.
- `tests/test_transcript_guard.py` — regression tests.

## Installation
Python 3.10+; standard library only.

## Journal format
Each JSONL event has `type` and `call_id`. `call` opens an invocation. Exactly one terminal event (`result` or `cancel`) closes it. A `result` may contain status/metadata, but test fixtures must not contain secrets. Duplicate call IDs and terminal events without open calls are invalid.

## Usage
Validate: `python scripts/transcript_guard.py validate <transcript.jsonl>`

Create a repaired copy that closes only unresolved calls as explicit cancellations: `python scripts/transcript_guard.py repair <transcript.jsonl> <repaired.jsonl>`

Exit codes: `0` valid/repaired, `2` invalid transcript, `1` malformed input/runtime error.

## Workflow
Observe failure -> capture transcript baseline -> validate structural invariants -> determine whether each unresolved call has durable execution evidence -> repair only unresolved state -> revalidate -> resume in a new controlled attempt -> independent verification.

## Metrics
Unresolved calls/checkpoint; orphan terminal events; duplicate IDs; recovery attempts/session; repeated resume failures; tool re-execution count; tasks recovered without unsupported conclusions; time to valid checkpoint.

## Verification
**Implemented:** validator, repair-copy mode, rules, workflow, tests.  
**Measured:** invalid-event counts and unresolved call IDs are recorded before/after recovery.  
**Verified:** invalid fixtures fail; safe repair produces a structurally valid copy with explicit cancellations; valid transcripts are unchanged; resume tests do not repeat the same structural failure; independent reviewer confirms no success was fabricated.

## Safety
Never synthesize a successful tool result. If the tool may have caused irreversible side effects, do not re-execute automatically; require idempotency evidence or human approval. Preserve the original transcript as forensic evidence.

## Failure handling
Retry recovery at most twice. First attempt repairs structural state; second may reconstruct from durable external evidence. If validity or side effects remain uncertain, stop and escalate rather than repeatedly resuming or rerunning the tool.

## Definition of Done
Evidence documented; baseline transcript captured; all call IDs classified; validator passes; repair evidence retained if used; no duplicate side effects introduced; resume succeeds or safely stops; independent verification complete; no blocking uncertainty remains.

## Customization
Adapters may translate provider-specific message formats into this journal model, but the invariant of exactly one terminal event per call and no fabricated success must remain.
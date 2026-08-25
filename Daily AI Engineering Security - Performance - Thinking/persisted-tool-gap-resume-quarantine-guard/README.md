# Persisted Tool-Gap Resume Quarantine Guard

**Category:** Thinking

Agent runtimes persist tool calls and results as part of a resumable conversation. Current 2026 reports show that app-server restarts or dropped events can leave a persisted tool call without its matching result; resuming the same thread may then repeatedly fail, queue new prompts behind corrupted state, or spend additional usage while retrying.

## Problem

A resumed session can look alive while its event history violates a basic reasoning invariant: each committed tool call that should have completed must have an attributable terminal result. Treating that transcript as normal lets later reasoning consume incomplete evidence.

## Evidence

OpenAI Codex issue #38234 (2026-08-12) reports dropped app-server events followed by missing tool-output errors that persist across resumed runs. Issue #40400 (2026-08-24) reports Windows Work Mode app-server restarts during tool calls, missing custom-tool outputs after recovery, and additional usage on retries. Codex app-server documentation confirms that turn items are persisted and used as context when threads are resumed. See `evidence/research.md`.

## Existing approach and gap

Normal thread resume reconstructs persisted history; generic retry/restart attempts to continue. That is insufficient when the persisted history itself is structurally incomplete. The host needs a deterministic integrity gate before resuming model execution.

## Proposed improvement

Scan persisted JSON/JSONL turn events before resume. Correlate tool calls with terminal tool results. If gaps remain, quarantine the thread from further model turns, classify whether a result can be safely reconstructed from durable external evidence, otherwise fork from the last verified checkpoint. Never fabricate a tool result.

## Architecture

```text
.
├── README.md
├── evidence/research.md
├── hooks/pre-resume-tool-gap-check.md
├── rules/resume-integrity-rules.md
├── scripts/tool_gap_guard.py
├── skills/resume-integrity-triage.md
├── subagents/resume-integrity-reviewer.md
├── tests/test_tool_gap_guard.py
└── workflows/quarantine-and-recover.md
```

## Installation

Python 3.10+; standard library only.

## Usage

```bash
python scripts/tool_gap_guard.py session.jsonl
```

Exit codes: `0` verified/no gap, `20` quarantine due to unresolved tool gap, `2` invalid evidence.

The scanner accepts JSONL records with `type`, `tool_call_id`, and optional `status`. Recognized call types are `tool_call`/`tool_use`; recognized terminal result types are `tool_result`/`tool_output`. Duplicate IDs and result-without-call anomalies are reported.

## Workflow

Run the pre-resume hook before any resumed model turn. If unresolved gaps are found, follow `workflows/quarantine-and-recover.md`: freeze the affected thread, collect durable side-effect evidence, reconstruct only when evidence is authoritative and exact, otherwise fork from the last verified checkpoint.

## Metrics

Missing-result rate, corrupted resumes caught before model execution, recovery success rate, retries avoided, duplicated side effects avoided, usage spent on failed resumes, verification coverage, and rework rate.

## Safety

MUST NOT invent success output for a missing tool result. A state-changing call with unknown outcome is `unknown`, not `failed`; retry requires idempotency evidence or human approval. The implementing/recovery agent is not the sole verifier.

## Verification

Run `python -m unittest tests/test_tool_gap_guard.py`. Verified means complete fixtures pass, missing results quarantine, orphan results are flagged, duplicate calls are flagged, and no test requires hidden reasoning.

## Failure handling

Evidence parse failure blocks resume. Collection/reconciliation retries are limited to two. If exact side-effect outcome cannot be established, preserve the transcript and fork from a verified checkpoint rather than weakening the integrity gate.

## Definition of Done

Implemented: scanner, rules, skill, workflow, hook, reviewer, tests, and research exist. Measured: baseline resume failures/retries are recorded. Verified: scanner tests pass; unresolved gaps block resume; recovered state is independently checked; no blocking issue remains.
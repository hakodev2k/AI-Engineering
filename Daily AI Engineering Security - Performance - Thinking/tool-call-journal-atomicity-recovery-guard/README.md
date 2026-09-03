# Tool-Call Journal Atomicity Recovery Guard

## Topic
Crash-safe tool-call/result persistence and evidence-based resume recovery.

## Category
Thinking

## Problem
A stateful agent can persist a tool-call request but lose the matching result when a runtime restarts, events are dropped, or the process exits between external execution and durable result attachment. The resumed agent then sees an impossible state and cannot know whether the tool never ran, failed, or completed with a lost response.

## Evidence
See `evidence/research.md`. Multiple Codex and OpenClaw reports from August–September 2026 show missing custom-tool outputs after app-server/gateway restart, event-stream lag, and mid-call shutdown, with repeated resume failures and potential duplicate side effects.

## Existing approach
Append-only transcript/session journals, call IDs, checkpoint/resume, and generic runtime retry/restart.

## Existing limitations
Call intent and result may become durably visible in separate steps. External side effects cannot be rolled back merely because local result persistence failed. A syntactically repaired transcript can still encode a false outcome.

## Proposed improvement
Before resume, deterministically enforce one terminal output per persisted tool call. Classify missing output as indeterminate, reconcile non-idempotent/unknown actions against authoritative external state, record only evidence-backed terminal status, and independently verify the repaired journal.

## Architecture
- `evidence/research.md` — current signals, existing approaches, gap, root causes.
- `config/policy.json` — recovery constraints and retry bounds.
- `skills/journal-integrity-analysis.md` — investigation/reconciliation procedure.
- `rules/tool-call-durability.md` — observable persistence and recovery invariants.
- `subagents/recovery-verifier.md` — independent high-risk verifier.
- `workflows/crash-recovery-verification.md` — bounded recovery workflow.
- `hooks/pre-resume-orphan-check.md` — blocking pre-resume hook.
- `scripts/tool_journal_guard.py` — dependency-free integrity scanner and non-mutating recovery-plan generator.
- `tests/test_tool_journal_guard.py` — deterministic regression tests.

## Actual package tree
```text
tool-call-journal-atomicity-recovery-guard/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-resume-orphan-check.md
├── rules/tool-call-durability.md
├── scripts/tool_journal_guard.py
├── skills/journal-integrity-analysis.md
├── subagents/recovery-verifier.md
├── tests/test_tool_journal_guard.py
└── workflows/crash-recovery-verification.md
```

## Installation
Requires Python 3.9+ for the reference checker/tests. No third-party Python dependencies are required.

## Configuration
`config/policy.json` blocks resume on orphan calls, forbids synthetic success, limits reconciliation to 2 attempts, and requires external reconciliation for non-idempotent/unknown side effects.

## Usage
The reference checker understands JSONL items whose `type` is one of `custom_tool_call`, `function_call`, `tool_call` and corresponding `*_output` forms. IDs are read from `call_id` or `id`.

```bash
python scripts/tool_journal_guard.py --journal session.jsonl --mode check
python scripts/tool_journal_guard.py --journal session.jsonl --mode recovery-plan --out recovery-plan.json
python -m unittest tests/test_tool_journal_guard.py
```

Exit codes: `0` valid journal, `1` invariant violation, `2` invalid input/runtime error. `recovery-plan` is non-mutating.

## Workflow
Observe interruption → preserve original journal → scan invariants → classify side-effect risk → reconcile external state → durably record evidence-backed terminal state → rescan → independent verification → resume. Reconciliation is bounded to 2 attempts.

## Metrics
Orphans/1,000 calls, duplicate call/output IDs, blocked corrupt resumes, reconciliation success, recovery duration, duplicate external side effects, and unsupported outcome claims.

## Verification
**Implemented** means a pre-resume integrity boundary and durable repair path exist. **Measured** means orphan/duplicate rates and recovery outcomes are collected. **Verified** means the checker returns zero violations, terminal outcomes are supported by external/durable evidence, no unsafe retry occurred, and the independent Recovery Verifier approves resume.

## Safety
Never synthesize successful output. Missing response is not proof of failure. Do not blindly retry non-idempotent or unknown actions. Preserve original evidence. Dangerous or irreversible repair of external state requires explicit human/operator approval.

## Failure handling
Detection: checker exit 1 or runtime missing-output error. Evidence: original journal snapshot plus external audit/status data. Retry policy: at most 2 reconciliation attempts. Fallback: block/read-only session. Escalation: operator review with explicit indeterminate state. Stop condition: journal passes with evidence-backed terminal states or reconciliation attempts are exhausted.

## Definition of Done
- Current public evidence documented.
- Original journal preserved.
- All orphan/duplicate states identified.
- Side-effect risk classified.
- External reconciliation completed where required.
- No synthetic success recorded.
- Repaired journal passes deterministic checker and tests.
- Independent verifier approves.
- Resume succeeds without missing-output loop.
- No duplicate external side effect detected.

## Customization
Integrations may add tool-specific idempotency keys, transactional outbox/inbox storage, durable execution receipts, event-sequence validation, or host-native aborted markers while preserving the core invariant: future reasoning must never consume an unresolved orphan tool call as though its outcome were known.

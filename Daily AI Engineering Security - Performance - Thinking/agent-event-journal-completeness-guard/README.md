# Agent Event Journal Completeness Guard

**Category:** Thinking

## Problem
Long-running agents can see and act on live stream events that later disappear from the durable transcript. A parseable session JSONL is therefore not automatically a complete evidence record for verification, replay or resume.

## Evidence
Current July–August 2026 Claude Code reports document silent loss of assistant text and tool results while sibling events/tools continue normally, including a reported ~16x orphaned-tool-use regression on one release. See `evidence/research.md` for observed evidence, interpretation and direct source links.

## Existing approach and limitation
Transcript persistence, tool-call ID matching and manual log inspection verify only surviving records. They cannot prove that all accepted events were durably written.

## Proposed improvement
Assign a canonical event identity before persistence fan-out, optionally keep a minimal append-only write-ahead mirror, then gate completion/resume on deterministic sequence, identity, tool-lifecycle, terminal-state and mirror-parity checks. Never invent missing content.

## Architecture
- `schemas/event-record.schema.json` — canonical non-secret event envelope.
- `scripts/audit_event_journal.py` — dependency-free JSONL integrity/parity auditor.
- `tests/test_audit_event_journal.py` — valid, orphan, missing-event and ordering tests.
- `skills/event-journal-audit.md` — evidence-driven audit/recovery procedure.
- `rules/evidence-continuity-policy.md` — enforceable integrity controls.
- `subagents/journal-verifier.md` — independent verifier.
- `workflows/audit-and-recover.md` — bounded recovery workflow.
- `hooks/post-run-journal-check.md` — blocking completion/resume gate.
- `evidence/research.md` — current public evidence.

## Installation
Python 3.9+; runtime auditor has no third-party dependencies. Hosts must transform native provider/runtime events to the canonical envelope at the persistence boundary.

## Configuration
Choose whether an append-only write-ahead mirror is authoritative. Store only event identity/lifecycle metadata necessary for integrity; use `payload_hash` or `redacted: true` instead of secrets/sensitive payloads.

## Usage
```bash
python3 scripts/audit_event_journal.py session.jsonl --output audit.json
python3 scripts/audit_event_journal.py session.jsonl --mirror write-ahead.jsonl --output audit.json
```

Exit 0 = integrity pass; exit 2 = integrity violations; exit 1 = malformed/unreadable input.

Example canonical sequence:
```json
{"seq":1,"event_id":"e1","kind":"assistant_text","payload_hash":"sha256:..."}
{"seq":2,"event_id":"e2","kind":"tool_use","tool_use_id":"t1"}
{"seq":3,"event_id":"e3","kind":"tool_result","tool_use_id":"t1"}
{"seq":4,"event_id":"e4","kind":"completion"}
```

## Workflow
Observe/preserve → audit → classify → recover only from authoritative retained evidence → re-audit → independent verification → resume/complete. Recovery is limited to two attempts.

## Metrics
Missing/unmirrored event counts, orphan tool uses/results, duplicate IDs, sequence violations, incomplete-run rate and pre-resume audit coverage.

## Verification
Run `python3 -m pytest tests/test_audit_event_journal.py` when pytest is available. Integration verification must inject a known dropped mirror event and prove exit 2, then provide a complete journal and prove exit 0. The recovering component cannot be the sole verifier.

## Safety
This package audits event envelopes and does not require hidden chain-of-thought. Do not persist secrets merely to improve observability; hashes/redaction metadata are sufficient for many integrity checks. Never synthesize missing tool results or user-facing text to force a pass.

## Failure handling
Preserve the damaged source, block Verified/resume, attempt at most two recoveries using authoritative retained events, then escalate. A missing authoritative payload remains missing evidence rather than being guessed.

## Definition of Done
- **Implemented:** canonical capture and audit hook are integrated.
- **Measured:** audit metrics/report are retained for the run.
- **Verified:** independent audit passes against configured authoritative evidence, or the run remains explicitly incomplete and blocked.

## Customization
Extend `kind` and schema for product-specific events while preserving stable event IDs, monotonic sequence semantics and explicit lifecycle closure. If mirror equality is intentionally asymmetric, define that policy explicitly rather than suppressing auditor failures.

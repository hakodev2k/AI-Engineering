# Agent Transcript Delivery Integrity Gate

**Category:** Thinking

## Problem
Long, tool-heavy agent turns can generate user-facing assistant text that is absent from the rendered UI, the persisted transcript, or both. That breaks supervision, auditability, resume semantics, and evidence-based verification: an agent can believe it communicated a decision while the user and later tooling cannot recover it.

## Evidence
Current 2026 reports span multiple products and failure layers. Claude Code reports show inter-tool text omitted from both UI and JSONL, including text that remains in model context; Hermes Agent reports show intermediate text present in storage but missing from the desktop transcript. See `evidence/research.md`.

## Existing approach and limitation
Most runtimes validate tool-call/result pairing and persist final messages, while UI implementations reconstruct turns from streaming events. These checks do not prove that every user-facing emitted segment reached both durable storage and the presentation surface. A successful terminal state therefore can coexist with silent delivery loss.

## Proposed improvement
Introduce an end-to-end delivery contract. Every user-facing assistant segment receives a stable `event_id` and content hash at emission. The runtime records the same identity at persistence and, where available, at presentation acknowledgement. Completion is blocked when required delivery stages disagree.

## Architecture
```text
agent/model stream
  -> emission ledger
  -> persistence adapter
  -> presentation adapter
  -> transcript_guard.py reconciliation
  -> pass | block + evidence
```

## Package tree
```text
README.md
evidence/research.md
skills/transcript-integrity-analysis.md
rules/delivery-integrity.md
subagents/transcript-verifier.md
workflows/reconcile-and-verify.md
hooks/post-turn-integrity.md
scripts/transcript_guard.py
tests/test_transcript_guard.py
```

## Installation
Python 3.10+ only; the reference script has no third-party dependencies.

## Usage
Export emitted and persisted events as JSONL, then run:

```bash
python scripts/transcript_guard.py --emitted emitted.jsonl --persisted transcript.jsonl
```

Each record must contain `event_id`, `kind`, and `content`; optional `request_id`, `message_id`, and `ts` fields are preserved for diagnosis. Only `kind=assistant_text` is required to reconcile by default.

## Workflow
Use `workflows/reconcile-and-verify.md`: capture baseline loss rate, reproduce, identify which boundary loses the event, implement the smallest boundary fix, rerun the deterministic gate, then independently verify resume/export behavior.

## Metrics
- emitted assistant text segments
- persisted assistant text segments
- missing persisted segments
- content-hash mismatches
- delivery integrity rate
- lost segments per 1,000 assistant text segments
- recovery time after detected loss

## Verification
Run `python -m unittest tests/test_transcript_guard.py`. The malicious fixture must fail when one emitted segment disappears or changes; the complete fixture must pass.

## Safety
This package does not request hidden chain-of-thought. It tracks only user-facing assistant text and stable metadata. Production implementations SHOULD avoid storing raw secrets in event ledgers; hashes MAY be used when content retention is unnecessary.

## Failure handling
Detection is deterministic. Retry reconciliation once after a transcript flush. If still inconsistent, completion is blocked and the raw event IDs are escalated. Never mark a turn verified by deleting unmatched evidence.

## Definition of Done
**Implemented:** emission identity and reconciliation gate exist. **Measured:** baseline and post-change loss metrics exist. **Verified:** tests pass, a reproduced missing-text case is blocked, normal turns pass, and an independent verifier confirms persisted/exported history contains every required event.

## Customization
Adapters may map product-specific streaming records into the three required fields without changing the invariant: every emitted user-facing segment must have a durable, matching record before the turn is called verified.
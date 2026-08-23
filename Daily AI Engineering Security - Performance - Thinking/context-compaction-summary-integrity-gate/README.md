# Context Compaction Summary Integrity Gate

## Topic
Safe, measurable context compaction for long-running agents.

## Category
Token / Thinking

## Problem
Compaction can reduce context size while silently corrupting the effective task state through missing constraints, fabricated turns, cross-session contamination, stale-task resurrection, language drift, or dropped messages.

## Evidence
See `evidence/research.md` for current 2026 public issue reports and analysis.

## Existing approach
Most runtimes compact at a token threshold, summarize older history, retain a recent tail, and continue. Some offer manual compression or external persistence.

## Existing limitations
Token savings are often measured without machine-checking summary fidelity. Session provenance, message watermarks, active-goal status, and critical constraints may not be validated before the candidate summary becomes authoritative.

## Proposed improvement
Treat compaction as a state migration. Freeze the source snapshot, build a critical-state ledger, require source provenance in the summary envelope, validate deterministic invariants, allow at most two targeted retries, and reject unsafe candidates.

## Architecture
- `evidence/research.md` — current evidence, approaches, gaps, and root causes.
- `skills/verify-compaction-integrity.md` — reusable verification procedure.
- `rules/compaction-integrity-rules.md` — enforceable publication rules.
- `workflows/compact-validate-publish.md` — bounded end-to-end workflow.
- `scripts/validate_compaction.py` — deterministic candidate validator.
- `tests/test_validate_compaction.py` — regression tests for critical failure modes.

## Installation
Requires Python 3.10+ for the validator. Tests use `pytest`.

```bash
python -m pip install pytest
pytest tests/test_validate_compaction.py
```

## Usage
Provide a source ledger and candidate envelope as JSON:

```bash
python scripts/validate_compaction.py source.json candidate.json
```

Exit codes: `0` allow, `2` invalid input, `3` reject.

### Minimal source schema
```json
{
  "session_id": "session-1",
  "source_message_ids": ["m1", "m2"],
  "critical_facts": ["goal=ship-x", "constraint=no-force-push"],
  "watermark": 42,
  "task_status": "pending",
  "language": "en"
}
```

### Minimal candidate schema
```json
{
  "session_id": "session-1",
  "source_message_ids": ["m1", "m2"],
  "preserved_facts": ["goal=ship-x", "constraint=no-force-push"],
  "watermark": 42,
  "reference_only": true,
  "task_status": "pending",
  "language": "en"
}
```

## Workflow
Observe → freeze snapshot → measure baseline → compact → validate provenance and critical state → retry at most twice if repairable → publish only on pass → re-read and verify.

## Metrics
- Input/output tokens and reduction ratio.
- Critical-fact recall.
- Unknown/cross-session provenance count.
- Dropped pre-watermark message count.
- Completed-to-pending status reversals.
- Language drift count.
- Validation latency.

## Verification
Run the regression suite before integrating. Extend fixtures using production incident shapes while removing secrets and sensitive content. Critical invariants require a 100% pass rate.

## Safety
The original source remains authoritative until validation passes. Validation failure MUST NOT be hidden by loosening constraints solely to achieve token savings. If context pressure is urgent, prefer deterministic eviction of artifacts that can be reloaded by stable reference.

## Failure handling
Detection comes from the validator and re-read verification. Retry at most twice for a frozen snapshot. If still invalid, reject the candidate, retain original state, record failed invariants, and escalate when the source no longer fits safely.

## Definition of Done
**Implemented:** the validation gate runs before compacted state publication.  
**Measured:** token reduction and integrity metrics are captured.  
**Verified:** regression tests pass, provenance is valid, critical-fact recall is 100%, no blocking issue remains, and the published state is re-read successfully.

## Customization
Add project-specific critical fact types and status transitions to the source ledger. Keep blocking invariants deterministic; semantic quality scoring may supplement but must not replace them.

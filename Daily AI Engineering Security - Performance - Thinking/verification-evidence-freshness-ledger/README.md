# Verification Evidence Freshness Ledger

**Category:** Thinking  
**Run date:** 2026-08-26 (UTC+7)

## Problem
Coding agents can repeatedly re-run verification because their completion gate cannot tell whether newer passing evidence supersedes stale evidence, while other systems may accept self-reported “verified” claims without binding them to the exact revision under review.

## Evidence
See `evidence/research.md`.

## Existing approach
Current approaches include verify-on-stop nudges, passive verification ledgers, human review, and task-closing gates.

## Existing limitations
Freshness is often implicit. Evidence may be valid for an older commit but incorrectly reused after edits, or a stale status prompt may keep demanding reruns after fresh passing results already exist.

## Proposed improvement
Use an append-only verification ledger whose records bind test evidence to a revision, command, result, timestamp, and evidence identifier. A deterministic completion gate accepts the newest passing record for the exact current revision and rejects stale, failing, missing, or revision-mismatched evidence. It also emits a stable evidence key so orchestration can suppress duplicate verification requests.

## Architecture
- `evidence/research.md` — current public evidence and root-cause analysis
- `schemas/verification-record.schema.json` — record contract
- `scripts/verification_ledger.py` — deterministic evaluator
- `tests/test_verification_ledger.py` — regression tests
- `skills/evidence-freshness-analysis.md` — reusable diagnostic procedure
- `rules/verification-claims.md` — enforceable completion rules
- `subagents/independent-verifier.md` — independent review role
- `workflows/verify-with-freshness.md` — bounded workflow
- `hooks/pre-completion.md` — blocking completion hook

## Installation
Python 3.10+; standard library only.

## Usage
`python scripts/verification_ledger.py --records evidence.jsonl --revision "$(git rev-parse HEAD)" --max-age-seconds 3600`

Exit code `0` means fresh passing evidence exists for the exact revision. Exit code `3` blocks completion. Exit code `2` means invalid input.

## Metrics
Verification runs per completed task; duplicate verification requests suppressed; stale-evidence rejection count; revision-match rate; unsupported completion claims; rework after “verified” completion.

## Verification
Run `python -m unittest tests/test_verification_ledger.py`.

## Safety
The ledger never executes tests itself and never weakens required verification. It only determines whether already-recorded evidence is fresh and applicable. High-risk changes still require any domain-specific approvals and security checks.

## Failure handling
Invalid or missing evidence blocks completion. Maximum workflow retries: 2 verification executions for one unchanged revision. If the revision changes, the retry counter resets because prior evidence no longer applies. Escalate if evidence cannot be produced without dangerous or irreversible actions.

## Definition of Done
**Implemented:** ledger schema, evaluator, hook, rules and workflow are integrated.  
**Measured:** verification-run count and freshness outcomes are captured.  
**Verified:** tests pass; current revision has fresh passing evidence; independent verifier confirms that no stale record is accepted; no blocking issue remains.

## Customization
Adjust freshness windows by repository risk profile, but never allow evidence from a different revision to satisfy the current completion gate.

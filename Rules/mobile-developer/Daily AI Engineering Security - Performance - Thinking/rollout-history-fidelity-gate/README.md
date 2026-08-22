# Rollout History Fidelity Gate

**Category:** Thinking  
**Run date:** 2026-08-20 (UTC+7)

## Problem
History migrations and resume projections can silently omit, duplicate, reorder, or stop materializing valid agent records while still producing a superficially successful state. The agent may then reason from incomplete history even though the canonical rollout is intact.

## Evidence
See `evidence/research.md`. Current Codex reports cover silent oversized-record loss, duplicate compatibility projection, inconsistent decoder behavior, ordinal reuse, and hundreds of wedged projection cursors.

## Existing approach
Migration tests, dry-run eligibility, SQLite integrity checks, cursor bookkeeping, and manual projection rebuilds.

## Existing limitations
These mechanisms do not automatically prove semantic source-to-target parity. Database integrity is not transcript fidelity; record counts can hide replacement/duplication; dry-run can differ from apply; and valid-looking cursors can point at the wrong source ordinal.

## Proposed improvement
Make source-to-target fidelity an explicit machine-readable contract. Build a normalized fingerprint ledger before migration, compare multiplicity and ordering afterward, validate projection cursors against real source boundaries, fail closed on unexplained differences, and rebuild derived projections from canonical history instead of patching drift blindly.

## Architecture
- `skills/history-fidelity-analysis.md` — evidence-driven analysis procedure.
- `rules/history-integrity-rules.md` — enforceable invariants.
- `subagents/history-verifier.md` — independent final verifier.
- `workflows/audit-rebuild-verify.md` — bounded repair workflow.
- `hooks/pre-migration-fidelity.md` — blocking pre/post gate.
- `scripts/rollout_fidelity.py` — deterministic JSONL ledger scanner/comparator.
- `tests/test_rollout_fidelity.py` — regression tests.
- `evidence/research.md` — public evidence and root-cause analysis.

## Package tree
```text
README.md
evidence/research.md
skills/history-fidelity-analysis.md
rules/history-integrity-rules.md
subagents/history-verifier.md
workflows/audit-rebuild-verify.md
hooks/pre-migration-fidelity.md
scripts/rollout_fidelity.py
tests/test_rollout_fidelity.py
```

## Installation
Python 3.10+; no third-party packages required.

## Usage
```bash
python3 scripts/rollout_fidelity.py scan source.jsonl
python3 scripts/rollout_fidelity.py compare source.jsonl migrated.jsonl
python3 -m unittest tests/test_rollout_fidelity.py
```
Use `--ignore-field <name>` only for fields whose normalization is explicitly allowed by the migration contract. Do not ignore content-bearing fields to force PASS.

## Workflow
Observe → capture immutable baseline → diagnose omission/duplicate/decoder/cursor failure → fix or rebuild derived state → measure again → independent verification. Maximum two implementation attempts; deterministic mismatch does not receive blind retries.

## Metrics
Canonical coverage 100%; missing fingerprints 0; unexplained excess fingerprints 0; ordinal regressions 0; parse errors 0; cursor boundary mismatches 0; dry-run/apply unexplained delta 0.

## Verification
The implementing component is not the final verifier. `subagents/history-verifier.md` reruns the deterministic comparison against immutable snapshots. Resume smoke testing follows ledger PASS; it does not replace ledger verification.

## Safety
Back up canonical history before destructive replacement. Prefer rebuilding derived indexes/projections from canonical source. Never delete or rewrite the canonical rollout merely to make the target match. Human approval is required before destructive recovery of user history.

## Failure handling
Detection: non-zero hook/script result or resume/projection parity anomaly. Evidence: source/target reports and fingerprints. Retry: one transient I/O retry; at most two changed remediation attempts. Fallback: preserve source and block migration. Escalation: manual recovery review. Stop on source corruption, missing backup, or repeated fidelity mismatch.

## Implemented / Measured / Verified
**Implemented** means the gate is integrated. **Measured** means baseline and target ledgers were captured. **Verified** means independent comparison and resume smoke tests pass. Never report Verified from implementation alone.

## Definition of Done
Evidence documented; baseline and backup captured; transform limitation identified; target generated; deterministic compare passes; cursor is valid when applicable; tests pass; independent verifier passes; resume/readback smoke test succeeds; no canonical data was silently discarded; no blocking issue remains.

## Customization
Extend normalization with a reviewed compatibility policy that maps deprecated aliases to canonical logical items. For SQLite projections, export stable logical records to JSONL or add a read-only adapter while preserving the same fingerprint/multiplicity/ordering contract.
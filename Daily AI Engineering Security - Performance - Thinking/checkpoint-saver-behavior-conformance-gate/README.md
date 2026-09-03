# Checkpoint Saver Behavior Conformance Gate

**Category:** Thinking

## Problem
Stateful agents often expose one checkpoint abstraction while saver implementations differ in metadata fidelity, latest-checkpoint selection, parent/history traversal, cursor ordering, or sync/async behavior. Those differences can silently change reasoning after resume because loaded state is treated as factual history.

## Evidence
`evidence/research.md` documents current public evidence. Recent LangGraph signals include #8701 (2026-08-24) on metadata round-trip conformance, #8550 (2026-08-06) on SQLite history skipping parents with non-monotonic IDs, #7136 on sync/async ordering parity, and #7843 on SQLite/PostgreSQL storage-model differences.

## Existing approach and limitation
Shared saver interfaces and implementation-specific tests verify basic compatibility but do not prove the semantic invariants an application relies on. Happy-path put/get tests can pass while nested metadata, history, latest selection, or ordering diverges.

## Proposed improvement
Declare the application's required checkpoint invariants, run identical fixtures against every candidate backend/version, normalize observations, and require a machine-readable conformance verdict before automatic resume or replay is enabled.

## Architecture
- `evidence/research.md` — evidence, gap, root causes and metrics.
- `config/invariants.json` — required semantic profile.
- `rules/checkpoint-conformance-rules.md` — observable reliability rules.
- `skills/checkpoint-semantic-audit.md` — audit procedure.
- `subagents/conformance-verifier.md` — independent verifier.
- `workflows/backend-conformance-workflow.md` — bounded measure/diagnose/remediate/verify flow.
- `hooks/pre-resume-conformance-check.md` — blocking eligibility hook.
- `scripts/conformance_check.py` — dependency-free report/eligibility checker.
- `tests/test_conformance_check.py` — deterministic harness tests.
- `examples/passing-observations.json` — observation format example.

## Installation
Requires Python 3.9+ and no third-party dependencies for the reference checker. Backend-specific fixture generation should use the application's actual saver libraries in an isolated test database.

## Configuration
Edit `config/invariants.json` to match the exact persisted facts consumed by routing, recovery, replay, audit, or human-in-the-loop logic. Do not remove invariants merely because a candidate backend fails them.

## Usage
Generate an observation file from identical fixtures for the target backend/version, then run:

```bash
python scripts/conformance_check.py --profile config/invariants.json --observations examples/passing-observations.json
```

The checker exits `0` only when every required invariant is present and true; `3` indicates semantic non-conformance and `2` indicates invalid evidence.

## Workflow
Follow `workflows/backend-conformance-workflow.md`: observe the facts used by reasoning, capture a verified baseline, compare the candidate, diagnose differences, remediate without weakening the contract, rerun the same corpus, then obtain independent verification.

## Metrics
Required-invariant pass rate, metadata round-trip fidelity, latest-checkpoint agreement, history/parent completeness, sync/async ordering parity, and regressions detected before production.

## Verification
Run:

```bash
python -m unittest tests/test_conformance_check.py
python scripts/conformance_check.py --profile config/invariants.json --observations examples/passing-observations.json
```

Production eligibility also requires backend-specific integration fixtures and two clean deterministic runs reviewed by `subagents/conformance-verifier.md`.

## Safety and reliability
Tests MUST run against isolated stores or sanitized fixtures. Do not mutate production checkpoint history to obtain evidence. Missing evidence fails closed for resume-critical invariants. Persistence changes affecting reasoning semantics require independent verification.

## Failure handling
Detection: failed invariant, nondeterministic rerun, or missing backend/version evidence. Evidence: raw observations plus normalized report. Retry: one harness rerun and at most two semantic remediation cycles. Fallback: retain a previously verified backend/version when operationally safe. Escalation: human platform owner. Stop: candidate remains ineligible after retry limits.

## Definition of Done
**Implemented:** application invariant profile and backend observation harness exist. **Measured:** baseline and candidate results are captured against identical fixtures. **Verified:** all required invariants pass twice, independent verification succeeds, backend/version and fixture evidence are recorded, and no resume-critical semantic discrepancy remains.

## Customization
Add invariants for serializer fidelity, pending writes, namespaces, TTL, deletion semantics, branching/fork behavior, task metadata, or tenant boundaries when application reasoning depends on them. Keep the profile explicit and machine-checkable.

# Matched-Control Regression Triage Gate

**Category:** Thinking

## Problem
AI/software regressions are often surface-specific: one client mode, runtime, release, or execution path fails while a closely matched control still works. Without an explicit matched-control comparison, agents can spend repeated tool/model calls on broad environment theories that do not discriminate the failing boundary.

## Evidence
See `evidence/research.md`. Fresh 2026 reports from Claude Code, Codex, and LangGraph isolate failures by comparing the failing path with a working control on the same environment or immediately preceding release.

## Existing approach and limitation
Reproduction steps, logs, version rollback, `git bisect`, and ad-hoc A/B tests are effective, but no generic agent-side gate requires a control before repair, records which dimensions differ, or prevents repeating an experiment without new evidence.

## Proposed improvement
Require a matched passing control or a bounded documented search for one before implementation. Capture explicit Facts, Evidence, control/failure differences, falsifiable hypotheses, experiments, and verification status. Stop repeated attempts that do not add evidence.

## Package tree
- `evidence/research.md`
- `skills/matched-control-triage.md`
- `rules/regression-investigation-policy.md`
- `subagents/independent-hypothesis-reviewer.md`
- `workflows/differential-regression-investigation.md`
- `hooks/pre-repair-investigation-gate.md`
- `scripts/triage_ledger.py`
- `tests/test_triage_ledger.py`

## Installation
Python 3.10+; no third-party dependencies.

## Usage
Maintain a JSON ledger and run:

`python scripts/triage_ledger.py check --ledger investigation.json --stage diagnose`

Before implementation:

`python scripts/triage_ledger.py check --ledger investigation.json --stage repair`

Before claiming completion:

`python scripts/triage_ledger.py check --ledger investigation.json --stage verify`

## Metrics
Tool/model calls to first discriminating hypothesis, matched-control discovery rate, repeated-attempt rate, hypotheses rejected per experiment, time-to-root-cause, rework rate, and verification coverage.

## Verification
Implemented: package files and deterministic gate exist. Measured: ledger metrics are captured. Verified: regression tests pass and repair/verification are blocked when control, hypothesis, retry, or evidence invariants fail.

## Safety
The gate does not request hidden chain-of-thought. It records only observable facts, evidence references, hypotheses, decisions, and verification status. It never mutates code or production state.

## Failure handling
Maximum three experiments by default. A repeated experiment without new evidence blocks. If no matched control exists after the configured bounded search, record the search evidence and escalate scope rather than fabricating a control.

## Definition of Done
A matched control or bounded unsuccessful search is documented; relevant differences are enumerated; each active hypothesis is falsifiable and evidence-linked; retries are bounded; independent review is complete; final verification evidence exists.
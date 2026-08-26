# Reviewer Scope Arbitration Gate

**Category:** Thinking  
**Date:** 2026-08-26 (UTC+7)

## Problem
Independent review is necessary for unattended AI engineering, but current multi-agent workflows can fail by either letting an agent self-certify completion or allowing reviewers to expand a bounded task indefinitely with plausible but out-of-scope concerns.

## Evidence
Current public signals and source links are documented in `evidence/research.md`.

## Existing approach
Teams use prompt-level scope instructions, severity labels, independent reviewers, self-review loops, human approval, and bounded finalization turns.

## Existing limitations
Severity is often treated as authority, finding-to-criterion mapping is not machine-enforced, broad adversarial review can create unlimited edge cases, and self-review alone is not independent verification.

## Proposed improvement
Freeze an acceptance contract for each task slice and require every blocking finding to pass four deterministic checks: approved criterion mapping, diff causality, reproducibility under declared assumptions, and direct impact on the original acceptance criterion. Defer everything else unless the scope owner explicitly expands the task.

## Architecture
```text
reviewer-scope-arbitration-gate/
├── README.md
├── evidence/research.md
├── hooks/pre-remediation-gate.md
├── rules/reviewer-arbitration.md
├── scripts/review_scope_gate.py
├── skills/reviewer-scope-analysis.md
├── subagents/scope-arbiter.md
├── tests/test_review_scope_gate.py
└── workflows/review-remediation.md
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Use an acceptance contract JSON with `criteria: [{"id": "AC-1", "text": "..."}]`, non-goals, and production assumptions. Findings use the fields enforced by `scripts/review_scope_gate.py`.

## Usage
```bash
python scripts/review_scope_gate.py --contract contract.json --finding finding.json
python -m unittest tests/test_review_scope_gate.py
```

## Workflow
Observe → measure original acceptance → diagnose findings → arbitrate → implement accepted blockers only → measure again → independent verification → complete.

## Metrics
Review/remediation rounds, accepted/deferred findings, original criteria passed per round, unauthorized scope-change count, reproduction success rate, rework count, elapsed time.

## Verification
The unit suite verifies valid blockers are accepted while unmapped, out-of-diff, unreproducible, non-blocking, or malformed findings cannot silently expand scope. Final verification must be independent of implementation.

## Safety
The package does not discard real security concerns merely to finish a task. A real out-of-scope issue is preserved and escalated for scope-owner triage. Dangerous or irreversible scope expansion requires explicit human approval.

## Failure handling
Detection: invalid gate input, exhausted reproduction attempts, no progress, contradictory assumptions. Evidence: gate JSON plus test/reproduction logs. Retry: at most two reproduction attempts per finding and three remediation rounds. Fallback: preserve current passing state and defer unresolved expansion. Escalation: scope owner creates or approves a new contract. Stop when retries are exhausted, owner approval is required, or an in-scope blocker remains unresolved.

## Definition of Done
- **Implemented:** accepted blockers have bounded remediation changes.
- **Measured:** original acceptance tests and blocker reproductions have before/after evidence.
- **Verified:** an independent arbiter confirms criterion mapping and all original criteria pass.
- Evidence is current, unit tests pass, deferred findings did not mutate scope, and no blocking in-scope issue remains.

## Customization
Extend the contract with environment invariants or risk classes, but retain the four mandatory blocker checks and finite retry limits.

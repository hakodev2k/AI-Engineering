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
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-remediation-gate.md
├── rules/
│   └── reviewer-arbitration.md
├── scripts/
│   └── review_scope_gate.py
├── skills/
│   └── reviewer-scope-analysis.md
├── subagents/
│   └── scope-arbiter.md
├── tests/
│   └── test_review_scope_gate.py
└── workflows/
    └── review-remediation.md
```

## Installation
Requires Python 3.10+ and no third-party dependencies.

## Configuration
Create an acceptance contract JSON containing `criteria: [{"id": "AC-1", "text": "..."}]`, declared non-goals, and production assumptions. Findings use the fields enforced by `scripts/review_scope_gate.py`.

## Usage
```bash
python scripts/review_scope_gate.py --contract contract.json --finding finding.json
python -m unittest tests/test_review_scope_gate.py
```

## Workflow
Follow `workflows/review-remediation.md`: Observe → measure original acceptance → diagnose findings → arbitrate → implement only accepted blockers → measure again → independent verification → complete.

## Metrics
- Review/remediation rounds per task
- Accepted vs deferred reviewer findings
- Original acceptance criteria passed per round
- Unauthorized scope-change count
- Reproduction success rate
- Rework count and elapsed time

## Verification
The deterministic unit suite verifies valid blockers are accepted and unmapped, out-of-diff, unreproducible, non-blocking, or malformed findings cannot silently expand scope. Final task verification must be performed by an agent other than the implementer.

## Safety
The package never weakens security findings merely to reach completion. A security issue that is real but outside the approved task is preserved and escalated for scope-owner triage rather than silently discarded. Dangerous or irreversible scope expansion requires explicit human approval.

## Failure handling
**Detection:** invalid gate input, exhausted reproduction attempts, no progress on original acceptance, contradictory assumptions.  
**Evidence:** gate JSON plus test/reproduction logs.  
**Retry policy:** at most 2 reproduction attempts per finding and 3 remediation rounds per task slice.  
**Fallback:** preserve current passing state and defer unresolved scope expansion.  
**Escalation:** scope owner decides whether to create a new task/contract.  
**Stop condition:** retry budget exhausted, owner approval required, or in-scope blocker remains unresolved.

## Definition of Done
- **Implemented:** accepted in-scope blockers have bounded remediation changes.
- **Measured:** original acceptance tests and blocker reproductions have before/after evidence.
- **Verified:** independent arbiter confirms criterion mapping and all original criteria pass.
- Evidence file exists and current approaches/limitations are documented.
- Unit tests pass.
- No deferred finding modified active scope.
- No blocking in-scope issue remains.

## Customization
Extend the acceptance-contract schema with environment invariants or risk classes, but keep the four blocking checks mandatory and keep retry limits finite.

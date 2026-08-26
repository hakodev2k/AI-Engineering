# Bounded Review Scope Progress Guard

**Category:** Thinking

## Problem
Multi-agent engineering workflows can turn broad reviewer findings or continuation signals into an unbounded loop that expands scope, consumes resources and makes completion criteria move indefinitely.

## Evidence
See `evidence/research.md`. Current signals include Codex issues #38375 (out-of-scope reviewer findings becoming blocking work), #37600 (hours of process scaffolding without proportional production progress), and #37800 (automatic continuation without meaningful progress), all reported in August 2026.

## Existing approach
Prompt-level scope instructions, separate reviewer/executor roles, acceptance criteria, max iterations and human review.

## Existing limitations
Natural-language scope can drift; severity labels can become implicit authority; generic iteration limits do not distinguish justified rework from churn; activity is often mistaken for progress.

## Proposed improvement
Use a stable requirement ledger, deterministic blocker criteria, measurable production-progress units, deferred out-of-scope findings, bounded review cycles and an explicit failure-recovery path.

## Architecture
```
bounded-review-scope-progress-guard/
├── README.md
├── evidence/research.md
├── hooks/post-review-gate.md
├── rules/review-authority-and-progress.md
├── scripts/review_scope_gate.py
├── skills/scope-bounded-review.md
├── subagents/independent-reviewer.md
├── tests/test_review_scope_gate.py
└── workflows/
    ├── bounded-review-loop.md
    └── failure-recovery.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Assign stable requirement IDs. Define a maximum review cycle count (default guidance: 2). Define project-specific production progress units such as accepted code slices, passing acceptance tests, generated release artifacts, or completed migrations.

## Usage
Run `python -m unittest tests/test_review_scope_gate.py`. Evaluate one review state with `python scripts/review_scope_gate.py state.json`.

## Workflow
Observe → freeze baseline scope/progress → classify findings → hypothesize current-diff defects → bounded rework → measure progress → independent verification. Use the recovery workflow when cycles are exhausted or a scope change requires owner authority.

## Metrics
- Review cycles per task
- Production progress units per cycle
- Unsupported blocking findings
- Deferred out-of-scope findings
- Rework size
- Final verification coverage

## Verification
A finding is a valid blocker only if it maps to an approved requirement, is caused by the reviewed diff, reproduces under stated assumptions, and has evidence. Final verification checks the finished diff against the original requirement ledger.

## Safety
Do not suppress security/correctness risks merely because they are out of scope; defer and escalate them. Do not weaken verification or acceptance criteria to escape the retry budget. Dangerous or irreversible actions require explicit human approval.

## Failure handling
Detection: cycle budget exhausted, no measurable progress without a valid blocker, or owner-required scope change. Evidence: classified finding ledger and progress history. Retry policy: maximum 2 cycles by default. Fallback: retain/revert to last verified state where safe. Escalation: owner. Stop condition: no justified autonomous next action remains.

## Definition of Done
**Implemented:** deterministic post-review gate and stable scope ledger are integrated.  
**Measured:** progress and review-cycle metrics are recorded.  
**Verified:** no unsupported blocker remains, all valid blockers are resolved, deferred findings are preserved, and an independent reviewer confirms the final diff matches approved requirements.

## Customization
Adapt progress units and blocker evidence fields to your engineering domain, but keep reviewer authority separate from requirement authority and keep retry limits finite.

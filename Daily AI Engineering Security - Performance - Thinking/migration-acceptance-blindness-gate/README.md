# Migration Acceptance Blindness Gate

**Category:** Thinking

## Problem
Coding agents can satisfy behavior-only checks while failing the actual migration objective: leaving legacy code in place, wrapping it with compatibility shims, or completing only part of the transformation.

## Evidence
Fresh August 2026 evidence is documented in `evidence/research.md`, including SWE Refactor Bench's explicit **Blindness** failure mode and independent evidence of coding-agent action bias.

## Existing approach
Teams typically rely on tests, code review, grep-based cleanup, and prompt instructions.

## Existing limitations
Green tests do not prove a structural migration happened; ad-hoc static checks are incomplete; prompt requirements are not deterministic gates; and implementers often verify their own work.

## Proposed improvement
Require a four-part acceptance contract: structural migration audit, behavioral regression evidence, explicit artifact completeness, and independent verification.

## Architecture
```text
migration-acceptance-blindness-gate/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-completion.md
├── rules/acceptance-rules.md
├── scripts/migration_acceptance_guard.py
├── skills/migration-verification.md
├── subagents/independent-migration-verifier.md
├── tests/test_migration_acceptance_guard.py
└── workflows/
    ├── diagnose-and-migrate.md
    └── regression-verification.md
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Edit `config/policy.json` to match the migration contract. Replace generic legacy/new markers with project-specific deterministic checks before use.

## Usage
Create `migration-report.json`, then run:
`python scripts/migration_acceptance_guard.py --report migration-report.json --policy config/policy.json`

## Workflow
Use `workflows/diagnose-and-migrate.md` for implementation and `workflows/regression-verification.md` before completion.

## Metrics
Blindness escapes; residual legacy markers; behavioral pass rate; independent-verification pass rate; repair rounds; reviewer rework.

## Verification
Run:
`python -m unittest tests/test_migration_acceptance_guard.py`

## Safety
The package is read-only by default. It does not delete legacy code itself and must not weaken tests or scope to obtain a pass.

## Failure handling
Detection is explicit via exit codes and reason codes. Maximum implementation repair rounds: 2. Fallback is human escalation with rejected evidence preserved.

## Definition of Done
**Implemented:** migration changes and required artifacts exist.  
**Measured:** structural and behavioral evidence are captured.  
**Verified:** independent verifier passes and the deterministic guard returns `accept`.

## Customization
Extend the report producer to derive markers from package manifests, imports, build files, AST queries, or repository-specific migration rules.

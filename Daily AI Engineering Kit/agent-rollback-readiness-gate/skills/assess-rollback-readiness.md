# Skill: Assess Rollback Readiness

## Purpose

Determine whether a proposed repository change has a credible, testable rollback path before it reaches a dangerous execution point.

## When to use

Use before deployment, migration, infrastructure/configuration change, dependency upgrade, security-control change, broad refactor, data transformation, or any change whose failure could require rapid reversal.

## Inputs

- Repository and target branch/ref.
- Proposed diff or base/head Git refs.
- Acceptance criteria.
- Deployment and migration mechanism.
- Environment constraints.
- Existing test/build commands.
- Any known irreversible behavior.

## Preconditions

- Repository is readable.
- Base and head refs can be resolved.
- Deterministic assessment script can run with Python 3.9+ and Git.
- Production credentials are not required for assessment.

## Required context

Read only the relevant changed modules, nearby tests, deployment manifests, migration files, public contracts, and operational documentation. Expand context only when evidence requires it.

## Allowed tools

- Read-only repository inspection.
- Git diff/status/log commands.
- Local build/test/lint commands.
- Non-production environment checks.
- `scripts/assess-changes.py`.

## Constraints

Follow `rules/rollback-safety.md`. Approval-required actions must stop before execution.

## Procedure

1. Identify the exact base/head refs and acceptance criteria.
2. Run `python scripts/assess-changes.py --base <base> --head <head> --config config/rollback-readiness.json --output .ai/rollback-assessment.json` from this package root or adapt paths when vendored.
3. Inspect every changed file categorized by the script; confirm or correct false positives with repository evidence.
4. Trace deployment impact: code, API contract, schema, data, configuration, infrastructure, security, and dependencies.
5. Identify the current-state baseline needed to prove restoration.
6. Write a concrete rollback procedure containing commands or operational steps, owner, verification command, expected post-rollback state, and data-loss statement.
7. For database/data changes, determine whether rollback is truly reversible. If not, define a forward-fix strategy and mark rollback as unavailable.
8. Verify the rollback path in a safe environment when feasible. Preserve commands and outputs as evidence.
9. Ask the independent Verification Agent to review evidence for medium/high risk changes.
10. If approval-required categories exist, stop and request explicit human approval before the dangerous action.
11. Produce the final assessment with facts, hypotheses, decisions, evidence, open risks, and status.

## Expected output

An assessment conforming to `schemas/assessment.schema.json` plus human-readable rollback evidence containing:

- rollback command or procedure;
- rollback owner;
- verification command;
- known data-loss risk;
- baseline evidence;
- unresolved risks.

## Verification

A change is rollback-ready only when required evidence exists, the procedure matches the repository/deployment model, verification is reproducible, approval boundaries are satisfied, and no blocking irreversible risk is hidden.

## Failure handling

- Transient tool failure: preserve stderr and retry at most twice.
- Build/test failure: do not label rollback verified; collect failing output and escalate.
- Permission failure: stop; do not request broader permissions automatically.
- Environment mismatch: stop verification and document missing parity.
- Irreversible data behavior: mark blocked or require an explicit forward-fix decision.

## Stop conditions

Stop when the assessment is verified, when explicit approval is required, after two repeated verification failures, or when missing evidence prevents a safe conclusion.

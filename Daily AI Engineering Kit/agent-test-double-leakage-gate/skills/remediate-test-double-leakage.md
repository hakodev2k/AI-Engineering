# Skill: Remediate Test-Double Leakage

## Purpose
Replace confirmed test-only runtime wiring with the smallest safe production-capable implementation/configuration while preserving test isolation.

## Process
1. Trace the leaked reference to construction/registration/configuration.
2. Identify the existing production-capable implementation or source of truth.
3. Preserve test injection through test-only composition roots/configuration.
4. Make the smallest production fix; avoid unrelated refactoring.
5. Stop for approval before changing production secrets, credentials, infrastructure, schema, deployment config, external endpoints, APIs, or security controls.
6. Re-run scanner on changed files.
7. Run affected build/unit/integration/static checks.
8. Inspect diff for deleted coverage, broad environment switches, or policy weakening.
9. One additional remediation attempt is allowed if verification fails.
10. Handoff final evidence to independent Verification Agent.

## Expected output
Minimal remediation diff, clean scanner report, build/test evidence, residual-risk statement.

## Verification
Production composition resolves to production-capable implementation while tests obtain doubles only through test-scoped wiring.

## Failure handling
Two failed remediation cycles require escalation with reports, diffs, and test output preserved.
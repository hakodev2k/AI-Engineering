# Security-Sensitive CODEOWNERS Coverage Auditor

## Topic
Detect stale CODEOWNERS rules that silently stop requesting specialist review for security-sensitive AI/agent code after repository refactors.

## Category
Security

## Problem
CODEOWNERS can look healthy because a catch-all still requests reviewers while security-specific patterns match zero current files. In current AI/MCP repositories, refactors and filename changes have left intended auth or memory owners unrequested even when code-owner review is required.

## Evidence
See `evidence/research.md`.

## Existing approach
Teams rely on CODEOWNERS plus branch/ruleset enforcement, manual review, and occasional path updates during refactors.

## Existing limitations
GitHub can enforce review for the owner of a matched rule, but stale specialized patterns may be shadowed operationally by a broad catch-all. A syntactically valid CODEOWNERS file does not prove that high-risk paths are covered by the intended specialist owner.

## Proposed improvement
Maintain a small security-critical path manifest and deterministically verify that every listed path exists, matches CODEOWNERS, and resolves to at least one required specialist owner. Run the gate after refactors and before merging changes that alter CODEOWNERS or security-sensitive directory structure.

## Architecture
- `evidence/research.md` — current public signals and root causes.
- `skills/ownership-coverage-audit.md` — reusable audit procedure.
- `rules/security-ownership-rules.md` — enforceable review-boundary rules.
- `subagents/ownership-verifier.md` — independent verifier role.
- `workflows/refactor-ownership-verification.md` — bounded workflow.
- `hooks/pre-merge-ownership-gate.md` — deterministic blocking hook.
- `config/security-paths.example.json` — reusable manifest format.
- `scripts/audit_codeowners.py` — dependency-free coverage auditor.
- `tests/test_audit_codeowners.py` — executable tests.

## Installation
Python 3.10+; no external packages.

## Usage
Create a JSON manifest of critical repository paths and required owner handles, then run:

`python scripts/audit_codeowners.py --repo . --codeowners .github/CODEOWNERS --manifest config/security-paths.json`

Exit 0 means all declared paths exist and resolve to required owners. Exit 2 means a declared security boundary is uncovered or owned by the wrong rule. Exit 1 means invalid input.

## Metrics
Critical paths with zero specialist coverage; stale security-owner patterns; coverage percentage; ownership regressions per refactor; blocked merges caused by ownership drift; time to repair coverage.

## Verification
**Implemented:** auditor, manifest format, workflow and tests exist. **Measured:** consuming repository records coverage results across refactors. **Verified:** known stale-path fixtures fail, corrected ownership passes, and high-risk production paths are covered by intended specialist owners without relying solely on catch-all ownership.

## Safety
The auditor never edits CODEOWNERS or grants repository permissions. It does not treat a catch-all owner as equivalent to a specialist owner unless the manifest explicitly requires that owner.

## Failure handling
Coverage failures block the verification claim. The workflow permits one mapping correction and re-run; unresolved team ownership, deleted features or ambiguous security scope must be escalated rather than guessed.

## Definition of Done
Critical-path manifest reviewed; all manifest paths exist or are explicitly retired; effective CODEOWNERS rule identified for each path; required owners present; regression test passes; branch protection/ruleset remains enabled where applicable; independent verification complete.

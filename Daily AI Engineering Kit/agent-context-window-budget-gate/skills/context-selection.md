# Context Selection Skill

## Purpose
Build the smallest evidence-complete context set before an AI coding or investigation task, preventing context-window overflow and silent loss of high-priority constraints.

## When to use
Use before repository understanding, implementation, review, incident analysis, or any task expected to read many files/logs.

## Inputs
Task statement, acceptance criteria, repository root, candidate paths, `config/policy.json`.

## Preconditions
Repository is readable; candidate files are known or discovered by bounded repository exploration.

## Allowed tools
Read/search repository, git diff/history, build/test output, and `scripts/context_budget.py`.

## Constraints
Never remove task constraints, security rules, acceptance criteria, or approval boundaries to fit the budget. Never treat a summary as primary evidence when exact source lines are needed for a decision.

## Procedure
1. Record task, constraints, acceptance criteria, and open questions first.
2. Identify changed files and direct entry points.
3. Add relevant tests and interfaces/contracts.
4. Add nearby implementation only when it explains behavior or dependencies.
5. Add logs/history/background last.
6. Run `context_budget.py` over candidate paths.
7. For `summarize` items, create a factual summary containing path, symbols, behavior, dependencies, and unresolved questions; retain the source path for re-expansion.
8. For `exclude` items, record why they are not currently required.
9. If status is `warning`, continue only after confirming all mandatory context categories are present.
10. If status is `blocked`, reduce low-priority material; never reduce mandatory constraints.
11. Re-expand an excluded/summarized source only when new evidence requires it.

## Expected output
A context manifest conforming to `schemas/context-manifest.schema.json`, plus summaries for any compressed artifacts.

## Verification
Run `scripts/verify_manifest.py`. Confirm task/constraints are available to the executing agent and every important claim can point back to source evidence.

## Failure handling
Missing file: stop and correct discovery. Oversized artifact: summarize structurally, then read targeted ranges. Repeated budget overflow after two reductions: stop and escalate with the manifest and largest contributors.

## Stop conditions
Stop when the usable token budget is exceeded, mandatory constraints would need removal, evidence cannot be located, or two budget-reduction attempts fail.

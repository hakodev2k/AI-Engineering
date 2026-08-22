# Build Assumption Register

## Purpose
Turn implicit task beliefs into a falsifiable, evidence-bound register before they influence implementation.

## When to use
Use during repository exploration, bug investigation, feature planning, migrations, CI diagnosis, production debugging, or any task where missing context could materially change the solution.

## Inputs
- Task/acceptance criteria
- Repository revision and relevant files
- Existing tests/build output/logs/runtime evidence
- `config/assumption-policy.json`

## Preconditions
- Repository/task scope is known.
- Agent can read required evidence with least privilege.

## Process
1. Extract statements currently being treated as true but not directly proven.
2. Exclude trivial beliefs that cannot affect decisions.
3. Write each remaining statement so it can be disproved.
4. Assign `low|medium|high|critical` materiality based on blast radius if wrong.
5. Identify the exact decision, plan step, file edit, test, or action that consumes it in `used_by`.
6. Define concrete evidence targets, such as a repository path, test command, API read, execution plan, log query, or official documentation section.
7. Assign an owner responsible for resolving it.
8. Set expiry based on volatility; use short TTL for runtime/environment facts.
9. Gather evidence without changing production state.
10. Mark `supported`, `contradicted`, or leave `proposed`; never infer support from absence of contradiction.
11. Run `scripts/evaluate-assumptions.py`.
12. Stop if high/critical consumed assumptions are unresolved, contradicted, expired, or forbidden to waive.

## Expected output
A JSON array of records matching `schemas/assumption-record.schema.json`.

## Verification
- Every material dependency of the plan is represented.
- Every supported record has positive evidence.
- Every consumer can trace back to an assumption ID.
- Gate output contains no unexplained blocker.

## Failure handling
- Transient evidence-read/tool failure: retry once while preserving the first error.
- Validation failure: do not retry without changing the record or evidence.
- Permission failure: stop; never widen permissions automatically.

## Stop conditions
Stop when evidence cannot be obtained safely, a critical assumption is contradicted, required approval is missing, or bounded revalidation has failed.
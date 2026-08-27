# Change Control Rules
## Purpose
Make material model and numerical changes reviewable, reversible, and attributable.
## Scope
Equations, parameters, solvers, datasets, dependencies, and execution configuration.
## MUST
- Classify whether a change can affect model meaning, numerical behavior, or validated claims.
- Require targeted regression and revalidation proportional to impact.
- Document significant model changes and their rationale.
## MUST NOT
- combine unrelated model changes in a way that prevents attribution of changed outputs.
- bypass review for changes affecting decision-grade results.
## SHOULD
- Keep changes small enough for causal review and rollback.
## Exceptions
Urgent fixes require retrospective evidence and review before results are treated as authoritative.
## Verification
Git diff, review records, regression evidence, validation status, and release notes.
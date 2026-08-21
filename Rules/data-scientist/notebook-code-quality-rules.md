# Notebook and Code Quality Rules
## Purpose
Keep analytical code reviewable, maintainable, and safe to operationalize.
## Scope
Notebooks, scripts, libraries, SQL, and analysis pipelines.
## MUST
- Move reusable or production-critical logic into tested, versioned modules or pipelines.
- Make execution order, inputs, outputs, configuration, and side effects explicit.
- Review material SQL and data transformations for correctness and scale impact.
## MUST NOT
- Depend on hidden notebook state for released results.
- Embed credentials or environment-specific secrets in analytical code.
## SHOULD
- Use static checks, formatting, tests, and peer review proportional to operational impact.
## Exceptions
One-off exploration may remain notebook-local but cannot be the sole implementation of recurring critical logic.
## Verification
Run clean execution, tests, linters, secret scans, code review, and dependency inspection.
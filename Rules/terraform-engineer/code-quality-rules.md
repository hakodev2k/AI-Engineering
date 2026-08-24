# Terraform Code Quality

## Purpose
Keep infrastructure code understandable, deterministic, reviewable, and safe to maintain.

## Scope
HCL structure, expressions, locals, variables, resources, data sources, naming, and repository organization.

## MUST
- Configuration MUST be formatted and valid under the supported Terraform version.
- Complex expressions MUST remain understandable enough for reviewers to reason about resulting resources.
- Repeated infrastructure patterns MUST be evaluated for reusable abstraction without forcing premature generalization.
- Non-obvious lifecycle, dependency, and provider behavior MUST be documented near the relevant code or design record.

## MUST NOT
- Clever expression compression MUST NOT obscure infrastructure semantics.
- Dead resources, unused variables, and obsolete compatibility logic MUST NOT accumulate without ownership.
- Generated HCL MUST NOT be committed without a documented generation and regeneration process.
- Local naming conventions MUST NOT imply security or isolation properties they do not enforce.

## SHOULD
- Locals SHOULD clarify derived values rather than become hidden programming layers.
- Files SHOULD be organized by coherent domain or lifecycle, not arbitrary size alone.

## Exceptions
Generated or highly dynamic patterns require stronger tests, documentation, deterministic generation, and review evidence.

## Verification
Run formatter, validate, lint/static analysis, inspect complexity and duplication, review dependency graphs, and confirm documentation for non-obvious constructs.
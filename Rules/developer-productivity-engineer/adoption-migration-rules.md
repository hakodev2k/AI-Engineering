# Adoption and Migration Rules
## Purpose
Move teams to better developer workflows without unmanaged migration risk.
## Scope
Tool replacements, golden-path adoption, repository migrations, and deprecations.
## MUST
- Migration proposals MUST define current pain, target outcome, affected population, compatibility constraints, and success measures.
- Automated migrations MUST be reviewable, idempotent where practical, and preserve user-owned semantics.
- Deprecation MUST provide a supported replacement and realistic migration window unless security risk requires faster action.
- Completion MUST be measured by verified usage or compatibility evidence, not announcement alone.
## MUST NOT
- MUST NOT force migration solely to increase adoption metrics.
- MUST NOT rewrite repository history or perform destructive changes without explicit approval.
## SHOULD
- High-volume migrations SHOULD provide automated checks and rollback guidance.
## Exceptions
Urgent security deprecations require documented risk basis and compensating support.
## Verification
Pilot on representative repositories, inspect diffs, test rollback, measure adoption, and audit unresolved incompatibilities.
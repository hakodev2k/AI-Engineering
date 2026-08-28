# Detection as Code Rules

## Purpose
Apply software-engineering controls to detection content so changes are reviewable, reproducible, and auditable.

## Scope
Applies to detection definitions, parsers, enrichment logic, tests, metadata, deployment configuration, and supporting scripts stored as code.

## MUST
- Production detection content MUST be version-controlled with reviewable diffs.
- Material changes MUST pass automated syntax, schema, and test validation before deployment.
- Detection metadata MUST include stable identifiers, ownership, severity, data dependencies, and lifecycle state where supported.
- Generated detection artifacts MUST be reproducible from reviewed source or explicitly traceable to their source definition.

## MUST NOT
- MUST NOT make untracked production-only rule edits except during an authorized emergency workflow.
- MUST NOT merge changes that bypass required validation gates without documented approval.
- MUST NOT store credentials or sensitive production secrets in detection source.

## SHOULD
- Repositories SHOULD enforce formatting, linting, schema validation, and peer review consistently.
- Shared abstractions SHOULD reduce duplication without hiding security-relevant logic.

## Exceptions
Emergency changes require documented reason, approver, bounded scope, and prompt reconciliation back into source control.

## Verification
Inspect Git history, review records, CI results, deployment provenance, secret scanning, and source-to-production consistency.
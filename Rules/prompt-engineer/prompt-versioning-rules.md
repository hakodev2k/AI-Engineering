# Prompt Versioning Rules

## Purpose
Make prompt changes traceable, reviewable, and reversible.

## Scope
Production prompts, templates, reusable fragments, and configuration that materially changes prompt behavior.

## MUST
- Every production prompt change MUST be version-controlled with an identifiable diff.
- Released prompt versions MUST be traceable to evaluation results and deployment state.
- Breaking behavioral changes MUST be explicitly identified before release.
- Rollback to a previously validated version MUST be possible for critical workflows.

## MUST NOT
- MUST NOT edit production prompts through untracked manual changes.
- MUST NOT reuse a version identifier for materially different content.
- MUST NOT overwrite historical prompt evidence needed to explain prior behavior.

## SHOULD
- Prompt versions SHOULD use stable identifiers independent of display names.
- Change records SHOULD explain intent, expected impact, and known risks.

## Exceptions
Emergency mitigation may use an expedited path if the change is captured immediately, reviewed afterward, and remains reversible.

## Verification
Inspect repository history, release metadata, evaluation linkage, and rollback procedures.
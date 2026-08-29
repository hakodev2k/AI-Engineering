# Source Provenance Rules

## Purpose
Preserve trustworthy origin and review history for source used in released software.

## Scope
Applies to first-party code, generated code, vendored code, forks, patches, and imported assets.

## MUST
- Released source MUST be traceable to an approved repository and reviewed change history.
- Imported or vendored source MUST record origin, version or revision, license, and review evidence.
- Generated source MUST identify its generator and reproducible inputs where practical.
- Protected branches MUST require approved review and passing policy checks.

## MUST NOT
- MUST NOT release source copied from unverified locations without provenance review.
- MUST NOT bypass branch protections for routine delivery.

## SHOULD
- Provenance metadata SHOULD be machine-readable where tooling supports it.
- Source mirrors SHOULD preserve upstream revision identity.

## Exceptions
Exceptions MUST document origin uncertainty, compensating review, risk, owner, and approval.

## Verification
Inspect repository history, branch settings, import records, generator metadata, and release commits. Confirm released revisions map to approved source history.
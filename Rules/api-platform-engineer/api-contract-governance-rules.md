# API Contract Governance

## Purpose
Protect consumer-facing contracts from accidental incompatibility.

## Scope
Public and internal APIs governed by an API platform.

## MUST
- Contracts MUST define request, response, error, authentication, and compatibility semantics before release.
- Breaking changes MUST use an approved migration or versioning path.
- Contract changes MUST be reviewed against known consumers and generated specifications.

## MUST NOT
- MUST NOT remove, rename, or narrow published fields or behaviors without explicit approval and migration evidence.
- MUST NOT treat implementation behavior as an undocumented contract.

## SHOULD
- Contracts SHOULD be machine-readable and linted in CI.
- Additive changes SHOULD remain tolerant of older consumers.

## Exceptions
Exceptions require documented consumer impact, alternatives, rollback, and accountable approval.

## Verification
Review specification diffs, compatibility checks, consumer tests, and release notes.
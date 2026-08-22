# Code Review Governance Rules

## Purpose
Ensure implementation changes preserve architectural intent and manage system-wide risk.

## Scope
Applies to pull requests that affect module boundaries, public contracts, data ownership, security, performance, or production behavior.

## MUST
- High-impact changes MUST identify architectural consequences and affected boundaries in review.
- Reviewers MUST verify compatibility, failure behavior, security, and operational impact when relevant.
- Changes that contradict accepted architecture decisions MUST either be corrected or update the decision record with justified approval.
- Significant risk MUST be supported by tests, measurements, or equivalent evidence.

## MUST NOT
- MUST NOT approve structural changes based only on code style or local correctness.
- MUST NOT bypass required specialist review for security-, data-, or production-critical changes.
- MUST NOT accept hidden coupling merely because current tests pass.

## SHOULD
- Prefer small reviewable increments and explicit architectural review notes.
- Prefer automated architecture checks for repeatedly violated constraints.

## Exceptions
Emergency fixes may shorten review only with explicit approval, bounded scope, production verification, and follow-up review.

## Verification
Inspect PR templates, review history, architecture checks, test evidence, and linked decision records.
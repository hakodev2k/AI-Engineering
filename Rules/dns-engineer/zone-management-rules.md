# Zone Management Rules

## Purpose
Ensure DNS zone data remains correct, reviewable, and recoverable.

## Scope
Forward and reverse zones, record lifecycle, and zone ownership.

## MUST
- Every production zone MUST have an accountable owner and controlled source of truth.
- Record changes MUST validate syntax, uniqueness constraints, dependencies, and intended TTL behavior before publication.
- Removed records MUST be checked for consumers and rollback requirements.

## MUST NOT
- MUST NOT edit production zone data through unmanaged side channels.
- MUST NOT reuse names or addresses without checking stale references and cache implications.

## SHOULD
- Zone changes SHOULD be represented as reviewable diffs.
- Stale records SHOULD be periodically identified and removed through a controlled process.

## Exceptions
Emergency edits require incident context, post-change reconciliation, evidence, and approval appropriate to risk.

## Verification
Inspect source-of-truth diffs, lint zones, query authoritative servers, and compare published state with intended state.
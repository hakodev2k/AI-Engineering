# Skill: Output Compatibility Review

## Purpose
Determine whether a candidate agent-output schema or emitted instance remains compatible with existing consumers and whether a migration or approval is required.

## When to use
Run after changing prompts, model/tool configuration, serializers, schemas, enums, structured-output instructions, tool definitions, or producer implementation.

## Inputs
- Baseline schema.
- Candidate schema.
- Compatibility policy.
- Consumer inventory.
- Representative baseline/candidate instances.
- Consumer replay results.

## Preconditions
Baseline and candidate schemas must be parseable JSON objects and identify the same logical contract unless the change intentionally creates a new contract.

## Procedure
1. Run `scripts/compare-contract-schemas.py`.
2. Inspect every reported change instead of relying only on the aggregate status.
3. Confirm whether removed or newly required fields are consumed.
4. Confirm whether type, enum, nullability, format, or additional-properties changes alter parsing behavior.
5. Replay representative candidate instances through consumer tests or fixtures.
6. Separate structural compatibility from semantic compatibility.
7. Mark additive changes that consumers safely ignore as `compatible`.
8. Mark changes requiring consumer coordination but not immediate breakage as `migration-required`.
9. Mark changes that can make an existing consumer reject, misparse, or misinterpret output as `breaking`.
10. Require explicit migration evidence for `migration-required` and human approval for `breaking` changes.
11. Require an independent reviewer for high-risk or breaking changes.

## Expected output
A review record containing status, findings, affected consumers, evidence, migration requirement, approval requirement, reviewer identity, and unresolved risks.

## Verification
The review is valid only when its schema hashes match the exact baseline/candidate files that were compared and all configured mandatory consumer replay checks are represented.

## Failure handling
If replay tests are unavailable for a consumer, downgrade confidence and fail closed for breaking-sensitive changes. Tool/transient failures may be retried once; validation or business-semantic failures are not automatically retried.

## Stop conditions
Stop before accepting a breaking contract without explicit human approval, before silently updating the baseline to the candidate, or when consumer coverage is incomplete for a high-risk contract.
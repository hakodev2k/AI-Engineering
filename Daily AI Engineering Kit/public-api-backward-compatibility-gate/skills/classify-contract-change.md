# Classify Contract Change

## Purpose
Classify contract differences as compatible, conditionally compatible, deprecated, or breaking using evidence rather than intuition.

## Inputs
- Baseline contract manifest/artifacts
- Candidate contract manifest/artifacts
- Compatibility policy
- Change request/acceptance criteria

## Required context
Read adjacent API/DTO definitions, serializers, versioning conventions, compatibility tests, and consumer documentation only as needed to explain detected differences.

## Process
1. Run `scripts/compare-contracts.py` for deterministic structural differences.
2. Map each difference to a stable change ID.
3. Classify affected surface: REST, serialized-payload, public-dotnet, event, webhook, or other configured type.
4. Evaluate consumer impact.
5. Mark facts separately from hypotheses.
6. For a breaking candidate, determine whether versioning, additive migration, compatibility shim, or deprecation window can preserve consumers.
7. Record migration/deprecation evidence and required approval.
8. Produce a review record using `templates/compatibility-review.json`.

## Default breaking examples
- Removing/renaming a route, operation, response field, enum value, public type/member, or serialized property.
- Making an optional request field required.
- Narrowing an accepted value/type/range.
- Changing serialization names or discriminator semantics.
- Removing a previously documented success/status response.
- Changing a public method signature incompatibly.

## Usually additive examples
- Adding an optional response property when consumers tolerate unknown fields.
- Adding a new endpoint.
- Adding an optional request property with a safe default.

Additive does not automatically mean safe; policy may treat closed enums, strict schemas, generated SDKs, or exhaustive consumers as sensitive.

## Verification
Every detected difference has classification, evidence, affected surface, consumer risk, and disposition. No breaking change is marked allowed without required approval evidence.

## Failure handling
If semantics are ambiguous, mark `needs-review`; do not guess. Retry deterministic tooling once only for transient I/O/tool failure.

## Stop conditions
Stop before implementation/release if a breaking or ambiguous high-risk difference lacks an approved compatibility strategy.

# Skill: Contract Risk Assessment

## Purpose
Identify whether a proposed change can break consumers, persisted data, messages, configuration, or operational expectations.

## When to use
Run after the initial impact map and before implementation whenever the change touches or may touch a contract surface.

## Inputs
- `impact-manifest.json`
- Relevant API/event/schema/config/public-library definitions
- Existing compatibility tests when available

## Preconditions
- Change Impact Analysis has identified candidate contract surfaces.

## Process
1. Enumerate each external or durable contract touched by the change.
2. Classify the contract as `http`, `event`, `database`, `configuration`, `library`, `cli`, `serialization`, or `other`.
3. Determine whether the proposed behavior is additive, compatible, conditionally compatible, or breaking.
4. Check defaults, nullability, optional fields, ordering assumptions, enum/value expansion, serialization names, identifiers, versioning, and timeout/retry semantics where applicable.
5. Identify known producers and consumers from repository evidence.
6. Identify persisted historical data that must remain readable.
7. Define a compatibility test or inspection for every material contract.
8. Assign an approval requirement for breaking or uncertain durable/public contracts.
9. Update the manifest with risk classification and evidence.

## Tools it may use
- Code/schema search
- OpenAPI/protobuf/GraphQL/event schema inspection
- Migration and model inspection
- Existing contract/integration tests
- Git diff/history for previous compatibility patterns

## Constraints
- Treat undocumented consumers as a risk, not as proof that no consumer exists.
- Do not approve breaking changes autonomously.
- Do not change versioning strategy during assessment.

## Expected output
Updated contract entries in `impact-manifest.json` with compatibility classification, evidence, verification action, and approval status.

## Verification
Every material contract must have:
- a compatibility classification;
- at least one evidence item;
- an explicit verification method;
- human approval if classified `breaking` or `uncertain-high-risk`.

## Failure handling
If consumer discovery is incomplete, mark the contract uncertain and escalate rather than assuming compatibility.

## Stop conditions
Stop when all identified contract surfaces are classified and every breaking/high-risk uncertainty is routed to human approval.

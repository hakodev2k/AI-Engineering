# API Versioning and Evolution

## Purpose
Evolve public or shared APIs without unnecessarily breaking consumers.

## When to use
Use for contract changes, deprecations, migrations, or compatibility reviews.

## Inputs
Current contract, proposed change, consumer inventory, usage telemetry, and support policy.

## Context to inspect
Published schemas, SDKs, clients, gateway rules, documentation, and deprecation commitments.

## Core knowledge
Prefer additive compatible changes. Breaking changes include removed or retyped fields, tightened validation, semantic changes, and altered defaults—not only route changes.

## Procedure
1. Classify the proposed change.
2. Identify affected consumers.
3. Seek a backward-compatible alternative.
4. Define version boundary only when necessary.
5. Publish migration guidance and dates.
6. Instrument old-version usage.
7. Run compatibility tests.
8. Deprecate visibly before removal.
9. Remove only after policy and evidence permit.

## Decision points
Use explicit versions for unavoidable incompatible contracts; avoid versions for changes that can safely remain additive.

## Common failure patterns
Silent semantic breaks, indefinite version proliferation, removing fields based on assumptions, and versioning implementation rather than contract.

## Verification
Contract-diff tests pass, known consumers are assessed, migration path is tested, and deprecated usage is measurable.

## Expected output
A compatibility plan with migration and deprecation controls.

## Stop conditions
Escalate when consumer ownership is unknown or contractual compatibility obligations are unclear.
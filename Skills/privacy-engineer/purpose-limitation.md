# Purpose Limitation

## Purpose
Ensure personal data is used only for explicit, approved purposes and prevent silent function creep.

## When to use
Use when adding consumers, analytics, personalization, model training, data sharing, or secondary processing.

## Inputs
Approved purposes, data inventory, proposed use, user expectations, contracts, and policy decisions.

## Context to inspect
Inspect collection context, notices, consent or other approved basis, downstream consumers, and historical assumptions.

## Core knowledge
Technical availability does not imply permission to reuse data. Purpose boundaries should be represented in architecture, access, metadata, and review workflows.

## Procedure
1. Identify original purpose and collection context.
2. Define proposed new processing precisely.
3. Compare data, users, impact, recipients, and expectations.
4. Obtain privacy/legal determination where required.
5. Separate incompatible processing paths.
6. Enforce access and policy boundaries.
7. Update transparency and controls when approved.
8. Add tests and monitoring for unauthorized reuse.

## Decision points
Prefer separate datasets, scoped tokens, purpose tags, or aggregation when they make boundaries enforceable.

## Common failure patterns
Broad “improve services” purposes, unrestricted warehouse access, repurposing support data for training, and undocumented downstream reuse.

## Verification
Trace each consumer to an approved purpose and confirm unauthorized identities cannot access the data path.

## Expected output
Enforceable purpose boundaries with documented approvals.

## Stop conditions
Stop secondary processing when compatibility or authorization is unresolved.
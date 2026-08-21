# Skill — Profile Context Budget

## Purpose
Measure context cost by source before proposing token optimizations.

## Trigger
Use when fresh sessions begin with high token usage, context depletes unexpectedly, tool/skill inventories grow, or prompt changes need a token regression review.

## Inputs
A JSON inventory of context fragments with `name`, `source`, `kind`, `text`, and optional `required=true|false`.

## Preconditions
The inventory must represent the actual host configuration closely enough to attribute sources. Never infer hidden model context that the host does not expose.

## Procedure
1. Capture a baseline inventory before changing configuration.
2. Estimate tokens per fragment and total fixed context.
3. Group by source and kind.
4. Hash normalized fragments to detect exact duplicates.
5. Flag fragments over configured budget thresholds.
6. Classify each fragment: mandatory, conditional, candidate-for-deferral, or unknown.
7. Produce recommendations without deleting content.
8. Create an optimized candidate inventory externally.
9. Measure again.
10. Run representative regression tasks before accepting savings.

## Decision points
- Is the fragment correctness/security critical?
- Is it required on every task or only a subset?
- Does another fragment duplicate its content?
- Can the host load it dynamically?
- Is the expected saving large enough to justify complexity?

## Expected output
A machine-readable report plus ranked hotspots and a conservative optimization plan.

## Metrics
Fixed estimated tokens, source share, duplicate ratio, candidate savings, quality regression rate.

## Verification
Savings count only when before/after inventories use the same estimator and representative tasks retain required behavior.

## Failure handling
Missing fields fail validation. Unknown source relevance is never treated as safe-to-remove.

## Stop conditions
Stop if the inventory is incomplete enough that source attribution would be misleading, or if a proposed reduction removes mandatory security/correctness instructions.

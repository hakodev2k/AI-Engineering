# Diversity and Deduplication Rules

## Purpose
Prevent redundant result sets while preserving the strongest relevant evidence.

## Scope
Applies to duplicate detection, near-duplicate grouping, source diversity, intent coverage, and result collapsing.

## MUST
- Deduplication rules MUST define the unit of equivalence and which representative survives.
- Diversity logic MUST be evaluated for both relevance preservation and coverage improvement.
- Canonicalization MUST be stable enough that repeated requests do not arbitrarily swap equivalent results.
- High-value exact matches MUST not be removed by broad near-duplicate heuristics without evidence.

## MUST NOT
- MUST NOT deduplicate solely on superficial text similarity when distinct entities or versions matter.
- MUST NOT force diversity that inserts clearly irrelevant results.
- MUST NOT hide duplicate rates that materially affect user experience.

## SHOULD
- Measure duplicate prevalence and diversity by important query classes.

## Exceptions
Require documented equivalence criteria, evidence, risk, and verification.

## Verification
Review duplicate clusters, representative-selection tests, diversity metrics, and sampled ranked lists.
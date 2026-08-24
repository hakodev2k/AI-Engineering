# Freshness and Personalization

## Purpose
Blend freshness and user/context signals into ranking without overpowering core relevance, creating feedback loops, or making results unpredictable.

## When to use
Use when recency, user history, geography, availability, or contextual preferences materially influence the best result.

## Inputs
Document timestamps, user/context signals, relevance judgments, behavior data, privacy constraints, ranking model or score functions.

## Context to inspect
Current freshness boosts, decay functions, personalization features, consent boundaries, cold-start behavior, session logic, and fallback ranking.

## Core knowledge
Freshness is intent-dependent: recent is not universally better. Personalization should be additive and bounded unless the product explicitly requires individualized results. Historical behavior can reinforce exposure bias.

## Procedure
1. Identify intents where freshness or personalization should matter.
2. Define eligible signals and privacy/consent constraints.
3. Normalize timestamps and contextual features.
4. Choose bounded decay or feature transformations.
5. Preserve a strong non-personalized relevance baseline.
6. Define cold-start and missing-signal behavior.
7. Test against evergreen and exact-match counterexamples.
8. Evaluate segment-level gains and filter-bubble risks.
9. Run online experiments with guardrails.
10. Monitor drift and changes in signal availability.

## Decision points
Use freshness as a feature when relevance depends partly on recency; hard sort by date only for explicitly chronological intents. Prefer session/context personalization over long-term profiles when privacy or drift risk is high.

## Common failure patterns
Global recency boosts, stale profile data, popularity feedback loops, no cold-start path, personalization overriding exact intent, and using sensitive attributes without authorization.

## Verification
Measure relevance, downstream success, cold-start behavior, evergreen regressions, privacy compliance, and stability when signals are missing.

## Expected output
Signal contract, decay/personalization logic, eligibility rules, fallback behavior, evaluation evidence, and monitoring thresholds.

## Stop conditions
Stop when consent or data-use authority is unclear, personalization creates unexplained regressions, or signal quality is too unstable for ranking.
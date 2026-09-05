# Freshness and Recency Rules

## Purpose
Use freshness deliberately without allowing recency to overwhelm relevance or authority.

## Scope
Applies to timestamps, decay functions, recency boosts, update signals, and time-sensitive query classes.

## MUST
- Freshness signals MUST distinguish publication, modification, ingestion, and event time when those semantics differ.
- Recency boosts MUST be evaluated on query classes where freshness is actually relevant.
- Timestamp quality and missing-value behavior MUST be defined.
- Time-sensitive changes MUST be tested across clock, timezone, and delayed-ingestion scenarios where applicable.

## MUST NOT
- MUST NOT treat ingestion time as content freshness without justification.
- MUST NOT globally boost newer content when evergreen relevance materially degrades.
- MUST NOT allow malformed future timestamps to dominate ranking.

## SHOULD
- Use query-dependent freshness rather than a universal decay when intent varies.

## Exceptions
Require documented affected queries, evidence, risk, and monitoring.

## Verification
Review timestamp lineage, ranking tests, segment metrics, malformed-time tests, and production distributions.
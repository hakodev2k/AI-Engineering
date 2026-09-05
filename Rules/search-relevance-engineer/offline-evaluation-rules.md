# Offline Evaluation Rules

## Purpose
Make offline relevance evaluation reproducible, representative, and resistant to misleading aggregate gains.

## Scope
Applies to judgment sets, graded relevance labels, NDCG, MRR, recall, precision, segment analysis, and regression gates.

## MUST
- Evaluation sets MUST represent important query classes and known failure modes.
- Judgment guidelines MUST define relevance levels consistently enough for repeatable assessment.
- Candidate changes MUST be compared against the same baseline and evaluation conditions.
- Aggregate metrics MUST be accompanied by segment analysis for materially different intents or traffic classes.

## MUST NOT
- MUST NOT repeatedly tune against the same held-out set without accounting for evaluation contamination.
- MUST NOT hide severe regressions in critical segments behind small aggregate gains.
- MUST NOT claim improvement when observed differences are within known evaluation noise without qualification.

## SHOULD
- Track inter-rater agreement and refresh stale judgment sets when corpus or user intent changes.

## Exceptions
Require documented evaluation limitations, alternative evidence, risk, and approval.

## Verification
Inspect judgment guidelines, dataset versions, metric calculations, segment reports, and regression history.
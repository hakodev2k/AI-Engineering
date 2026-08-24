# Search Relevance

## Purpose
Protect result usefulness by making relevance an explicit, measurable product contract.

## Scope
Ranking, retrieval, query interpretation, and relevance changes.

## MUST
- Define relevance objectives and representative query classes before changing ranking behavior.
- Evaluate material ranking changes against a versioned judgment set or equivalent reproducible evidence.
- Segment evaluation so gains on dominant traffic cannot hide regressions on critical or minority query classes.
- Record the baseline, candidate, metrics, dataset version, and known trade-offs for material changes.

## MUST NOT
- Claim relevance improvement from anecdotal queries alone.
- Optimize a single offline metric when it conflicts with documented user or business outcomes.
- Ship known severe regressions on safety-critical or high-value query classes without explicit approval.

## SHOULD
- Combine offline judgments with online behavioral evidence where appropriate.
- Prefer interpretable relevance signals when equivalent quality can be achieved.

## Exceptions
Exceptions require documented context, evidence limitations, risk, fallback, verification plan, and approval for material production impact.

## Verification
Review evaluation reports, judgment-set versions, segmented metrics, experiment results, and release evidence.
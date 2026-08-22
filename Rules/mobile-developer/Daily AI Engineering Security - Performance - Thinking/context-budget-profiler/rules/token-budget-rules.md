# Token Budget Rules

## MUST
- MUST measure a baseline before changing context composition.
- MUST attribute every measured fragment to a source and kind.
- MUST preserve correctness, security, authorization, and required tool instructions even when they are expensive.
- MUST compare before/after using the same estimator and inventory method.
- MUST run representative regression tasks before accepting a removal, compression, or deferral.
- MUST mark unknown relevance as `unknown`, not `safe-to-remove`.
- MUST set hard budgets for newly injected static fragments.

## MUST NOT
- MUST NOT delete context solely because it is large.
- MUST NOT report estimated-token savings as provider-billed exact savings.
- MUST NOT merge semantically different instructions merely because text similarity is high.
- MUST NOT optimize away security or human-approval constraints.
- MUST NOT claim quality is preserved without regression evidence.

## SHOULD
- SHOULD prefer lazy/deferred loading for task-conditional tool or skill metadata where the host supports it.
- SHOULD deduplicate identical stable instructions at their source rather than masking them during reporting.
- SHOULD flag any new single static fragment above 1,000 estimated tokens for manual review.
- SHOULD keep startup context stable to preserve caching opportunities where supported.
- SHOULD track fixed-context growth over time in CI.

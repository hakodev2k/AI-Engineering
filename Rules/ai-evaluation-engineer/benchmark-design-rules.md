# Benchmark Design Rules

## Purpose
Define benchmarks that produce meaningful, stable, and decision-relevant evidence about AI system behavior.

## Scope
Applies to internal and external benchmarks used for model selection, regression detection, release gating, and comparative analysis.

## MUST
- Benchmarks MUST represent the intended task distribution or explicitly document where they do not.
- Benchmark items MUST have unambiguous expected behavior or a documented grading procedure.
- Benchmark difficulty and category composition MUST be inspected for skew before results are used for decisions.
- Benchmark revisions MUST be versioned so historical comparisons remain interpretable.
- Public benchmark results MUST be treated as potentially contaminated when training exposure cannot be ruled out.

## MUST NOT
- MUST NOT optimize a system against a benchmark and then present the same benchmark as independent evidence of generalization.
- MUST NOT silently remove difficult or failing cases to improve headline metrics.
- MUST NOT compare scores produced under materially different prompts, tools, sampling settings, or grading procedures without disclosure.

## SHOULD
- Benchmarks SHOULD include realistic edge cases and production-derived failure patterns where privacy and policy allow.
- Large suites SHOULD be stratified by meaningful task and risk categories.

## Exceptions
Synthetic or narrow benchmarks may be used when their limited purpose is documented and conclusions remain within that scope.

## Verification
Inspect benchmark provenance, category distribution, item review records, version history, execution configuration, and contamination analysis. Re-run a representative sample to confirm reproducibility.
# Evaluation Design Rules

## Purpose
Ensure model evaluations measure risks and capabilities that matter in the actual deployment context.

## Scope
Applies to offline evaluations, human evaluations, automated graders, benchmark selection, and acceptance thresholds.

## MUST
- Evaluation design MUST map metrics and test sets to intended use, material risks, and known failure modes.
- Critical metrics MUST have defined interpretation and acceptance thresholds before release decisions.
- Evaluation datasets MUST be checked for leakage, duplication, contamination, and obvious sampling bias when these could invalidate conclusions.
- Automated evaluators MUST themselves be validated for reliability on the decisions they influence.
- Aggregate metrics MUST be supplemented with subgroup or slice analysis where materially different failure rates could be hidden.

## MUST NOT
- Benchmark improvements MUST NOT be presented as production-risk reduction without evidence connecting the benchmark to real use.
- Teams MUST NOT average away severe failures that require independent thresholds.

## SHOULD
- Evaluations SHOULD include adversarial, long-tail, and realistic multi-turn scenarios when relevant.
- Threshold changes SHOULD be versioned and justified with evidence.

## Exceptions
If a risk cannot be evaluated quantitatively, define a documented qualitative review method, reviewers, evidence, and decision criteria.

## Verification
Review evaluation specifications, datasets, metric definitions, slice reports, evaluator validation, and release criteria. Reproduce sampled results using pinned model and evaluator configurations.
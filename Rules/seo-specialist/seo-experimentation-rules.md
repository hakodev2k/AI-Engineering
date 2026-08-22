# SEO Experimentation Rules
## Purpose
Test SEO hypotheses without confusing natural variation with treatment effects.
## Scope
Template tests, content tests, internal-link tests, metadata tests, and controlled rollouts.
## MUST
- State hypothesis, primary metric, treatment population, comparison method, duration rationale, and guardrails before a material test.
- Preserve enough baseline and implementation detail to reproduce analysis.
- Check for contamination from concurrent releases and external changes.
## MUST NOT
- Stop tests solely when a favorable result appears.
- Generalize a result beyond tested page types or conditions without evidence.
## SHOULD
- Use randomized or matched page groups when feasible.
## Exceptions
Sequential rollouts may substitute for formal experiments when operational risk prevents randomization, provided causal limits are explicit.
## Verification
Experiment specification, deployment evidence, cohort integrity, metric calculation, and post-test review.
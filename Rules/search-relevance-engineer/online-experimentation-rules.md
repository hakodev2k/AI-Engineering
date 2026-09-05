# Online Experimentation Rules

## Purpose
Ensure search changes are validated on real user behavior with controlled exposure and defensible decisions.

## Scope
Applies to A/B tests, interleaving, canaries, treatment allocation, guardrails, and experiment interpretation.

## MUST
- Experiments MUST define hypotheses, primary metrics, guardrails, target population, and stop criteria before launch.
- Treatment assignment MUST avoid contamination that invalidates interpretation.
- Search-quality experiments MUST monitor latency, error rate, zero-result rate, and critical business or safety guardrails where relevant.
- Rollout decisions MUST account for statistical uncertainty and practical effect size.

## MUST NOT
- MUST NOT stop experiments opportunistically solely because a desired metric crosses a threshold.
- MUST NOT expose all traffic to unvalidated high-risk ranking changes when bounded experimentation is practical.
- MUST NOT generalize results beyond segments or periods not represented by the experiment without evidence.

## SHOULD
- Use progressive exposure for changes with uncertain operational or relevance impact.

## Exceptions
Require documented urgency, alternative evidence, bounded risk, and approval.

## Verification
Review experiment configuration, allocation checks, metric definitions, analysis notebooks or reports, and rollout decisions.
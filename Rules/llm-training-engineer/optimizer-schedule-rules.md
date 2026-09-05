# Optimizer and Schedule Rules

## Purpose
Keep optimization choices stable, interpretable, and appropriate to effective training scale.

## Scope
Optimizer family, learning rate, warmup, decay, weight decay, momentum/betas, gradient clipping, batch size, and schedule transitions.

## MUST
- Optimizer and scheduler parameters MUST be explicitly captured in resolved run configuration.
- Learning-rate decisions MUST account for effective batch size, model scale, training stage, and resume semantics.
- Schedule progress MUST be restored consistently after checkpoint resume unless a deliberate transition is documented.
- Material optimizer changes MUST be evaluated for convergence, stability, and final-quality effects.
- Gradient accumulation and skipped-step behavior MUST be reflected correctly in optimizer-step and scheduler-step accounting.

## MUST NOT
- MUST NOT reset optimizer or scheduler state accidentally during resume or checkpoint conversion.
- MUST NOT tune on a single favorable short-run trajectory and assume final convergence behavior.
- MUST NOT change multiple optimizer dimensions in an ablation and attribute gains to one component.

## SHOULD
- Optimization studies SHOULD compare matched token/compute budgets.
- Schedule boundaries SHOULD be observable in logs and checkpoint metadata.

## Exceptions
Intentional optimizer resets during stage transitions require rationale, baseline comparison, and explicit checkpoint lineage.

## Verification
Inspect resolved configs, effective batch calculations, optimizer state in checkpoints, scheduler counters, learning-rate traces, and matched-budget comparisons.
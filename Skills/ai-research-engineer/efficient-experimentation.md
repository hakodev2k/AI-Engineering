# Efficient Experimentation

## Purpose
Maximize research information gained per unit of compute, engineering time, and calendar time. This skill helps Senior AI Research Engineers stage experiments, use proxies responsibly, reuse artifacts, and terminate low-value work without compromising scientific validity.

## When to use
Use when experiment queues are expensive, model training is large, many candidate ideas compete for resources, or research velocity is limited by compute and infrastructure.

## Inputs
- Research hypothesis portfolio
- Compute and time budget
- Historical run costs and variance
- Available smaller models, data subsets, or shortened training schedules
- Experiment tracking system

## Preconditions
Define the final decision metric and identify which lower-fidelity signals are plausible proxies rather than assuming small experiments rank ideas correctly.

## Context to inspect
Inspect queue latency, accelerator utilization, startup overhead, checkpoint reuse opportunities, data loading cost, experiment failure rates, correlation between small and large runs, tuning budget, and duplicated work across researchers.

## Core knowledge
Efficiency means increasing information, not merely shortening runs. Multi-fidelity experimentation works only when lower-cost experiments preserve enough signal about the final objective. Early stopping can bias comparisons if methods learn at different rates. Shared baselines and reusable checkpoints reduce cost but must not introduce hidden differences.

## Procedure
1. Rank hypotheses by expected value, uncertainty, cost, and dependency on prior results.
2. Define the minimum experiment capable of falsifying each hypothesis.
3. Identify reusable baselines, checkpoints, cached representations, datasets, or evaluation outputs.
4. Validate whether smaller models, shorter runs, reduced data, or fewer benchmarks correlate with full-scale outcomes.
5. Use cheap sanity tests to eliminate implementation defects before scheduled training.
6. Run broad exploratory screening only at a fidelity that preserves useful ranking.
7. Promote promising ideas using explicit criteria rather than researcher preference.
8. Parallelize independent experiments when resources and analysis capacity allow.
9. Terminate runs for predefined correctness or instability failures.
10. Avoid stopping solely because an early metric temporarily underperforms unless early ranking is validated.
11. Track cost, queue time, GPU utilization, and failed-run waste.
12. Automate repetitive evaluation and metadata capture.
13. Periodically analyze which experiment types predicted final decisions and remove low-information rituals.
14. Reserve sufficient budget for confirmatory repetitions and negative controls.

## Decision points
- Use low-fidelity proxies only after measuring correlation with full-scale outcomes.
- Reuse checkpoints when initialization is not part of the research claim.
- Prefer fewer decisive experiments over a large sweep of poorly controlled runs.
- Spend more compute when uncertainty around a high-value decision remains larger than the effect that matters.

## Common failure patterns
- Optimizing GPU utilization while running scientifically useless experiments.
- Generalizing from tiny models whose behavior does not scale.
- Excessive hyperparameter sweeps before validating the core mechanism.
- Early-stopping methods with slower learning dynamics unfairly.
- Rerunning baselines unnecessarily because artifacts are poorly cataloged.
- Using one proxy metric long after it stops predicting final quality.

## Verification
Efficiency improvements are implemented when staged experiments and reuse mechanisms are operational. They are verified when total compute/calendar cost falls without increasing false conclusions, lower-fidelity decisions correlate with final outcomes, and confirmatory evidence remains rigorous.

## Expected output
A staged experiment plan, promotion/termination rules, validated proxy relationships, reusable artifact references, resource accounting, and evidence of information-per-cost improvement.

## Stop conditions
Stop when proxy fidelity is unknown for a high-stakes decision, cost-saving changes alter the research variable, insufficient budget remains for confirmatory evaluation, or infrastructure instability makes cost comparisons misleading.
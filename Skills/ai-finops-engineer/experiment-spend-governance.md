# Experiment Spend Governance

## Purpose
Control research and experimentation spend without preventing useful exploration. Establish bounded freedom, ownership, and evidence-based escalation for expensive experiments.

## When to use
Use for notebooks, hyperparameter sweeps, model fine-tuning, ablations, synthetic-data generation, or prototype API usage.

## Inputs
- Experiment metadata and owners
- Budget envelopes
- Scheduler and API usage
- Expected business/research value
- Historical experiment costs
- Approval thresholds

## Context to inspect
Inspect default resource sizes, idle notebooks, sweep cardinality, duplicate experiments, checkpoint/restart strategy, provider model selection, and automatic cleanup.

## Core knowledge
Research uncertainty makes exact ROI impossible, but spend can still be governed with hypotheses, bounded budgets, stopping rules, reusable artifacts, and progressive escalation. The objective is cost-aware learning velocity, not minimum spend.

## Procedure
1. Define experiment ownership and required metadata.
2. Set default per-user/team budget envelopes.
3. Require a hypothesis and success metric for high-cost runs.
4. Estimate expected maximum spend before launch.
5. Apply quotas, scheduler limits, or API controls.
6. Use progressive scaling: small validation runs before full-scale jobs.
7. Define early stopping criteria and automatic idle cleanup.
8. Track failed and duplicated experiments as waste signals.
9. Escalate budget only when prior evidence justifies more spend.
10. Archive useful results and artifacts to prevent repeated work.
11. Review spend and learning outcomes periodically.

## Decision points
Allow low-cost experimentation with minimal friction; require review for large or irreversible commitments. Prefer broad cheap screening before expensive full runs.

## Common failure patterns
Unlimited sweeps, idle notebooks, repeated failed configurations, premium models for trivial tests, and approvals based only on dollar thresholds without technical context.

## Verification
Confirm quotas work, idle cleanup occurs, high-cost experiments have metadata, and actual spend remains within approved envelopes unless explicitly escalated.

## Expected output
An experiment governance policy, budget thresholds, controls, exception process, and spend/learning review.

## Stop conditions
Stop an experiment when budget is exhausted, stopping criteria are met, required ownership is missing, or continued spend lacks a defensible learning objective.
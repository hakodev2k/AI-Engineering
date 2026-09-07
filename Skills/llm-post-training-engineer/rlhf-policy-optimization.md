# RLHF Policy Optimization

## Purpose
Run reinforcement-learning-based human preference optimization safely, controlling policy drift, reward exploitation, instability, and compute cost.

## When to use
Use when online sampling and exploration materially improve over static preference optimization, when a trustworthy reward model exists, or when the objective requires iterative policy-dependent feedback.

## Inputs
Initial policy, reference policy, reward model/verifiers, prompt distribution, RL algorithm configuration, safety constraints, evaluation suites, and rollout infrastructure.

## Preconditions
Reward behavior is audited, rollback checkpoints exist, rollout data can be traced to policy versions, and training can be stopped rapidly on instability.

## Context to inspect
Inspect reward calibration, policy/reference tokenization, rollout temperatures, KL controls, advantage estimation, clipping parameters, batch sizes, generation limits, distributed synchronization, and historical reward-hacking patterns.

## Core knowledge
Online policy optimization couples generation, reward, and learning. Improvements in mean reward can hide entropy collapse, reward hacking, catastrophic policy drift, or tail-safety failures. KL regularization, reward normalization, advantage quality, rollout diversity, and policy freshness are control surfaces rather than incidental hyperparameters.

## Procedure
1. Baseline the initial policy against reward and independent evaluations.
2. Validate rollout/reward pipelines on fixed examples end to end.
3. Confirm policy, reference, and reward tokenization/template alignment.
4. Start with conservative update magnitude and explicit KL targets.
5. Monitor reward, KL, entropy, response length, advantage statistics, clipping fraction, and gradient health.
6. Save frequent recoverable checkpoints.
7. Sample high-reward outputs continuously and inspect for proxy exploitation.
8. Evaluate independent safety and capability suites at regular intervals.
9. Separate reward improvements caused by style/length changes from substantive quality gains.
10. Adjust rollout diversity or prompt mixture if optimization collapses onto narrow behaviors.
11. Halt and diagnose abrupt distribution shifts before resuming.
12. Compare finalists against SFT and offline-preference baselines using independent judges or humans.

## Decision points
Prefer offline methods if online exploration adds little. Tighten KL when capability preservation is more important than rapid reward gain; loosen cautiously when the reference demonstrably blocks desired behavior. Use verifiable rewards for objective subproblems and learned rewards for subjective preferences.

## Common failure patterns
Reward hacking; stale rollout policies; runaway KL; entropy collapse; unstable reward normalization; training on unrepresentative prompts; selecting by reward alone; ignoring high-reward safety violations.

## Verification
Verify stable optimization traces, independent win-rate gains, bounded divergence, preserved capabilities, safety-gate performance, and manual audits of reward extremes. Reproduce a short segment from recorded configuration.

## Expected output
A selected RLHF checkpoint, full training lineage, reward/divergence curves, independent evaluations, failure analysis, and rollback point.

## Stop conditions
Stop immediately for non-finite gradients, runaway divergence, reward exploitation, critical safety regression, corrupted rollout attribution, or inability to reproduce reward calculations.
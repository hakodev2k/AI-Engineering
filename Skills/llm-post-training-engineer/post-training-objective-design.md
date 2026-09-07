# Post-Training Objective Design

## Purpose
Design a measurable post-training objective that converts product, safety, and behavior goals into trainable signals without optimizing a proxy that damages unrelated capabilities.

## When to use
Use before supervised fine-tuning, preference optimization, reinforcement learning, or any new post-training campaign. Reuse when requirements, base model, target users, or risk profile change. Do not start optimization when desired behavior cannot yet be evaluated reliably.

## Inputs
- Base model and known capability profile
- Target user journeys and acceptance criteria
- Safety and policy requirements
- Evaluation suites and historical regressions
- Compute, latency, data, and release constraints

## Preconditions
Stakeholders can distinguish required behavior from aspirational behavior, and there is a representative evaluation path for high-impact requirements.

## Context to inspect
Review base-model strengths and weaknesses, previous tuning recipes, serving constraints, target languages/domains, safety policies, evaluator reliability, and known failure modes. Identify capabilities that must be preserved as explicit non-regression constraints.

## Core knowledge
Post-training is multi-objective optimization. Instruction following, helpfulness, style, reasoning, safety, calibration, tool use, and domain adaptation can compete. A single scalar reward often hides trade-offs. Good objectives separate hard constraints from optimizable preferences, define behavior at observable boundaries, and include preservation metrics. Offline metrics are proxies; the design must anticipate distribution shift, reward hacking, evaluator bias, and alignment tax.

## Procedure
1. Translate product requirements into observable behaviors rather than vague qualities.
2. Segment behaviors by scenario, risk, language, domain, and interaction mode.
3. Define must-pass constraints, improvement targets, and preservation metrics.
4. Establish baseline performance on the untouched base model.
5. Map each target behavior to a training signal: demonstrations, pairwise preferences, scalar feedback, verifiable rewards, or policy constraints.
6. Identify where labels are subjective and require rubrics or multiple raters.
7. Define evaluation slices that can reveal regressions hidden by aggregate scores.
8. Assign explicit weights or priority ordering to competing objectives.
9. Specify stopping thresholds and release gates before training begins.
10. Run small controlled experiments to test whether the proposed signal moves the intended metric.
11. Check correlated degradation in preserved capabilities and safety behavior.
12. Revise the objective if optimization improves the proxy without improving end behavior.
13. Record the final objective, assumptions, metrics, and rejected alternatives.

## Decision points
- Prefer hard filters or constrained optimization for non-negotiable safety boundaries; use weighted optimization for genuine preferences.
- Prefer verifiable rewards where correctness is machine-checkable; use human or model preference signals for subjective quality.
- Use one combined objective only when component metrics behave compatibly; otherwise stage training or use explicit multi-objective methods.
- Preserve base behavior with reference-model constraints, replay data, or regression gates when capability loss is costly.

## Common failure patterns
- Optimizing an easy benchmark instead of the user outcome
- Combining incompatible goals into an uninterpretable scalar
- Omitting preservation metrics
- Using average scores that conceal severe tail regressions
- Treating policy compliance as style preference
- Changing objectives during training without preserving experiment comparability
- Relying on an evaluator with known systematic bias

## Verification
Verify that every high-priority behavior maps to both a trainable signal and an independent evaluation. Confirm baseline values, slice coverage, preservation metrics, and stopping criteria are recorded. Demonstrate with a pilot that movement in the training signal correlates with the intended downstream behavior.

## Expected output
A versioned post-training objective specification containing behavior targets, metric definitions, priority/weighting rules, evaluation slices, preservation constraints, stopping criteria, and known risks.

## Stop conditions
Stop and escalate if critical requirements are contradictory, high-impact behavior lacks a trustworthy evaluator, policy boundaries are unresolved, or pilot optimization shows strong proxy gaming that cannot be separated from the target objective.
# Reasoning Behavior Tuning

## Purpose
Improve model performance on multi-step reasoning tasks while preserving calibration, efficiency, and robust final-answer behavior rather than merely increasing visible verbosity.

## When to use
Use when the model underperforms on compositional, mathematical, planning, coding, or verification-heavy tasks and post-training can teach better solution strategies. Do not equate longer outputs with better reasoning.

## Inputs
Reasoning task distribution, verifiable problems where available, demonstrations or preference pairs, process/outcome evaluators, token-budget constraints, and base-model benchmarks.

## Preconditions
Success can be measured independently from superficial response style, and evaluation includes unseen problem families.

## Context to inspect
Inspect base accuracy versus response length, failure taxonomies, self-correction behavior, answer extraction, tool availability, training traces, contamination risk, and deployment latency/token constraints.

## Core knowledge
Reasoning tuning can optimize outcomes, intermediate process signals, or both. Process supervision may provide denser learning signals but risks teaching evaluator-specific traces. Outcome supervision is simpler when answers are verifiable but may be sparse. Senior practice distinguishes latent task competence from presentation style and controls for contamination and verbosity.

## Procedure
1. Categorize failures into knowledge, decomposition, calculation, planning, verification, and answer-format errors.
2. Establish accuracy and cost baselines by difficulty slice.
3. Prioritize verifiable tasks for objective feedback where possible.
4. Curate diverse solution strategies rather than one rigid trace format.
5. Include examples that detect and correct plausible intermediate errors.
6. Train with controlled token budgets and checkpoint frequently.
7. Evaluate final-answer accuracy independently of trace aesthetics.
8. Compare matched prompts at different reasoning budgets.
9. Test unseen task templates and adversarially perturbed problems.
10. Measure calibration and abstention on unsolved problems.
11. Check regression on simple tasks where excessive deliberation is wasteful.
12. Select checkpoints using quality-cost trade-offs, not raw token count.

## Decision points
Use process supervision when intermediate correctness can be judged reliably; prefer outcome rewards when final results are objectively verifiable. Increase reasoning budget only where marginal accuracy justifies latency and cost. Use tools when external computation is more reliable than learned arithmetic or retrieval.

## Common failure patterns
Rewarding verbose but wrong reasoning; benchmark memorization; brittle fixed trace formats; degraded simple-task latency; confident fabricated intermediate steps; evaluator preference for polished explanations over correctness.

## Verification
Verify accuracy on contamination-resistant holdouts, performance by difficulty, calibration, response-token cost, robustness to prompt paraphrase, and preservation of straightforward task behavior.

## Expected output
A tuned checkpoint and report showing reasoning gains, cost/latency impact, generalization results, failure taxonomy changes, and known limitations.

## Stop conditions
Stop if gains vanish on unseen task families, training mainly increases verbosity, calibration worsens materially, or evaluation contamination cannot be excluded.
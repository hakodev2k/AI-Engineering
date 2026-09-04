# Experiment and Hyperparameter Strategy

## Purpose
Run disciplined time-series ML experiments that isolate causal improvements, avoid temporal test leakage, and use compute efficiently.

## When to use
Use when comparing model families, tuning hyperparameters, evaluating features, changing context windows, or deciding whether extra model complexity is justified.

## Inputs
- Candidate models and configurations
- Temporal backtest protocol
- Baselines and release metrics
- Compute budget
- Experiment tracker or reproducible run metadata
- Untouched final test window

## Context to inspect
Inspect existing experiments, validation variance across time and random seeds, horizon-specific behavior, entity imbalance, training cost, and whether earlier tuning already consumed information from nominal test periods.

## Core knowledge
Time-series tuning must preserve chronology. Model ranking can vary materially by forecast origin, horizon, entity, and random seed. Broad blind search wastes compute when the dominant errors come from formulation or data. Ablations are essential for separating true improvements from bundles of simultaneous changes.

## Procedure
1. Freeze the problem definition, primary metric, temporal folds, and final untouched test window.
2. Reproduce strong baselines before tuning complex models.
3. Form an explicit hypothesis for each experiment family.
4. Change one major factor at a time when attribution matters.
5. Define bounded search spaces informed by model behavior and resource limits.
6. Tune only on training and validation folds; never use the final test window for iterative selection.
7. Use early stopping or multi-fidelity evaluation when partial results predict poor candidates reliably.
8. Evaluate promising configurations across multiple forecast origins and, for stochastic models, multiple seeds.
9. Report metrics by horizon and important entity/regime slices in addition to aggregate metrics.
10. Run ablations for new features, architectural components, losses, and preprocessing changes.
11. Track runtime, memory, training stability, inference latency, and artifact size alongside accuracy.
12. Reject gains smaller than realistic evaluation variance unless operational value is still demonstrated.
13. Select the simplest configuration that robustly satisfies release criteria.
14. Re-run the chosen configuration once on the untouched test period without further tuning.
15. Persist configuration, code/data versions, seeds, splits, and artifacts for reproduction.

## Decision points
- Prefer targeted search when diagnostics identify sensitive parameters; use broader Bayesian/random search only when interactions are genuinely uncertain.
- Use multiple seeds when optimization stochasticity is material.
- Prefer ablations over feature-importance claims when validating whether a component truly adds value.
- Stop increasing complexity when gains do not survive multiple temporal folds.

## Common failure patterns
- Tuning repeatedly on the final test period.
- Comparing configurations evaluated on different temporal splits.
- Reporting only the best seed or best fold.
- Bundling many changes so improvement cannot be attributed.
- Optimizing aggregate accuracy while critical horizons regress.
- Ignoring inference and retraining costs.

## Verification
Verify that all candidate comparisons use the same temporal protocol, experiment metadata can reproduce the selected run, ablation conclusions survive multiple folds, and the final test is used once as a release check.

## Expected output
A reproducible experiment record containing hypotheses, search strategy, temporal results, ablations, resource costs, selected configuration, and release rationale.

## Stop conditions
Stop if temporal validation is invalid, the final test has been repeatedly tuned against, required run metadata is missing, or compute cost exceeds the approved experimentation budget without evidence of likely value.
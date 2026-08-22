# Decision Analysis

## Purpose
Turn a concrete decision question into a reproducible, appropriately bounded analysis that distinguishes observed facts, assumptions, uncertainty, and recommended next action.

## When to use
Use for product, operational, customer, financial, quality, experiment, or planning questions where available data can inform a decision but should not be treated as self-explanatory truth.

## Inputs
Decision question and owner, stakeholders, success or risk metric, data sources, metric definitions, population and time window, known data-quality issues, privacy/access constraints, expected confidence, and deadline.

## Procedure
1. Restate the decision, available choices, decision owner, required evidence, and what result would change the decision.
2. Define the population, cohort, unit of analysis, period, inclusion/exclusion rules, metrics, comparison baseline, and material confounders.
3. Inspect source lineage, refresh time, joins, missingness, duplicates, schema changes, sampling, instrumentation changes, and access restrictions.
4. Build a reproducible extraction or analysis plan that minimizes data access and keeps sensitive fields out of working outputs.
5. Calculate the agreed measures, segment only where the segment is meaningful and sufficiently supported, and compare results with the baseline or counterfactual available.
6. Challenge surprising results with sanity checks, alternative cuts, data-quality checks, and domain review; separate correlation from causal claims.
7. State uncertainty, biases, incomplete coverage, sensitivity to assumptions, and evidence that would overturn the conclusion.
8. Recommend the smallest reversible next action, measurement update, experiment, or escalation that follows from the evidence.
9. Preserve definitions, query or method version, data snapshot/time, reviewers, and approval required for any consequential action.

## Decision points
Escalate when the question needs causal proof but only observational data exists, data access exceeds authorization, metric definitions conflict, a sensitive population may be affected, or the result will drive an irreversible, financial, legal, or customer-impacting decision. Prefer a small experiment or additional measurement to false precision.

## Verification
Independently reproduce key figures, reconcile totals with a known source, review outliers and missing data, confirm metric definitions with the owner, verify privacy handling, and have a domain reviewer test whether the conclusion follows from the stated evidence.

## Expected output
A decision record containing the question, data sources and lineage, definitions, method, results, uncertainty, limitations, recommendation, alternatives considered, reproducibility details, and any required approvals.

## Stop conditions
Stop when the decision, metric definition, data authorization, population, or quality limitations cannot be established. Do not make causal, population-wide, or high-stakes recommendations from incomplete or unvalidated data.

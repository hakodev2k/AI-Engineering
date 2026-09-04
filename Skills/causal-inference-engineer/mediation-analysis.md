# Mediation Analysis

## Purpose
Decompose treatment effects into pathways through mediators while making cross-world and sequential ignorability assumptions explicit.

## When to use
Use when stakeholders need to understand mechanisms, not only whether a treatment works.

## Inputs
- Treatment, mediator, outcome
- Pre-treatment confounders
- Mediator-outcome confounders
- Time ordering and domain model

## Context to inspect
Inspect treatment-induced mediator-outcome confounding, multiple mediators, feedback, measurement timing, and whether mediator interventions are well defined.

## Core knowledge
Natural direct and indirect effects require strong assumptions and can be hard to interpret when treatment changes mediator-outcome confounders. Interventional direct/indirect effects may be more defensible.

## Procedure
1. Define the scientific mechanism question and causal estimand.
2. Draw treatment, mediator, outcome, and confounder relations.
3. Verify mediator is measured after treatment and before outcome.
4. Identify treatment-induced mediator-outcome confounders.
5. Choose natural or interventional mediation estimands deliberately.
6. Fit treatment, mediator, and outcome components appropriate to the estimator.
7. Use g-computation, weighting, or doubly robust mediation methods as justified.
8. Quantify direct, indirect, and total effects with uncertainty.
9. Run sensitivity analysis for mediator-outcome confounding.
10. Test alternate mediator definitions and time windows.
11. Avoid mechanistic claims stronger than the assumptions allow.

## Decision points
Prefer interventional mediation estimands when natural effects require unrealistic cross-world assumptions or mediator intervention is not uniquely defined.

## Common failure patterns
- Treating ordinary regression coefficient changes as mediation proof
- Ignoring post-treatment mediator-outcome confounders
- Wrong mediator/outcome timing
- Overclaiming biological or behavioral mechanism
- No sensitivity analysis

## Verification
Verify temporal order, estimand definition, confounder handling, decomposition consistency, and sensitivity to mediator-outcome confounding.

## Expected output
A pathway-specific effect analysis with assumptions, uncertainty, sensitivity results, and bounded interpretation.

## Stop conditions
Stop when mediator timing is ambiguous, mediator intervention is incoherent, or required identification assumptions are plainly untenable.
# Skill: Technology Evaluation

## Purpose
Select or reject a technology based on workload, constraints, lifecycle, evidence, and total operational impact.

## Inputs
Use case, requirements/NFRs, team/platform constraints, alternatives, existing estate, budget guardrails.

## Procedure
1. Define decision criteria and weights before comparing products.
2. Separate mandatory gates from preferences.
3. Gather primary-source capability evidence where available.
4. Validate operational model: deployment, scaling, backup/recovery, upgrades, observability, security, support, and failure behavior.
5. Estimate integration and migration effort plus lock-in/reversibility.
6. For performance/cost claims, define a representative benchmark or cost model; do not extrapolate from marketing numbers.
7. Run a time-boxed proof of concept only for unresolved high-impact questions.
8. Score alternatives, record confidence and evidence gaps.
9. Produce recommendation, rejected alternatives, risks, exit strategy, and ADR.

## Stop conditions
Missing mandatory requirement, unverifiable critical capability, unacceptable lock-in without approval, or risk/cost outside delegated boundaries.
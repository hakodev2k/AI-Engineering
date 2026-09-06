# Fairness and Distributional Impact Research

## Purpose
Investigate whether an AI-enabled experience produces materially different quality, burden, access, or risk across user groups and contexts.

## When to use
Use when system outcomes affect opportunities, resources, safety, productivity, representation, or access, or when aggregate quality may hide subgroup harms.

## Inputs
Use case, affected populations, outcome metrics, model evaluations, workflow, historical context, complaints, and applicable policy constraints.

## Context to inspect
Inspect training or evaluation limitations at a high level, product segmentation, language and geography coverage, task distribution, error costs, fallback processes, and human decision points.

## Core knowledge
Fairness is context-dependent and cannot be reduced to one metric. Distributional research examines who receives benefits, who bears errors or extra work, and whether fallback or contestability mechanisms are equally usable.

## Procedure
1. Define the decision or outcome whose distribution matters.
2. Identify groups and contexts with plausible differential effects using domain evidence.
3. Select outcome, error, burden, and access measures relevant to the use case.
4. Ensure subgroup analysis has adequate data and respects privacy constraints.
5. Compare performance and interaction burden across groups and contexts.
6. Investigate mechanisms behind observed differences using qualitative evidence.
7. Examine fallback, verification, and appeal burden, not only primary output quality.
8. Test intersectional or contextual effects when evidence and sample size permit.
9. Distinguish statistical differences from meaningful harm.
10. Recommend mitigations at model, interaction, workflow, or policy layers.

## Decision points
Use quantitative comparison for measurable disparities; qualitative research for mechanisms and lived impact; targeted evaluation when rare but consequential harms matter.

## Common failure patterns
Choosing protected attributes without a use-case rationale, small-sample overclaiming, treating parity as universal fairness, ignoring burden and access, and publishing sensitive subgroup results without privacy review.

## Verification
Confirm metrics correspond to real consequences, subgroup definitions are defensible, uncertainty is reported, and mitigations are evaluated for unintended redistribution of harm.

## Expected output
A distributional impact assessment with affected groups or contexts, evidence, mechanisms, uncertainty, severity, and mitigation options.

## Stop conditions
Stop when sensitive data use lacks authorization, subgroup sample sizes make reporting unsafe or misleading, or high-impact findings require specialist legal or ethics review before proceeding.
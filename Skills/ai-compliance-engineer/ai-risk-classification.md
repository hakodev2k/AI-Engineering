# AI Risk Classification

## Purpose
Classify AI systems according to operational, legal, safety, privacy, security, and societal risk so governance effort is proportionate to potential harm.

## When to use
Use at intake, before launch, after material change, when entering new jurisdictions, or when a system begins making higher-impact decisions.

## Inputs
Use-case description, decision impact, users, data types, autonomy, model capabilities, external actions, deployment geography, prior incidents, applicable policy.

## Preconditions
The system inventory entry and intended use are sufficiently defined.

## Context to inspect
Risk taxonomy, legal applicability matrix, product requirements, human oversight, security boundaries, data flows, evaluation results, vendor documentation.

## Core knowledge
Risk is contextual. The same model may be low risk for summarization and high risk when used for eligibility, employment, healthcare, safety-critical control, or autonomous financial action. Classification should consider severity, likelihood, exposure, detectability, reversibility, and affected populations.

## Procedure
1. Define the intended and reasonably foreseeable uses.
2. Identify decisions or actions the AI influences.
3. Identify affected persons and vulnerable groups.
4. Evaluate data sensitivity and confidentiality.
5. Evaluate autonomy, authority, and reversibility.
6. Assess model uncertainty and failure consequences.
7. Apply the organization’s risk taxonomy.
8. Map legal or sector-specific risk categories.
9. Record mitigating controls separately from inherent risk.
10. Assign residual risk, owner, and reassessment triggers.

## Decision points
Use inherent risk to determine required governance depth; use residual risk to determine launch acceptance. Escalate borderline cases rather than lowering classification to reduce process burden.

## Common failure patterns
Classifying based only on model type, allowing controls to hide high inherent risk, ignoring foreseeable misuse, and never reassessing after scope expansion.

## Verification
Confirm the classification rationale is traceable to evidence and independently review high-risk cases.

## Expected output
A documented inherent/residual risk classification with rationale, controls, owner, approval path, and reassessment triggers.

## Stop conditions
Escalate when high-impact decisions, vulnerable populations, prohibited practices, or unclear legal categories are involved.
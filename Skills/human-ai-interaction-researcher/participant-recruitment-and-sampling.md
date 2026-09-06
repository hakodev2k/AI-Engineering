# Participant Recruitment and Sampling

## Purpose
Recruit participants whose characteristics and contexts allow findings to generalize to the product decision without silently excluding important user groups.

## When to use
Use for interviews, usability studies, experiments, diary studies, field research, and longitudinal evaluations.

## Inputs
Target population, research questions, inclusion and exclusion criteria, user segments, risk profile, sample constraints, study design, and recruitment channels.

## Context to inspect
Review product analytics, customer segments, accessibility needs, geography, language, domain expertise, AI familiarity, account tenure, usage frequency, and known population skews.

## Core knowledge
Sampling quality depends on the inference target. Convenience samples are useful for some formative questions but weak for population claims. AI familiarity can strongly affect prompting, expectations, trust, and performance. High-stakes systems may require deliberate sampling of edge cases and vulnerable populations rather than average users alone.

## Procedure
1. Define the population to which findings are intended to apply.
2. Identify characteristics likely to affect interaction with the AI.
3. Translate these into explicit inclusion, exclusion, and quota criteria.
4. Separate essential criteria from nice-to-have segmentation.
5. Determine sample strategy based on method and intended inference.
6. Include relevant variation in expertise, AI familiarity, language, accessibility, and context.
7. Add targeted sampling for consequential edge cases where needed.
8. Design a screener that does not reveal desired answers.
9. Choose recruitment channels and identify channel bias.
10. Track recruitment composition against quotas.
11. Document deviations and their effect on interpretation.
12. Protect participant privacy and minimize unnecessary collection of sensitive data.

## Decision points
Use purposive sampling for formative depth and rare roles; stratified or probability-oriented approaches when estimating distributions; oversample critical minorities when risk warrants it, while reporting weighting and interpretation appropriately.

## Common failure patterns
Recruiting only AI enthusiasts, using job title as a proxy for expertise, excluding accessibility needs, leaking study intent in screeners, claiming representativeness from convenience samples, and collecting sensitive attributes without a clear need.

## Verification
Compare recruited composition to the intended inference population and document gaps. Confirm every screener item has a research or safety rationale.

## Expected output
A recruitment specification containing population definition, criteria, quotas, screener logic, channel plan, privacy considerations, and interpretation limitations.

## Stop conditions
Stop when recruitment would require prohibited sensitive targeting, the available sample cannot represent a decision-critical segment, or consent and privacy requirements are unresolved.
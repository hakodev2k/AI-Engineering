# Content Integrity Rules

## Purpose
Protect users from manipulative, deceptive, harmful, or policy-violating content while preserving legitimate expression and avoiding overbroad enforcement.

## Scope
Applies to content classification, distribution controls, labeling, demotion, removal, media provenance, and integrity interventions.

## MUST
- Content-integrity controls MUST define the policy basis, targeted harm, applicable surfaces, and enforcement consequence.
- Systems MUST distinguish content properties from actor behavior when the policy treats them differently.
- Distribution restrictions MUST be measurable and auditable, including the affected ranking or recommendation surfaces.
- Media-manipulation or provenance signals MUST document confidence and failure modes before they support high-impact action.
- Context-sensitive decisions MUST preserve relevant context such as quotation, criticism, newsworthiness, satire, or educational use when policy requires it.
- Material changes to integrity controls MUST be evaluated for both harmful-content reduction and legitimate-content impact.

## MUST NOT
- MUST NOT remove or suppress content merely because it is controversial, unpopular, or critical when no applicable policy violation exists.
- MUST NOT represent uncertain provenance as confirmed fabrication.
- MUST NOT use distribution controls as an undocumented substitute for formal enforcement.
- MUST NOT apply hidden content penalties without reason tracking and reviewability.

## SHOULD
- Reversible interventions such as labels or friction SHOULD be considered when they control risk without requiring removal.
- Integrity systems SHOULD incorporate recurrence, coordinated distribution, and manipulation signals where policy permits.
- Evaluation SHOULD include adversarially edited and context-shifted examples.

## Exceptions
Emergency restrictions MAY be applied during fast-moving severe incidents when delay creates credible harm. They MUST be narrowly scoped, monitored, time-bounded, and reviewed by an authorized owner.

## Verification
Review policy mappings, distribution configurations, classifier evaluations, provenance evidence, reason codes, sampled decisions, and impact metrics. Confirm contextual exceptions are represented in tests and hidden penalties are traceable.
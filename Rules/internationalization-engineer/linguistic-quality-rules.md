# Linguistic Quality Rules

## Purpose
Establish evidence-based linguistic quality controls for localized product experiences.

## Scope
Applies to terminology, grammar, tone, consistency, contextual accuracy, regulated text, and linguistic acceptance criteria.

## MUST
- Each supported locale MUST have defined quality expectations appropriate to the product risk and audience.
- Product terminology with domain significance MUST have an approved source definition and locale-specific guidance where ambiguity exists.
- Linguistic review MUST evaluate meaning in product context rather than isolated string correctness alone.
- Critical legal, safety, privacy, financial, or security text MUST receive the level of qualified review required by product policy before release.
- Material translation defects MUST be classified by user impact and tracked to verified resolution.

## MUST NOT
- Machine translation quality scores alone MUST NOT be treated as sufficient evidence for high-risk content approval.
- Reviewers MUST NOT approve translations they cannot evaluate with the required language or domain competence.
- Terminology changes MUST NOT be propagated blindly where context changes the appropriate translation.

## SHOULD
- Linguistic QA SHOULD sample complete user journeys, not only catalog entries.
- Style guides, glossaries, and known-error examples SHOULD be maintained as versioned review inputs.

## Exceptions
Exceptions require affected content, risk assessment, temporary mitigation, accountable approver, and a review deadline.

## Verification
Use qualified linguistic review, in-context screenshots/builds, terminology checks, defect sampling, high-risk content sign-off, and regression verification after corrections.
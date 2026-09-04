# Translation Resource Rules

## Purpose
Protect translation resources as versioned product contracts rather than incidental UI text.

## Scope
Applies to message catalogs, resource bundles, translation keys, extraction pipelines, and translation delivery.

## MUST
- Translation keys MUST have stable ownership and MUST remain uniquely identifiable across supported locales.
- Source messages MUST provide translators enough context to preserve product meaning, variables, tone, and constraints.
- Resource changes MUST be version-controlled and reviewed with the code or content behavior they affect.
- Required locales MUST be checked for missing, obsolete, malformed, and duplicate resources before release.
- Variable placeholders and structural markup MUST be validated consistently across locales.

## MUST NOT
- Runtime code MUST NOT concatenate independently translated fragments when word order or grammar can vary.
- Translation keys MUST NOT be repurposed for a materially different meaning without migration review.
- Generated or machine-translated content MUST NOT be promoted as approved human-quality translation where policy requires linguistic review.

## SHOULD
- Keys SHOULD describe semantic intent rather than screen position.
- Translation memory and terminology references SHOULD be reused where they improve consistency without preserving known errors.

## Exceptions
Exceptions require an identified owner, affected locales, user impact, temporary fallback, review date, and verification plan.

## Verification
Run catalog completeness checks, placeholder validation, duplicate/obsolete-key analysis, pseudo-localization, translator-context review, and release diff inspection.
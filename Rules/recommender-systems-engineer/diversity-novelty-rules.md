# Diversity and Novelty Rules

## Purpose
Prevent over-concentration and repetitive recommendation behavior while preserving relevance.

## Scope
Applies to slate construction, source mixing, category balance, creator exposure, novelty, and repetition controls.

## MUST
- Diversity constraints MUST define the dimension being diversified and the acceptable relevance trade-off.
- Repetition controls MUST consider recent user exposure history where available.
- Changes to diversity or novelty logic MUST be evaluated for both user utility and distributional effects on items or creators.
- Slate-level constraints MUST be deterministic for equivalent inputs unless randomness is explicitly designed and measurable.
- Hard policy exclusions MUST take precedence over diversity targets.

## MUST NOT
- MUST NOT add random items solely to inflate diversity metrics without evidence of user value.
- MUST NOT hide material relevance regressions behind aggregate diversity improvements.
- MUST NOT allow diversity logic to reintroduce ineligible candidates.

## SHOULD
- Diversity SHOULD be measured across multiple relevant dimensions when a single category label is insufficient.
- Novelty SHOULD be personalized when user tolerance differs materially.

## Exceptions
Exceptions require documented objective, expected duration, evidence, and review when exposure fairness or safety is affected.

## Verification
Review slate algorithms, exposure-history use, experiment results, segment metrics, and policy-ordering tests.
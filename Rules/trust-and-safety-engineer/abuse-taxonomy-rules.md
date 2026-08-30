# Abuse Taxonomy Rules

## Purpose
Define a stable, reviewable taxonomy for harmful, abusive, deceptive, or policy-violating behavior so detection, enforcement, analytics, and incident response use the same concepts.

## Scope
Applies to abuse classes, severity levels, actor types, victim impact, enforcement reasons, and taxonomy changes.

## MUST
- Every abuse class MUST have a documented definition, inclusion criteria, exclusion criteria, severity level, and representative examples.
- Taxonomy entries MUST separate observed behavior from inferred intent when intent cannot be established reliably.
- Severity MUST reflect likely harm, scale, reversibility, and urgency rather than implementation convenience.
- Detection labels, enforcement reason codes, and reporting metrics MUST map to versioned taxonomy identifiers.
- Taxonomy changes that alter enforcement meaning MUST include migration guidance for historical data and downstream systems.
- Ambiguous categories MUST define escalation or secondary-review criteria.

## MUST NOT
- MUST NOT create overlapping categories whose boundaries cannot be explained to reviewers.
- MUST NOT silently redefine an existing category in a way that changes historical interpretation.
- MUST NOT encode protected traits, political viewpoints, or other sensitive attributes as abuse by themselves.
- MUST NOT treat model confidence as proof that an abuse category applies.

## SHOULD
- Taxonomies SHOULD distinguish actor behavior, content properties, distribution mechanics, and impact.
- Categories SHOULD be granular enough to support targeted controls but stable enough for longitudinal analysis.
- Rare but severe abuse SHOULD remain explicitly represented even when volume is low.

## Exceptions
Temporary incident-specific categories MAY be introduced when an emerging threat does not fit the current taxonomy. The exception MUST document scope, expiration or review date, owner, and mapping plan.

## Verification
Review taxonomy documentation, reason-code mappings, detector labels, analytics schemas, and change history. Sample historical and recent cases to confirm consistent classification and confirm that changed definitions are versioned rather than overwritten.
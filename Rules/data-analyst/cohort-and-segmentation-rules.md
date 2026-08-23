# Cohort and Segmentation Rules

## Purpose
Ensure comparisons across cohorts and segments are meaningful and stable.

## Scope
Retention, funnel, lifecycle, geography, customer, product, and behavioral segmentation.

## MUST
- Define cohort entry, eligibility, segment membership, and observation windows explicitly.
- Ensure segments are mutually exclusive when the analysis requires partitioning.
- Account for changing population composition when comparing groups over time.
- Report small-sample instability where material.

## MUST NOT
- MUST NOT compare segments with materially different eligibility rules as equivalent.
- MUST NOT create post-hoc segments solely to amplify a preferred result without disclosure.

## SHOULD
- Prefer stable, interpretable segmentation rules over excessively granular slicing.

## Exceptions
Exploratory segmentation may be broad, but confirmatory use requires predefined and reproducible definitions.

## Verification
Inspect cohort SQL, membership counts, overlap tests, sample sizes, and longitudinal consistency.
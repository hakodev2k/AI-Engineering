# Data Quality Rules

## Purpose
Prevent decisions based on incomplete, invalid, stale, or inconsistent data.

## Scope
Source extracts, transformed datasets, analytical tables, and report inputs.

## MUST
- Validate completeness, validity, uniqueness, consistency, and freshness for fields material to the analysis.
- Quantify missingness and unexpected record loss.
- Investigate material changes in row counts, distributions, and key dimensions.
- Record known quality limitations in the output.

## MUST NOT
- MUST NOT silently drop invalid or missing records when doing so can bias conclusions.
- MUST NOT treat successful query execution as evidence of data quality.

## SHOULD
- Automate recurring quality checks for production analytics.

## Exceptions
Exploratory analysis may tolerate known defects if their impact is bounded and disclosed.

## Verification
Inspect quality checks, reconciliation counts, null rates, distributions, freshness timestamps, and exception documentation.
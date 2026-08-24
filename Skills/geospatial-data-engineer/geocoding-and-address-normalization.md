# Geocoding and Address Normalization

## Purpose
Normalize address data and design geocoding workflows with measurable match quality, provenance, and uncertainty handling.

## When to use
Use when converting postal addresses or place descriptions into coordinates, enriching records, or reconciling location identities.

## Inputs
Raw addresses, locale rules, reference datasets or provider contracts, accuracy requirements, privacy constraints.

## Context to inspect
Inspect country/region coverage, language, address components, provider limits, confidence fields, duplicate addresses, and legal usage restrictions.

## Core knowledge
Geocoding is probabilistic and locale-sensitive. A coordinate without match type, source, and confidence is incomplete evidence.

## Procedure
1. Preserve raw input unchanged.
2. Parse and normalize components without discarding uncertain information.
3. Apply locale-specific canonicalization.
4. Deduplicate exact and safely normalized inputs before external calls.
5. Geocode using the approved reference source.
6. Store match type, confidence, provider/source, timestamp, and normalized form.
7. Define thresholds for automatic acceptance, review, and rejection.
8. Validate samples across geographies and address classes.
9. Cache results according to provider terms and freshness requirements.
10. Monitor match-rate and drift over time.

## Decision points
Prefer authoritative local reference data when address precision matters. Use provider confidence only as one signal; calibrate thresholds against labeled samples.

## Common failure patterns
Accepting rooftop and locality matches equally, overwriting raw addresses, ignoring apartment/unit semantics, violating provider caching terms, and treating zero results as bad input without investigation.

## Verification
Measure precision, recall or acceptance accuracy on labeled samples, match-type distribution, unresolved rate, and coordinate plausibility.

## Expected output
Normalized addresses and geocodes with provenance, confidence, and review status.

## Stop conditions
Stop when privacy or licensing constraints prohibit processing, regional coverage is inadequate, or acceptable error thresholds are undefined.
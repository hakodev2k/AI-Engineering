# Audio Data Curation

## Purpose
Build representative, auditable speech datasets that support training, evaluation, and production diagnosis without hidden leakage or demographic blind spots.

## When to use
Use when collecting, importing, filtering, labeling, splitting, or refreshing speech data.

## Inputs
- Raw audio and metadata
- Label schema
- Consent and licensing constraints
- Production traffic characteristics
- Existing train/dev/test splits

## Context to inspect
Inspect source provenance, codec, sample rate, channel layout, speaker identity, language, accent, environment, device, transcript quality, duplication, and label confidence.

## Core knowledge
Speech systems are highly sensitive to acoustic and domain mismatch. Speaker overlap across splits can produce misleading results. Duplicate or near-duplicate clips, transcript normalization inconsistencies, and missing metadata can invalidate evaluation.

## Procedure
1. Inventory sources and legal usage rights.
2. Profile duration, SNR, silence, clipping, codec, language, and speaker coverage.
3. Define canonical metadata and label schemas.
4. Detect exact and near duplicates.
5. Validate transcript/annotation quality through sampling and automated checks.
6. Split by speaker/session/source to prevent leakage where appropriate.
7. Preserve challenging and rare conditions rather than over-cleaning them away.
8. Version dataset manifests and transformation logic.
9. Document exclusions and known blind spots.
10. Compare curated distributions with expected production traffic.

## Decision points
Prefer speaker-disjoint splits for speaker-sensitive tasks. Retain noisy samples when noise is representative. Separate benchmark-cleaning rules from production-data rules.

## Common failure patterns
- Random clip-level splitting that leaks speakers
- Removing hard examples and inflating metrics
- Losing provenance during preprocessing
- Mixing incompatible transcript normalization conventions
- Ignoring licensing or consent limits

## Verification
Verify dataset hashes/manifests, leakage checks, coverage reports, annotation audits, and reproducible split generation.

## Expected output
Versioned train/dev/test manifests, coverage statistics, data-quality findings, provenance notes, and documented limitations.

## Stop conditions
Stop if provenance is unknown, usage rights are unclear, sensitive data handling is undefined, or leakage cannot be ruled out.
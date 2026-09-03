# Dataset Release Validation

## Purpose
Apply a final evidence-based release gate before a curated dataset is allowed to train, fine-tune, evaluate, or serve an AI system. This skill distinguishes a pipeline that finished from a dataset that is safe, reproducible, policy-compliant, and fit for its intended use.

## When to use
Use before publishing any new dataset version, after material source or policy changes, after major cleaning/filtering revisions, before expensive training runs, and when promoting a candidate corpus from experimental to production status.

## Inputs
- Candidate dataset and immutable manifest
- Dataset requirements and acceptance thresholds
- Source provenance and rights metadata
- Privacy and safety scan results
- Deduplication and contamination reports
- Train/validation/test split manifest
- Quality and distribution statistics
- Previous approved release when available
- Downstream loader or preprocessing contract

## Context to inspect
Inspect all upstream transformation versions, rejected and quarantined counts, source-level changes, mixture weights, schema changes, annotation-quality evidence, privacy findings, benchmark exclusions, reproducibility metadata, access restrictions, and downstream model or pipeline compatibility.

## Core knowledge
Release validation should use predetermined blocking and warning thresholds rather than changing criteria after results are observed. High-level counts alone cannot detect source collapse, leakage, privacy violations, or semantic drift. A release candidate must be validated both against its explicit specification and against meaningful changes from previous approved versions.

## Procedure
1. Freeze the candidate dataset and generate final checksums before review.
2. Verify manifest completeness, schema validity, shard readability, record counts, and required metadata.
3. Confirm that every source has valid provenance, usage rights, and applicable retention constraints.
4. Confirm privacy, sensitive-data, and safety controls completed with no unresolved blocking findings.
5. Review deduplication rates and unresolved near-duplicate clusters.
6. Re-run benchmark-contamination and cross-split leakage checks against the frozen candidate.
7. Compare source, language, domain, class, quality, length, modality, and difficulty distributions with the dataset specification and previous approved release.
8. Review annotation quality and adjudication evidence where human labels are present.
9. Audit stratified accepted, rejected, and high-risk samples.
10. Execute downstream loaders, tokenizers, media decoders, or preprocessing on representative and edge-case records.
11. Perform a reproducibility check from governed source inputs to a representative portion of the release.
12. Classify every validation result as pass, warning with accepted risk, or blocking failure according to predeclared thresholds.
13. Record approvals, residual risks, release notes, and rollback or supersession relationships.
14. Publish only after all blocking gates pass; otherwise reject the candidate and create a new version after remediation.

## Decision points
Block the release for unresolved rights, privacy, contamination, split leakage, schema corruption, or reproducibility failures. Treat bounded distribution changes as warnings only when they are understood, intentional, and approved. Require pilot model evaluation when a data-mixture change is large enough that static dataset metrics cannot establish behavioral safety.

## Common failure patterns
- Treating successful pipeline completion as release approval
- Quietly changing thresholds so a candidate passes
- Comparing only total record count with the previous release
- Ignoring source-level or language-level collapse hidden by aggregate metrics
- Publishing before contamination or privacy scans finish
- Allowing unresolved warnings to disappear from release metadata
- Overwriting an approved release instead of creating a new version
- Testing only the data files and not the actual downstream reader

## Verification
Implemented means every required gate executes against the frozen candidate and produces auditable evidence. Verified means all blocking checks pass, warnings have explicit risk owners or approvals, downstream compatibility succeeds, sampled records support the reported statistics, and the exact released artifacts match the reviewed checksums.

## Expected output
An approved or rejected dataset-release record containing immutable artifact identifiers, validation results, distribution comparisons, policy evidence, residual risks, downstream compatibility results, approvers, and rollback/supersession metadata.

## Stop conditions
Stop and reject or escalate when any blocking gate fails, required evidence is missing, approvals are unavailable for material residual risk, the frozen artifacts change during review, or downstream compatibility cannot be demonstrated safely.
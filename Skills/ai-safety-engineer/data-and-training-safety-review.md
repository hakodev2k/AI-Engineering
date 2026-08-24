# Data and Training Safety Review

## Purpose
Identify safety, privacy, provenance, and poisoning risks in datasets used for training, fine-tuning, retrieval, or evaluation.

## When to use
Use before ingesting new datasets or materially changing data pipelines.

## Inputs
Dataset sources, licenses/provenance, schemas, collection methods, transformations, access controls, intended use.

## Context to inspect
Sensitive fields, consent constraints, contamination, malicious content, representativeness, deduplication, lineage, and retention.

## Core knowledge
Data can introduce harmful behavior, leakage, bias, benchmark contamination, and poisoning. Provenance and lineage are essential for remediation.

## Procedure
1. Establish source provenance and permitted uses.
2. Classify sensitive and high-risk content.
3. Sample and profile quality and distribution.
4. Check duplication, contamination, and evaluation leakage.
5. Assess poisoning and untrusted-source risk.
6. Define filtering, quarantine, and review controls.
7. Preserve lineage through transformations.
8. Restrict access and retention appropriately.
9. Validate downstream safety impact with targeted evals.

## Decision points
Exclude data when provenance or rights are insufficient; quarantine suspicious sources until independently validated.

## Common failure patterns
Unknown provenance; irreversible preprocessing; train/eval leakage; assuming public means safe to use; losing deletion lineage.

## Verification
Trace sampled records from source through transformation and demonstrate safety filters and access controls.

## Expected output
A data safety assessment with provenance, risks, controls, lineage, and acceptance decision.

## Stop conditions
Stop ingestion for unresolved legal/privacy constraints, credible poisoning, or missing provenance on critical data.
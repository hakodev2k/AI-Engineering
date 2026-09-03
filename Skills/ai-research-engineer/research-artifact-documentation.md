# Research Artifact Documentation

## Purpose
Document AI research artifacts so experiments can be audited, reproduced, compared, and reused without relying on the original author’s memory. This includes configurations, checkpoints, datasets, evaluation outputs, plots, and interpretation.

## When to use
Use for experiments that influence a research conclusion, shared baseline, publication, model release, production handoff, or future continuation by another researcher.

## Inputs
- Experiment runs
- Code revision
- Configurations
- Dataset and checkpoint identifiers
- Metrics and raw predictions
- Plots and analysis
- Known limitations

## Preconditions
All important artifacts must have stable identifiers or version references. Sensitive or restricted artifacts must remain in approved storage rather than being copied into documentation.

## Context to inspect
Inspect experiment tracker records, logs, object storage, dataset manifests, model cards, environment metadata, evaluation scripts, issue notes, notebook analyses, and prior research summaries. Identify orphaned artifacts or ambiguous “latest” references.

## Core knowledge
Good research documentation captures enough provenance to reconstruct a result and enough interpretation to understand why it matters. Raw metrics without configuration are not reproducible; prose without raw outputs is not auditable. Senior documentation distinguishes observation, inference, hypothesis, and decision.

## Procedure
1. Assign a stable run or experiment identifier.
2. Record research question and hypothesis.
3. Record code revision and environment specification.
4. Store the complete resolved configuration rather than only overrides.
5. Record immutable data and initialization artifact identifiers.
6. Record hardware topology and training/inference budget when relevant.
7. Preserve raw logs, metrics, predictions, and evaluation outputs.
8. Generate plots from versioned analysis code rather than manual spreadsheet edits where feasible.
9. Record failed or terminated runs when they affect interpretation.
10. Document deviations from the planned experiment.
11. Separate measured results from interpretation and speculation.
12. Record known limitations, confounders, and unresolved anomalies.
13. Link follow-up experiments and superseding results.
14. Mark obsolete artifacts rather than deleting evidence needed for audit.
15. Test all documented commands and references used for reproduction.

## Decision points
- Store large binary artifacts in appropriate artifact storage and reference them by immutable ID.
- Preserve raw predictions for high-value evaluations even when aggregate metrics are stored elsewhere.
- Create a concise summary for navigation but retain detailed provenance underneath.
- Restrict sensitive dataset details while keeping enough metadata for authorized reproduction.

## Common failure patterns
- Referencing “the latest checkpoint.”
- Saving only plots and not raw measurements.
- Recording command-line overrides without resolved defaults.
- Omitting failed runs that affected model selection.
- Mixing speculative explanations with observed facts.
- Storing secrets in configuration snapshots.
- Leaving artifact links that depend on an individual researcher’s local filesystem.

## Verification
Documentation is implemented when all required metadata and artifacts are referenced. It is verified when another authorized researcher can locate the code, configuration, data revision, checkpoint, raw evaluation outputs, and rerun instructions without undocumented assistance, and can distinguish evidence from interpretation.

## Expected output
A durable experiment record with hypothesis, provenance, resolved configuration, artifact identifiers, results, raw evidence, analysis references, limitations, deviations, and reproduction instructions.

## Stop conditions
Stop and escalate when critical artifacts cannot be uniquely identified, documentation would expose restricted data or credentials, required results exist only in ephemeral storage, or missing provenance prevents a trustworthy reconstruction.
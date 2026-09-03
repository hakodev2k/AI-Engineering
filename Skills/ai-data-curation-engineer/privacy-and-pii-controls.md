# Privacy and PII Controls

## Purpose
Detect, minimize, transform, and govern personal or sensitive information in AI datasets while preserving legitimate modeling value.

## When to use
Use for data sourced from users, logs, documents, web corpora, support systems, communications, or any source that can contain identifiers or sensitive attributes.

## Inputs
Dataset, provenance, privacy policy, jurisdictional requirements, retention rules, risk taxonomy, and approved detection/redaction tooling.

## Context to inspect
Inspect collection purpose, consent or lawful basis, access model, data residency, downstream training and evaluation use, deletion requirements, and model memorization risk.

## Core knowledge
PII detection is probabilistic and context-dependent. Data minimization is stronger than post-hoc redaction. Hashing is not anonymization when values are linkable. Rare combinations can re-identify individuals even after direct identifiers are removed.

## Procedure
1. Classify data sensitivity and intended use.
2. Identify direct and quasi-identifiers by modality.
3. Apply deterministic detectors for structured identifiers.
4. Add contextual detection for free text or multimodal content.
5. Define redact, tokenize, aggregate, quarantine, or reject actions.
6. Preserve only metadata required for lineage and compliance.
7. Test false-negative and false-positive rates on reviewed samples.
8. Restrict access to raw sensitive data.
9. Validate deletion propagation through derived datasets.
10. Document residual re-identification and memorization risk.

## Decision points
Prefer exclusion when sensitive content adds little model value. Use tokenization when relational structure matters and approved controls exist. Aggregate when individual granularity is unnecessary. Escalate rather than inventing anonymization guarantees.

## Common failure patterns
- Treating hashed identifiers as anonymous
- Redacting names but retaining unique context
- Running detectors only on text fields
- Losing deletion lineage
- Logging sensitive raw examples during debugging

## Verification
Implemented means controls execute on the pipeline. Verified means sampled audits meet detection targets, access boundaries are enforced, deletions propagate, and retained data matches documented purpose.

## Expected output
A privacy-reviewed dataset, detection metrics, transformation log, residual-risk assessment, and deletion test evidence.

## Stop conditions
Stop when lawful use is unclear, required consent is absent, deletion cannot be honored, or residual risk exceeds approved thresholds.
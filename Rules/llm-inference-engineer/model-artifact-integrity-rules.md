# Model Artifact Integrity Rules

## Purpose
Ensure that model weights, tokenizer assets, configuration, adapters, and runtime metadata used for inference are authentic, compatible, reproducible, and traceable.

## Scope
Applies to model registries, artifact storage, deployment packaging, tokenizer files, quantized weights, adapters, prompt templates, and runtime configuration that can affect inference behavior.

## MUST
- Every production model artifact MUST have an immutable version identifier and cryptographic integrity check.
- Weight files, tokenizer assets, generation defaults, chat templates, adapter versions, and runtime compatibility metadata MUST be versioned together or linked by an immutable manifest.
- Deployment automation MUST verify artifact integrity before loading a model.
- Artifact provenance MUST identify the approved source, transformation steps, and responsible pipeline or reviewer.
- Quantized or converted artifacts MUST be traceable to the exact source model and conversion parameters.
- Compatibility checks MUST validate runtime, architecture, tokenizer, and tensor-shape expectations before production rollout.

## MUST NOT
- MUST NOT deploy mutable model aliases without resolving and recording the immutable artifact version.
- MUST NOT copy unverified model weights from ad hoc locations into production.
- MUST NOT silently substitute tokenizer, template, or adapter versions.
- MUST NOT claim two artifacts are behaviorally equivalent without validation evidence.

## SHOULD
- Artifact manifests SHOULD include licenses, safety constraints, expected precision, context limits, and known runtime requirements.
- Production systems SHOULD support deterministic rollback to a previously verified artifact set.

## Exceptions
Emergency artifact use requires documented source, integrity verification, explicit risk acceptance, rollback readiness, and human approval before production execution.

## Verification
Inspect artifact manifests, checksums, registry metadata, conversion logs, deployment records, and compatibility tests. Reproduce the resolved production artifact set from immutable identifiers.
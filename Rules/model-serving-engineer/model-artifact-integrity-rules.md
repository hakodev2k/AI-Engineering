# Model Artifact Integrity Rules

## Purpose
Ensure only verified, reproducible model artifacts reach serving environments.

## Scope
Applies to model weights, tokenizer files, adapters, runtime manifests, quantization artifacts, and associated metadata.

## MUST
- Verify artifact provenance, version, checksum, and compatibility before deployment.
- Pin serving deployments to immutable artifact identifiers.
- Record model lineage sufficient to reproduce the deployed artifact.
- Validate tokenizer, config, and weight compatibility before traffic is admitted.

## MUST NOT
- Serve mutable "latest" references in production.
- Accept unverified artifacts from ad hoc locations.
- Replace model files in-place on live replicas.

## SHOULD
- Sign or otherwise attest release artifacts.
- Keep model metadata machine-readable for automated validation.

## Exceptions
Exceptions require documented provenance, risk, compensating controls, rollback procedure, and explicit approval for production use.

## Verification
Inspect artifact manifests, checksums, registry metadata, deployment configuration, CI validation logs, and reproducibility evidence.
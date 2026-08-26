# Model Artifact and Runtime Compatibility

## Purpose
Ensure model weights, tokenizer, configuration, quantization, kernels, and serving runtime form a reproducible compatible unit.

## When to use
Use during model onboarding, runtime upgrades, quantization changes, artifact migrations, or unexplained correctness differences.

## Inputs
Artifact manifests, model/tokenizer versions, runtime/container digest, kernel/library versions, hardware, expected outputs.

## Context to inspect
Model registry, config files, shard indexes, tokenizer assets, chat templates, quantization metadata, runtime flags, CUDA/driver stack, and conversion scripts.

## Core knowledge
A model is more than weights. Tokenizer and templates alter inputs; runtime defaults alter generation; quantization requires matching kernels; driver/library combinations constrain execution. Immutable provenance is necessary for rollback and debugging.

## Procedure
1. Assign immutable identifiers to every artifact. 2. Validate checksums and shard completeness. 3. Record tokenizer/config/template versions. 4. Record runtime image and hardware/driver compatibility. 5. Validate quantization/kernel support. 6. Run deterministic smoke vectors where possible. 7. Compare logits/tokens or task outputs against a trusted baseline within expected tolerance. 8. Run long-context and special-token cases. 9. Store compatibility metadata. 10. Block deployment on incompatible combinations.

## Decision points
Prefer conversion at build/release time over implicit conversion during production startup. Pin exact runtime images for reproducibility.

## Common failure patterns
Mutable model names, tokenizer drift, missing chat template, silent kernel fallback, partial shards, and runtime defaults changing between versions.

## Verification
Reproduce the same smoke/evaluation outputs from the recorded artifact/runtime manifest on supported hardware.

## Expected output
A compatibility manifest, validation evidence, and deployable immutable model-serving unit.

## Stop conditions
Stop when provenance is incomplete, checksums fail, or output differences cannot be explained within accepted tolerance.
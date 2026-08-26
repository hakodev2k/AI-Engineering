# Model Release Handoff

## Purpose
Transfer a trained checkpoint from the training organization to evaluation, inference, safety, and release owners with complete technical lineage.

## When to use
Use when promoting a milestone/final checkpoint beyond the training environment.

## Inputs
Checkpoint, tokenizer, architecture config, training recipe, data manifest IDs, evaluations, known issues, licenses/policies, serving requirements.

## Context to inspect
Checkpoint integrity, conversion scripts, tokenizer/config compatibility, inference kernels, precision conversion, evaluation gates, model-card inputs, and rollback artifact.

## Core knowledge
A checkpoint is not a release package. Serving can change numerical behavior through quantization, kernels, templates, or tokenizer versions. Release owners need enough lineage to reproduce and diagnose the model.

## Procedure
1. Freeze the selected checkpoint and calculate checksums.
2. Attach exact tokenizer, config, template and special-token artifacts.
3. Record code, data, optimizer and training-run lineage.
4. Provide evaluation results with harness versions and known regressions.
5. Convert to serving format through versioned tooling.
6. Compare serving-format outputs/metrics with training-format reference.
7. Document precision, context and hardware assumptions.
8. Supply safety limitations and unresolved issues.
9. Preserve a rollback checkpoint and conversion path.
10. Obtain explicit acceptance from downstream owners.

## Decision points
Do not quantize merely to meet a packaging target; validate quality and serving gains. Keep training-native artifacts when conversion may need to be repeated. Block release when critical lineage or evaluation evidence is absent.

## Common failure patterns
Tokenizer mismatch; unversioned conversion script; undocumented chat template; serving evaluation differs from training evaluation; deleting native checkpoint too early.

## Verification
Checksums match, downstream environment loads the package, reference prompts/evaluations reproduce within tolerance, and all lineage identifiers resolve.

## Expected output
A release-ready model package with immutable artifacts, lineage, evaluation evidence, compatibility notes, and rollback path.

## Stop conditions
Stop handoff on checksum mismatch, conversion regression, missing safety gate, unresolved license/policy block, or inability to reproduce serving behavior.
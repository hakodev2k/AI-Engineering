# Reproducibility and Versioning Rules

## Purpose
Ensure synthetic datasets and their validation results can be reproduced, compared, and audited across generator changes.

## Scope
Applies to code, models, dependencies, prompts, templates, schemas, random seeds, simulator state, configuration, validation logic, and released dataset artifacts.

## MUST
- Version every material artifact that can change generated output or acceptance results.
- Capture random seeds or equivalent randomness controls when deterministic reproduction is technically possible.
- Pin or record model, runtime, dependency, and schema versions used for release generation.
- Treat generator, prompt, schema, and post-processing changes as versioned changes requiring impact evaluation.
- Preserve released artifacts or immutable hashes sufficient to verify that a dataset has not changed silently.
- Record intentional sources of nondeterminism and quantify their expected variation where material.

## MUST NOT
- Overwrite a released dataset or generator configuration while retaining the same version identifier.
- Claim reproducibility when key external models, prompts, services, or parameters are unknown.
- Compare generator versions using different evaluation logic without disclosing the change.
- Depend on unpinned mutable external assets for a production release without recording their resolved versions.

## SHOULD
- Automate environment capture and dataset manifests.
- Use semantic or otherwise documented versioning rules that communicate compatibility and material behavioral changes.
- Re-run representative acceptance tests after dependency or infrastructure changes that could alter outputs.

## Exceptions
When exact reproduction is impossible, document the nondeterministic components, acceptable tolerance, retained evidence, and alternative method used to validate equivalence.

## Verification
Re-run a representative generation job from recorded artifacts, compare hashes or approved statistical tolerances, inspect version manifests, and verify that evaluation results are linked to exact generator and dataset versions.
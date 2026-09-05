# Model, Prompt, and Artifact Versioning

## Purpose
Establish reproducible version control for models, prompts, adapters, retrieval artifacts, tool schemas, and runtime configuration so releases can be traced, compared, and rolled back safely.

## When to use
Use whenever an AI behavior change depends on more than application source code.

## Inputs
Model identifiers, prompt templates, adapter/fine-tune versions, tool schemas, retrieval indexes, configuration, build metadata.

## Preconditions
Artifact stores and deployment metadata are available.

## Context to inspect
Model aliases, prompt registry, package lockfiles, index aliases, feature flags, provider configuration, environment variables, and release manifests.

## Core knowledge
AI behavior is produced by a composite artifact set. Mutable aliases such as `latest` destroy reproducibility unless the resolved immutable version is recorded. Version compatibility matters across prompts, tool schemas, context windows, and structured outputs.

## Procedure
1. Inventory every artifact that can affect runtime behavior.
2. Assign immutable identifiers or content hashes.
3. Record resolved provider model versions where available.
4. Version prompts and rendered-template dependencies.
5. Record tool schemas and routing configuration.
6. Bind retrieval/index versions to the release manifest.
7. Store dependency and runtime versions.
8. Define compatibility constraints among artifacts.
9. Make the deployed manifest queryable from telemetry.
10. Test reconstructing the release from recorded metadata.

## Decision points
Use semantic versions for human-facing compatibility and content hashes for exact identity. Avoid mutable aliases in rollback targets.

## Common failure patterns
Versioning code but not prompts, silently moving model aliases, untracked feature flags, stale indexes, and losing fine-tune or adapter identity.

## Verification
Reconstruct a production-like deployment from the manifest and confirm all artifact hashes and versions match.

## Expected output
An immutable release manifest and documented compatibility matrix.

## Stop conditions
Stop release preparation when any behavior-critical artifact cannot be uniquely identified or reproduced.
# Skill: Discover Configuration Contract

## Purpose
Identify configuration keys, consumers, environment sources, and parity expectations before an agent edits configuration-sensitive code.

## When to use
Use for new integrations, feature flags, deployment changes, missing-config incidents, environment-specific failures, or any change touching configuration access.

## Inputs
Repository, task description, environment templates/manifests, deployment files, CI configuration.

## Preconditions
Read access to relevant source and non-secret configuration metadata.

## Allowed tools
Repository search/read, build metadata, deterministic normalization scripts, non-production configuration inspection.

## Constraints
Never retrieve or print secret values merely to prove key existence.

## Process
1. Locate configuration entry points and providers.
2. Search for key reads and binding objects.
3. Identify development, CI, staging, and production templates or declarations.
4. Classify each key by type, requiredness, sensitivity, and environment scope.
5. Identify keys whose values must intentionally match across environments.
6. Normalize evidence into manifest objects.
7. Run the parity gate before edits to establish baseline state.
8. Separate facts, hypotheses, evidence, and open questions.
9. Hand the resulting contract to the remediation planner.

## Expected output
Key inventory, consumer paths, normalized manifests, baseline parity report, unknowns.

## Verification
Every required key must have at least one concrete code/deployment reference or explicit policy justification.

## Failure handling
If production metadata is inaccessible, mark impact unknown and stop before claiming parity. Transient read failures retry at most twice.

## Stop conditions
Secret access would be required, environment ownership is unknown, or evidence is insufficient to classify a critical key.

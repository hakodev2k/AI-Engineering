# Config Baseline Capture Skill

## Purpose
Create a reviewable, non-secret configuration baseline that an agent can use to detect environment drift without reading or persisting secret values.

## When to use
Before deployment, before incident remediation, when onboarding a repository to the gate, or after an explicitly approved configuration change.

## Inputs
- Target environment name
- Repository configuration files and deployment descriptors
- Non-secret environment metadata
- Approved configuration source or previous baseline
- `config/policy.yaml`

## Preconditions
- Environment identity is known.
- The operator can distinguish configuration keys from secret values.
- Secret stores remain outside the agent context.

## Allowed tools
Repository read/search, deployment-manifest read, environment-variable name listing, configuration export that supports value masking, local scripts.

## Constraints
- Do not export secret plaintext.
- Do not infer missing values from logs or historical chat.
- Preserve key hierarchy and value types where possible.
- Sensitive keys may be represented by stable placeholders such as `<managed-secret>` but not by actual values.
- Baseline changes in production require human review.

## Procedure
1. Identify all configuration sources that affect the target process: app settings, environment variables, deployment manifests, feature flags, service endpoints, auth settings, storage/messaging settings.
2. Determine precedence order so duplicate keys are resolved consistently.
3. Exclude runtime noise listed in `ignore_keys`.
4. Replace sensitive values with non-secret placeholders while preserving whether the key exists.
5. Normalize the configuration into JSON or YAML with deterministic key names.
6. Record the environment and source revision used to create the snapshot.
7. Run the drift gate against the previous approved baseline if one exists.
8. If this capture represents an intentional configuration change, require the normal approval path before accepting it as the new baseline.
9. Store the approved baseline in a controlled repository location or artifact store.

## Expected output
A baseline snapshot containing non-secret configuration shape and values plus provenance: environment, source revision, capture time, and approval reference when required.

## Verification
- No secret plaintext is present.
- Protected keys are present when expected.
- Snapshot parses successfully.
- Drift gate can consume it.
- Approval evidence exists before replacing a production baseline.

## Failure handling
If a configuration source cannot be read, mark the baseline incomplete and stop. If a source exposes secrets without masking support, do not ingest it; request a safer export mechanism. Do not widen permissions automatically.

## Stop conditions
Unknown environment, incomplete source inventory, exposed secret material, ambiguous precedence, or missing required approval.

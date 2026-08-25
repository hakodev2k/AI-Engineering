# Helm and Manifest Engineering

## Purpose
Build maintainable Kubernetes configuration with explicit defaults, validation, environment overlays, and safe rendering.
## When to use
Helm charts, reusable manifests, environment configuration, or configuration drift reduction.
## Inputs
Workload contract, environments, platform conventions, required/optional values, policies.
## Context to inspect
Charts/templates, values, Kustomize overlays, CRDs, schema validation, generated manifests, GitOps pipeline.
## Core knowledge
Templates should encode stable variation, not arbitrary programming. Rendered YAML is the deployable artifact and must be validated independently of template syntax.
## Procedure
1. Identify true configuration dimensions. 2. Keep safe defaults. 3. Add values schema/validation. 4. Centralize labels/selectors. 5. Avoid environment logic hidden in templates. 6. Render every supported environment. 7. Validate schemas/policies. 8. Diff against live/intended state. 9. Test upgrade and rollback rendering.
## Decision points
Use Helm for parameterized packaging, Kustomize for declarative overlays, or plain manifests when reuse is limited; avoid combining tools without a clear ownership boundary.
## Common failure patterns
Boolean/string type surprises, selector drift, duplicated values, templated secrets, environment conditionals everywhere, and trusting helm lint alone.
## Verification
Render, schema-validate, policy-test, server-side dry-run where available, and inspect diffs before deployment.
## Expected output
Deterministic, validated manifests with documented configuration contract.
## Stop conditions
Stop if required CRDs/APIs are unavailable or rendering would expose secrets.
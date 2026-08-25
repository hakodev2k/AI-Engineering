# Security and Secrets

## Purpose
Keep Terraform execution, configuration, state, and generated infrastructure within least-privilege security boundaries.

## When to use
Security reviews, CI design, backend design, provider authentication, or secret-handling changes.

## Inputs
IAM model, state backend, CI identities, variables, provider auth, policy requirements.

## Context to inspect
Credentials, sensitive variables/outputs, state access, logs, plan artifacts, module sources, public exposure.

## Core knowledge
Sensitive marks redact UI but do not remove values from state. Prefer short-lived workload identity, encrypted remote state, least privilege, and external secret stores.

## Procedure
1. Inventory secret paths and execution identities.
2. Remove static credentials from code and variables where possible.
3. Scope CI/provider permissions to required actions.
4. Restrict and encrypt state and plan artifacts.
5. Mark sensitive outputs and avoid logging secrets.
6. Validate network/IAM resources against policy.
7. Rotate exposed credentials and purge leaked artifacts.
8. Add automated secret and policy scanning.

## Decision points
Reference secret identifiers rather than secret material when the runtime can retrieve secrets itself.

## Common failure patterns
Secrets in tfvars, broad admin CI roles, public state, secret outputs, and assuming sensitive=true encrypts state.

## Verification
Secret scans pass, state/backend ACLs are reviewed, CI uses short-lived identity, and policy tests validate generated infrastructure.

## Expected output
Terraform workflows with controlled identities and minimized secret exposure.

## Stop conditions
Stop on confirmed credential exposure, missing authority to rotate, or security policy violations requiring approval.
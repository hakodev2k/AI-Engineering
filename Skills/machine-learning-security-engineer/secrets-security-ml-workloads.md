# Secrets Security for ML Workloads

## Purpose
Prevent credentials, tokens, signing keys, and sensitive configuration from leaking through notebooks, datasets, checkpoints, images, logs, or automation.

## When to use
Use during pipeline design, repository review, notebook onboarding, CI/CD changes, incident response, or cloud credential migration.

## Inputs
Secret inventory, repositories, notebooks, pipeline configuration, runtime identities, container definitions, logs, and secret-manager capabilities.

## Preconditions
Know who owns each credential and how it can be revoked or rotated.

## Context to inspect
Inspect source control history, notebook outputs, environment variables, mounted files, experiment tracking, model metadata, dataset samples, container layers, logs, and build artifacts.

## Core knowledge
ML experimentation creates unusual leakage paths: notebook cell output, serialized objects, experiment parameters, dataset examples, model cards, and checkpoints. Prefer workload identity and short-lived credentials over static secrets.

## Procedure
1. Inventory secret classes and consumers.
2. Replace embedded credentials with managed secret or workload-identity mechanisms.
3. Scope each secret to the minimum resource and operation.
4. Prevent secrets from entering training features, metadata, checkpoints, or experiment logs.
5. Add repository and CI secret scanning.
6. Sanitize notebook outputs before sharing or committing.
7. Prevent secrets from persisting in container build layers.
8. Restrict secret-manager access by workload identity.
9. Define rotation and revocation procedures.
10. Test compromise response for representative credentials.
11. Review telemetry for accidental secret values.

## Decision points
Use dynamic credentials whenever platform support is mature. Environment variables are transport, not a secret-management strategy; assess process/log exposure. Separate signing keys from ordinary API credentials.

## Common failure patterns
Keys in notebooks; secrets copied into experiment trackers; `.env` files committed then deleted without history remediation; secrets baked into images; shared long-lived tokens; rotation that requires manual downtime.

## Verification
Scan repositories and generated artifacts, inspect image layers and notebook outputs, verify unauthorized workloads cannot retrieve secrets, and demonstrate rotation without retaining the old credential.

## Expected output
A secret-flow inventory, remediated storage/access pattern, scanning controls, and tested rotation/revocation procedure.

## Stop conditions
Escalate immediately on suspected active credential exposure. Stop destructive history rewriting until incident/evidence requirements and repository coordination are understood.
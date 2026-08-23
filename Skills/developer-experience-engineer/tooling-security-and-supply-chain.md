# Tooling Security and Supply Chain

## Purpose
Secure developer tooling and automation without making routine engineering workflows unnecessarily difficult.

## When to use
Use when building shared tools, CI integrations, package workflows, code generators, plugins, or privileged developer automation.

## Inputs
Threat model, dependency manifests, credential flows, artifact sources, CI permissions, update channels, and security policy.

## Context to inspect
Inspect trust boundaries, executable downloads, package registries, token scopes, build provenance, plugin execution, update mechanisms, and secret exposure paths.

## Core knowledge
Developer tools often execute trusted code with broad access, making them high-value supply-chain targets. Apply least privilege, provenance, integrity verification, and secure defaults.

## Procedure
1. Threat-model the tooling lifecycle.
2. Minimize token and filesystem privileges.
3. Pin or verify external dependencies and artifacts.
4. Protect build/release provenance.
5. Isolate untrusted extensions where feasible.
6. Prevent secrets in logs, arguments, and generated files.
7. Define secure update and revocation paths.
8. Add dependency/security scanning with triage ownership.
9. Test compromised or unavailable dependency scenarios.

## Decision points
Prefer trusted registries and signed/provenance-backed artifacts where supported; avoid adding security gates whose signal is too weak to act on.

## Common failure patterns
Long-lived broad tokens, curl-to-shell without integrity controls, mutable dependencies, secret-bearing templates, and privileged CI on untrusted contributions.

## Verification
Review effective permissions, validate artifact integrity, scan dependencies, test secret redaction, and exercise revocation/rollback.

## Expected output
A threat-informed tooling design with least privilege, integrity controls, safe updates, and verified secret handling.

## Stop conditions
Escalate when required privilege cannot be constrained or artifact trust cannot be established.
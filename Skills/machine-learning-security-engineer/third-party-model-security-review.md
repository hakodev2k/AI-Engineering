# Third-Party Model Security Review

## Purpose
Evaluate externally sourced models before they enter trusted development or production environments.

## When to use
Use when adopting models, adapters, tokenizers, custom code, hosted model APIs, or vendor-provided checkpoints.

## Inputs
Source repository/vendor, license, artifact formats, hashes, model card, dependencies, remote code, data claims, evaluation results, and intended deployment.

## Preconditions
Define intended use and risk tier. Analyze untrusted artifacts in isolation.

## Context to inspect
Inspect source reputation, release history, signatures, repository code, serialization, custom loaders, dependency changes, network behavior, licensing, and required privileges.

## Core knowledge
Popularity is not provenance. Model packages may execute code, pull secondary artifacts, include vulnerable dependencies, or make unsupported data/privacy claims. Hosted APIs introduce data handling and availability dependencies distinct from local models.

## Procedure
1. Confirm authoritative source and maintainer identity where possible.
2. Pin exact artifact/version and record digest.
3. Review license and permitted use.
4. Classify serialization and remote-code execution risk.
5. Inspect custom loading/inference code and dependencies.
6. Scan artifacts and packages in an isolated environment.
7. Observe unexpected network/file/process behavior during loading.
8. Evaluate model behavior for intended security-sensitive properties.
9. For hosted APIs, review data retention, training-on-input, residency, auth, and incident terms.
10. Record provenance and approved configuration.
11. Import into controlled internal storage rather than repeatedly fetching mutable upstream references.
12. Define update/re-review triggers.

## Decision points
Reject models requiring unjustified arbitrary code execution. Prefer hosted services when operational controls are stronger and data terms are acceptable; prefer self-hosting when data/control requirements demand it.

## Common failure patterns
`trust_remote_code` enabled without review; mutable branch references; no artifact hash; assuming model card claims are security evidence; importing vendor container as privileged; overlooking tokenizer/plugin code.

## Verification
Re-fetch and verify digest, test loading in isolation, confirm expected files/network behavior, reproduce required evaluations, and verify deployment uses the approved internal artifact.

## Expected output
A documented accept/reject decision, provenance record, required controls, pinned artifact, and re-review criteria.

## Stop conditions
Stop when source authenticity cannot be established for high-risk use, licensing is unclear, artifact behavior is suspicious, or vendor data terms are unavailable.
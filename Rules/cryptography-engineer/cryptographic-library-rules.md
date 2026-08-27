# Cryptographic Library Rules

## Purpose
Control implementation risk introduced by cryptographic dependencies.

## Scope
Libraries, providers, modules, hardware interfaces, and cryptographic SDKs.

## MUST
- Use maintained, reputable implementations appropriate to the platform and compliance context.
- Pin or otherwise control dependency resolution and track security advisories.
- Validate provider configuration, supported algorithms, error handling, and upgrade compatibility.
- Maintain an inventory of cryptographic dependencies used in production.

## MUST NOT
- Copy cryptographic implementation code from unreviewed snippets or abandoned packages.
- Upgrade critical cryptographic providers without compatibility and regression testing.

## SHOULD
- Prefer high-level misuse-resistant APIs over low-level primitive interfaces.

## Exceptions
Specialized implementations require ownership, independent review, test vectors, maintenance plan, and approval.

## Verification
Dependency scanning, SBOM review, provenance checks, version policy, test vectors, and upgrade tests.
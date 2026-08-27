# Dependency and Supply Chain Rules

## Purpose
Control security, provenance, compatibility, and maintenance risk in WebAssembly toolchains and dependencies.

## Scope
Applies to source dependencies, guest libraries, host libraries, runtimes, compilers, optimizers, adapters, and generated artifacts.

## MUST
- Production dependencies MUST be version-resolved reproducibly.
- Security-relevant dependencies and runtimes MUST be covered by vulnerability monitoring.
- Dependency upgrades MUST run tests for behavior, interface compatibility, artifact size, and performance when materially affected.
- Release artifacts MUST have sufficient provenance to identify source and toolchain inputs.
- Untrusted third-party wasm modules MUST be subject to the same capability and resource controls as other untrusted code.

## MUST NOT
- A downloaded wasm artifact MUST NOT be executed with privileged capabilities solely because its source repository is trusted.
- Vulnerable dependencies MUST NOT be ignored without documented exposure analysis and remediation decision.
- Large dependency migrations with material production risk MUST NOT be executed without human approval.

## SHOULD
- Minimize dependency surface in privileged host code.
- Generate SBOM/provenance data where supported.
- Prefer maintained dependencies with clear security practices.

## Exceptions
A temporarily retained vulnerable dependency requires documented reachability, compensating controls, owner, expiry, and approval proportional to risk.

## Verification
Inspect lockfiles and provenance, run dependency/security scanners, verify artifact hashes where applicable, and review upgrade diffs plus regression evidence.
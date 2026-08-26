# WebAssembly Security Review

## Purpose
Review a Wasm system as a complete security boundary spanning guest code, binary, runtime, host imports, WASI, and deployment.

## When to use
Use before exposing untrusted modules, adding host capabilities, changing runtime versions, or releasing security-sensitive Wasm services.

## Inputs
Architecture, threat model, modules, runtime config, imports, WASI policy, resource limits, deployment controls, dependencies, and security requirements.

## Context to inspect
Inspect provenance, signatures/hashes, runtime patch level, capability surface, memory limits, host callback validation, tenant isolation, network/filesystem access, logging, and supply chain.

## Core knowledge
Wasm provides strong structured execution and memory isolation properties, but vulnerabilities can exist in guest logic, runtimes, compilers, bindings, host callbacks, or excessive capabilities. Resource exhaustion and confused-deputy risks are central.

## Procedure
1. Identify assets, attackers, and trust boundaries.
2. Inventory every guest capability and host callback.
3. Verify module provenance and dependency/toolchain integrity.
4. Review runtime security posture and patch process.
5. Validate pointer/value decoding at boundaries.
6. Enforce least privilege and resource ceilings.
7. Review tenant state separation and cache sharing.
8. Test malformed modules/inputs and denial-of-service cases.
9. Confirm audit logging without secret leakage.
10. Record findings by exploitability and operational impact.

## Decision points
Add process/container isolation when runtime-level sandboxing does not satisfy threat requirements. Reject dynamic guest capabilities that cannot be scoped or audited.

## Common failure patterns
Equating memory safety with total security; unrestricted WASI; trusted host callbacks with unsafe inputs; stale runtimes; missing CPU limits; shared state leaking across tenants.

## Verification
Retest findings, run adversarial cases, verify denied capabilities, and confirm runtime/dependency versions against policy.

## Expected output
A prioritized security assessment with evidence, mitigations, residual risks, and verification results.

## Stop conditions
Escalate immediately for suspected exploitable runtime escape, credential exposure, or production compromise; do not continue invasive testing without authorization.
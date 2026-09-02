# Edge AI Security

## Purpose
Secure edge AI devices, model artifacts, runtime interfaces, telemetry, and update paths against tampering, unauthorized access, model extraction, malicious inputs, and supply-chain compromise.

## When to use
Use during architecture review, deployment design, runtime hardening, incident response, or when adding new device interfaces, model formats, accelerators, or OTA mechanisms.

## Inputs
Threat model, device hardware, boot/update chain, runtime architecture, model artifacts, local APIs, cloud APIs, credentials, telemetry flows, and physical-access assumptions.

## Preconditions
Define trust boundaries and attacker capabilities, including whether physical access is plausible.

## Context to inspect
Secure boot, firmware signing, filesystem permissions, secrets storage, model encryption/signing, debug interfaces, local IPC, network authentication, update verification, runtime sandboxing, and dependency provenance.

## Core knowledge
Edge devices operate outside trusted datacenters and may be physically accessible. Security must assume artifact copying, storage inspection, network interception, malformed sensor/input data, and rollback attempts. Model confidentiality is distinct from model integrity; encryption alone does not prove authenticity.

## Procedure
1. Map assets, trust boundaries, entry points, and attacker capabilities.
2. Establish hardware root-of-trust and verified/secure boot where available.
3. Sign firmware, model, and configuration artifacts; verify before activation.
4. Store credentials in hardware-backed or least-exposed storage where possible.
5. Disable unnecessary debug/services in production.
6. Apply least privilege to runtime processes and local IPC.
7. Authenticate and encrypt network channels.
8. Validate model inputs, dimensions, file formats, and external metadata defensively.
9. Prevent unauthorized downgrade/rollback when security requirements demand it.
10. Track dependency and model provenance through the build pipeline.
11. Add security-relevant telemetry without leaking secrets or raw sensitive inputs.
12. Exercise key-compromise, corrupted-update, and stolen-device scenarios.

## Decision points
Use model encryption when confidentiality risk justifies key-management complexity; always prioritize integrity/authenticity for executable or decision-driving artifacts. Prefer hardware-backed keys when devices support them.

## Common failure patterns
Secrets in filesystem/config, unsigned models, production debug ports, trusting local network boundaries, insecure rollback, shared fleet credentials, and logging tokens or raw sensitive data.

## Verification
Perform threat-model review, artifact-tamper tests, update signature failure tests, credential exposure checks, dependency scanning, and penetration testing appropriate to product risk.

## Expected output
A hardened edge AI security posture with explicit trust boundaries, integrity controls, credential lifecycle, and verified attack mitigations.

## Stop conditions
Stop and escalate when required signing/key infrastructure is unavailable, critical debug access cannot be disabled, or security changes affect safety/compliance approval.
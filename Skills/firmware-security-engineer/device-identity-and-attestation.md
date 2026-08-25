# Device Identity and Attestation

## Purpose
Build trustworthy device identity and attestation so remote systems can authenticate a specific device and, when required, reason about its measured software/security state.

## When to use
Use for fleet enrollment, mutual authentication, zero-trust device access, counterfeit resistance, compliance evidence, or remote integrity decisions.

## Inputs
Hardware identity capabilities, PKI, boot measurements, device lifecycle, verifier requirements, privacy constraints, connectivity, and threat model.

## Preconditions
Separate identity claims from integrity claims. Define exactly what a verifier may conclude from each attested measurement.

## Context to inspect
Key provisioning, certificate issuance, measurement registers/logs, nonce/challenge flow, attestation format, freshness, verifier policy, revocation, ownership transfer, and privacy exposure.

## Core knowledge
An attestation signature proves possession of an attestation key and binds claims; it does not automatically prove the claims represent a secure configuration. Fresh challenges prevent replay. Measurements require a reference-value/policy lifecycle. Stable identifiers can create privacy risks.

## Procedure
1. Define relying parties and required claims.
2. Establish device-unique identity rooted in protected key material.
3. Define enrollment and certificate issuance with manufacturing provenance.
4. Identify boot/runtime measurements that are trustworthy and decision-relevant.
5. Bind measurements, device class, lifecycle state, and verifier nonce into signed evidence.
6. Validate evidence against approved reference values and revocation state server-side.
7. Design policy for unknown/new firmware during staged rollout.
8. Minimize unnecessary stable identifiers and sensitive telemetry.
9. Support key/certificate rotation and ownership transfer.
10. Test replay, cloned credentials, stale measurements, revoked identities, malformed evidence, and clock-independent freshness where clocks are unreliable.

## Decision points
Use simple mutual TLS identity when software-state evidence is unnecessary. Add measured attestation only when a verifier can maintain meaningful reference policy. Privacy-preserving or rotating identifiers may be required for consumer devices.

## Common failure patterns
Shared device certificates; attestation without nonce freshness; verifier trusting any signed measurement; no policy for firmware updates; identity key exportable from normal firmware; certificate rotation impossible offline; leaking serials to unnecessary parties.

## Verification
Demonstrate unique enrollment, successful authorized authentication, rejection of replay/cloned/revoked evidence, correct policy across firmware versions, and recovery after certificate rotation. Validate evidence parsing with malformed inputs.

## Expected output
Identity/attestation architecture, enrollment and verifier logic, policy lifecycle, test evidence, and privacy/security assumptions.

## Stop conditions
Escalate when identity roots cannot be protected, verifier semantics are undefined, reference measurements cannot be maintained, or attestation would create unacceptable tracking/privacy exposure.
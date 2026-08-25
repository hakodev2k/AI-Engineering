# Post-Quantum Transition Planning

## Purpose
Prepare cryptographic systems for migration to standardized post-quantum mechanisms without premature custom deployment.

## When to use
Use for long-lived confidential data, long-lived signatures/trust roots, crypto inventory programs, protocol roadmaps, and vendor/platform planning.

## Inputs
Crypto inventory, confidentiality/signature lifetimes, threat model, standards constraints, platform/vendor support, performance budgets, and interoperability dependencies.

## Context to inspect
Public-key use, certificates, key agreement, signatures, protocol negotiation, hardware/KMS support, message-size constraints, firmware/update paths, and stored artifacts.

## Core knowledge
Quantum risk differs by primitive and security property. Migration should follow mature standardized algorithms and ecosystem profiles. “Harvest now, decrypt later” makes long-lived confidentiality a priority. Hybrid transitions add complexity and require protocol-defined composition.

## Procedure
1. Inventory public-key algorithms and where they protect long-lived assets.
2. Rank systems by data/signature lifetime and migration difficulty.
3. Identify authoritative standards and ecosystem profiles applicable to each use.
4. Evaluate library, KMS/HSM, certificate, protocol, and hardware support.
5. Measure key, signature/ciphertext size and performance impacts.
6. Add format/version agility before algorithm rollout.
7. Use hybrid mechanisms only where standardized for the protocol and justified.
8. Pilot interoperability and operational workflows.
9. Plan staged rollout, rollback boundaries, and legacy retirement.
10. Reassess as standards and implementations mature.

## Decision points
Prioritize systems with long confidentiality horizons or hard-to-update devices. Do not deploy experimental primitives merely to claim quantum readiness.

## Common failure patterns
No crypto inventory; custom hybrid composition; ignoring certificate/message size; assuming symmetric crypto needs identical migration; waiting until legacy formats cannot evolve; vendor lock-in without export/migration plan.

## Verification
Demonstrate mixed-version interoperability, performance/capacity, certificate or protocol compatibility, downgrade resistance, and recovery/rotation procedures.

## Expected output
A risk-ranked post-quantum transition roadmap with dependencies, pilots, standards basis, and retirement milestones.

## Stop conditions
Stop deployment when required standards/profile support is immature, composition is unspecified, or critical interoperability cannot be proven.
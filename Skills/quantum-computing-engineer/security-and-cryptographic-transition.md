# Security and Cryptographic Transition

## Purpose
Assess security implications of quantum computing, protect quantum-service integrations, and plan migrations where cryptographic algorithms may become vulnerable to sufficiently capable quantum computers.

## When to use
Use during architecture/security reviews, quantum-cloud integration, cryptographic inventory work, and post-quantum migration planning. Do not treat speculative future hardware as evidence of immediate compromise.

## Inputs
System architecture, cryptographic inventory, data-retention horizon, trust boundaries, provider APIs, credentials, regulatory constraints, and migration deadlines.

## Preconditions
Current cryptographic usages and protected-data lifetimes are understood well enough to prioritize risk.

## Context to inspect
Public-key algorithms, key sizes, certificate chains, firmware/signing flows, long-lived encrypted archives, HSM/KMS dependencies, provider authentication, quantum-job payload sensitivity, and dependency support for post-quantum algorithms.

## Core knowledge
Quantum risk is asymmetric: large fault-tolerant systems threaten commonly deployed public-key cryptography through algorithms such as Shor's, while symmetric cryptography is affected differently. Migration risk often comes from protocol compatibility, key/certificate lifecycle, and inventory gaps rather than algorithm replacement alone.

## Procedure
1. Inventory cryptographic algorithms and where they are used.
2. Classify protected data by confidentiality lifetime and business impact.
3. Identify harvest-now-decrypt-later exposure.
4. Track standards-supported post-quantum replacements relevant to the platform.
5. Design crypto-agility so algorithms can change without redesigning the application.
6. Plan certificate, key, protocol, and dependency migration paths.
7. Review quantum-provider credentials, least privilege, secrets storage, and data sent to external services.
8. Test interoperability and rollback before production migration.
9. Monitor dependencies for implementation vulnerabilities and standards changes.
10. Document residual risks and decision dates.

## Decision points
Prioritize long-lived sensitive data and hard-to-upgrade systems first. Use hybrid transition modes when interoperability and assurance justify the added complexity.

## Common failure patterns
Treating all cryptography as equally exposed, replacing algorithms without inventory, hard-coding one post-quantum scheme, and sending sensitive problem data to quantum services without trust review.

## Verification
Validate inventory completeness, protocol interoperability, key/certificate rotation, fallback behavior, and security controls through testing and review.

## Expected output
Risk-ranked cryptographic inventory, migration roadmap, crypto-agility requirements, provider security controls, and verification evidence.

## Stop conditions
Stop when migration would break critical interoperability without an approved transition plan or when cryptographic requirements require security/legal approval.
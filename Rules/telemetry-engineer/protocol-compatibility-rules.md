# Protocol Compatibility Rules

## Purpose
Preserve interoperability across telemetry producers, collectors, gateways, and backends.

## Scope
Wire protocols, serialization formats, compression, authentication, transport settings, and protocol-version upgrades.

## MUST
- Supported protocol versions and transport requirements MUST be explicitly defined.
- Protocol upgrades MUST be tested across every material producer-collector-backend path they affect.
- Authentication and encryption requirements MUST remain enforced during compatibility migrations.
- Unsupported fields or features MUST degrade predictably and observably.

## MUST NOT
- MUST NOT assume protocol-level compatibility implies semantic compatibility.
- MUST NOT disable transport security to work around interoperability defects without explicit security approval.
- MUST NOT deploy a breaking collector or exporter upgrade without rollback capability.

## SHOULD
- Prefer open, versioned standards where they satisfy requirements and reduce vendor coupling.

## Exceptions
Require documented incompatibility, affected paths, alternative considered, risk, verification, and approval when material.

## Verification
Run integration matrices, inspect negotiated protocol behavior, validate certificates and transport settings, and review rollback tests.
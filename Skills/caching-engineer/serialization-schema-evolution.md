# Cache Serialization and Schema Evolution

## Purpose
Keep cached representations compact, compatible, safe, and migratable across deployments.

## When to use
Use when selecting serialization, changing cached models, performing rolling deployments, or diagnosing decode failures.

## Inputs
Value schema, language/runtime clients, deployment strategy, size/latency constraints.

## Context to inspect
Inspect serializers, type metadata, compression, versioning, mixed-version deployment windows, and deserialization security settings.

## Core knowledge
Cached bytes outlive individual process versions. Rolling deployments require forward/backward compatibility or explicit namespace versioning. Serialization cost affects CPU and tail latency; unsafe polymorphic deserialization can become a security risk.

## Procedure
1. Define a cache-specific contract rather than serializing arbitrary domain objects.
2. Measure representative payload sizes and encode/decode costs.
3. Choose a deterministic supported format.
4. Add explicit schema/version metadata or versioned key namespace.
5. Define compatibility across N and N-1 deployments.
6. Treat unknown fields and missing fields deliberately.
7. Avoid unsafe runtime type activation.
8. Add compression only above evidence-based thresholds.
9. Test rolling upgrade and rollback with old cached values.
10. Instrument decode failures and payload sizes.

## Decision points
Prefer schema-aware binary formats for compact cross-language contracts; JSON may improve operability where overhead is acceptable. Namespace bumps simplify incompatible changes at cold-cache cost.

## Common failure patterns
Serializing internal object graphs; no version; deploy-time decode storm; compression of tiny values; deserializing attacker-controlled type metadata.

## Verification
Cross-version tests must read expected old/new payloads and rollback safely.

## Expected output
A versioned serialization contract with compatibility tests.

## Stop conditions
Stop if rollback compatibility cannot be established for a production rolling deployment.
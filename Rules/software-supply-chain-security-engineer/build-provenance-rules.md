# Build Provenance Rules

## Purpose
Make released software traceable to its source, build definition, dependencies, and execution environment.

## Scope
CI builds, release builds, reproducible builds, packaging, and artifact promotion.

## MUST
- Release artifacts MUST be traceable to an immutable source revision and build workflow definition.
- Build provenance MUST identify the builder, relevant inputs, artifact digest, and execution context.
- Provenance evidence MUST be generated automatically by trusted build infrastructure where practical.
- Promotion decisions MUST verify artifact identity against expected provenance.
- Changes to provenance generation or verification policy MUST receive security review.

## MUST NOT
- MUST NOT rely on manually typed version labels as sole proof of artifact origin.
- MUST NOT promote artifacts that cannot be mapped to an approved source revision.
- MUST NOT allow untrusted build steps to forge trusted provenance.

## SHOULD
- Provenance SHOULD be cryptographically bound to artifacts.
- Build systems SHOULD target recognized supply-chain assurance levels appropriate to risk.

## Exceptions
Exceptions require documented limitations, compensating evidence, owner, approval, expiry, and remediation plan.

## Verification
Inspect provenance attestations, artifact digests, source revisions, workflow definitions, builder identity, and promotion logs.
# Software Supply Chain Policy Rules

## Purpose
Use policy-as-code to enforce provenance, integrity, dependency, and artifact controls across the software delivery supply chain.

## Scope
Applies to source provenance, build attestations, dependencies, artifact repositories, signatures, SBOM-related controls, image or package admission, and promotion gates.

## MUST
- Supply-chain policy MUST define which provenance and integrity evidence is required before an artifact can enter a protected environment.
- Artifact identity used by policy MUST be immutable or content-addressable where the delivery platform supports it.
- Missing required attestations, signatures, or provenance MUST produce a non-permissive result for controls that depend on that evidence.
- Policies that restrict vulnerable, untrusted, or unsupported dependencies MUST define severity, exception, and freshness semantics explicitly.
- Promotion decisions MUST bind evidence to the exact artifact being promoted rather than to a mutable name or tag alone.
- Exception handling for blocked artifacts MUST preserve scope, expiry, approval, and audit evidence.

## MUST NOT
- A successful build MUST NOT be treated as evidence of trustworthy provenance by itself.
- Mutable tags, filenames, or repository locations MUST NOT be the sole basis for artifact identity in high-risk promotion decisions.
- Policy MUST NOT accept caller-declared provenance without validation against a trusted evidence source.
- Security evidence MUST NOT be silently ignored when parsers, scanners, or attestation verification fail.

## SHOULD
- Supply-chain policies SHOULD distinguish hard security requirements from advisory hygiene or modernization guidance.
- Evidence formats and policy inputs SHOULD be normalized behind stable contracts so tooling can evolve without rewriting control semantics.

## Exceptions
Exceptions require affected artifact identity, reason, vulnerability or provenance risk, compensating controls, owner, expiry where applicable, and accountable approval.

## Verification
Test trusted and untrusted artifacts, tampered evidence, missing attestations, mutable-tag substitution, scanner failure, and exception scope. Inspect promotion logs to confirm the policy decision is bound to the exact deployed artifact and evidence set.
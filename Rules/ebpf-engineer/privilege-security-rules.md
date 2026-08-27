# Privilege and Security

## Purpose
Minimize the security authority and attack surface introduced by eBPF components.

## Scope
Capabilities, privileged containers, bpffs, loaders, map access, program loading, signing/provenance, and control APIs.

## MUST
- Runtime privileges MUST follow least privilege and be documented.
- Access to loading, attaching, pinned maps, and control interfaces MUST be authorization-controlled.
- Build and deployment artifacts MUST have traceable provenance.
- Inputs crossing userspace/kernel or trust boundaries MUST be validated.
- Sensitive map/event data MUST be access-controlled and handled according to its classification.

## MUST NOT
- MUST NOT grant unrestricted host privilege solely to simplify deployment.
- MUST NOT expose writable control maps to untrusted principals.
- MUST NOT disable kernel security controls to make an eBPF program load.
- MUST NOT embed credentials or secrets in bytecode or source.

## SHOULD
- Separate privileged setup from long-running unprivileged processing.
- Use allowlisted program/configuration sources for enforcement workloads.

## Exceptions
Privilege expansion requires threat analysis, alternatives, scope, duration, monitoring, rollback, and explicit human approval.

## Verification
Inspect capabilities, container/security configuration, bpffs permissions, API authorization, artifact provenance, and negative-access tests.
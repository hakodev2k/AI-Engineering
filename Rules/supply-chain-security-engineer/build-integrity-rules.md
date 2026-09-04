# Build Integrity Rules

## Purpose
Protect build systems from tampering and ensure produced artifacts reflect reviewed source and declared inputs.

## Scope
Applies to CI builders, build agents, compilers, package restoration, generated code, build scripts, and artifact assembly.

## MUST
- Production builds MUST execute from reviewed source revisions in controlled automation.
- Build environments MUST use authenticated identities with least privilege and isolated credentials.
- Build inputs that affect output MUST be declared, pinned, or otherwise captured sufficiently for audit.
- Build scripts and pipeline definitions MUST be subject to code review and change control.
- Untrusted pull-request code MUST be isolated from release credentials and signing identities.

## MUST NOT
- Production artifacts MUST NOT be built from uncommitted local developer state.
- Build jobs MUST NOT expose long-lived secrets to arbitrary repository code.
- Compromised or unverifiable builders MUST NOT continue producing trusted releases.

## SHOULD
- Ephemeral builders SHOULD be preferred for high-assurance release workloads.
- Build networks SHOULD restrict outbound access to required services.

## Exceptions
Exceptions require documented rationale, affected trust boundary, compensating controls, expiration, and approval from the accountable security or release owner.

## Verification
Review pipeline definitions, runner permissions, credential scopes, build logs, network policy, source revision linkage, and artifact provenance; test that untrusted jobs cannot access release secrets.
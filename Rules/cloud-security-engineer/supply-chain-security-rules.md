# Supply Chain Security

## Purpose
Protect cloud deployments from compromised dependencies, build systems, and artifacts.

## Scope
Source dependencies, build pipelines, registries, images, IaC modules, packages, and deployment artifacts.

## MUST
- Production artifacts MUST have traceable source and build provenance appropriate to risk.
- Build and deployment identities MUST be least-privilege and isolated from unnecessary administrative access.
- Third-party modules, actions, images, and packages MUST be version-controlled or pinned according to project policy and reviewed for trust.
- Material dependency migrations with broad security impact MUST receive human approval.

## MUST NOT
- MUST NOT deploy mutable or untrusted artifacts into sensitive environments without verification.
- MUST NOT expose production credentials to untrusted build steps or pull-request code.

## SHOULD
- Prefer signed artifacts, reproducible builds, protected registries, and automated dependency scanning.

## Exceptions
Document dependency, necessity, provenance limitations, compensating controls, owner, and approval.

## Verification
Inspect provenance, signatures, lockfiles, pipeline permissions, artifact digests, registry controls, dependency scans, and deployment records.
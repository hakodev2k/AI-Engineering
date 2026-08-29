# Dependency and Container Security Rules

## Purpose
Reduce compromise risk from libraries, runtimes, system packages, images, and execution environments supporting AI workloads.

## Scope
Applies to inference servers, training jobs, agent runtimes, containers, base images, native libraries, GPU stacks, and application dependencies.

## MUST
- Production dependencies and base images MUST be version-controlled and sourced from approved registries or repositories.
- Known critical vulnerabilities MUST be assessed before release and remediated or explicitly risk-accepted.
- Containers MUST run with the minimum privileges, capabilities, filesystem access, and network access required.
- Build and runtime environments MUST separate secrets from image contents.
- Dependency changes with material security impact MUST receive review and regression testing.

## MUST NOT
- MUST NOT run AI workloads as privileged containers without documented necessity and approval.
- MUST NOT disable vulnerability checks merely to pass release gates.
- MUST NOT use unverified floating image tags for critical production deployments when immutable digests are available.

## SHOULD
- Generate SBOMs and scan both direct and transitive dependencies.
- Use minimal runtime images and sandbox untrusted execution.

## Exceptions
Exceptions require documented exposure, exploitability assessment, compensating controls, owner, expiry, and approval.

## Verification
Inspect manifests, image digests, SBOMs, vulnerability results, container security settings, network policies, filesystem permissions, and dependency-review records.
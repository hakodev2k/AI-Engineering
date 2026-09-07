# Software Supply Chain Research Rules

## Purpose
Ensure research into packages, build systems, registries, dependencies, signatures, and update channels identifies genuine trust-boundary failures without endangering downstream users.

## Scope
Applies to package ecosystems, source dependencies, build pipelines, artifact registries, signing systems, update mechanisms, dependency confusion, provenance, and third-party components.

## MUST
- Research MUST map the package, source, build, artifact, signing, distribution, and update trust boundaries relevant to the hypothesis.
- Package identity, version, source, digest, and provenance MUST be recorded for analyzed artifacts.
- Namespace or dependency-resolution tests MUST use controlled names or approved research mechanisms that cannot unintentionally execute in third-party environments.
- Build-pipeline findings MUST identify the privilege and secrets available at the affected stage.
- Signature or provenance findings MUST distinguish missing verification from cryptographic compromise.
- Third-party component findings MUST separate upstream defects from integration-specific exposure.
- Any test artifact published to a registry MUST have explicit authorization, safe content, and a cleanup or retention plan.
- Research reports MUST identify downstream exposure only when supported by dependency or deployment evidence.

## MUST NOT
- MUST NOT publish packages intended to capture credentials, execute arbitrary commands, or beacon from unknown third-party systems.
- MUST NOT tamper with real release artifacts or signing keys.
- MUST NOT infer that a vulnerable dependency is exploitable solely because it appears in a manifest.
- MUST NOT disclose private package names or internal repository metadata unnecessarily.

## SHOULD
- Correlate lockfiles, SBOMs, build logs, artifact attestations, and runtime reachability.
- Prefer private or isolated registries for resolution experiments.
- Evaluate fix propagation through caches, mirrors, lockfiles, and deployed artifacts.

## Exceptions
Experiments involving public namespaces or real distribution channels require explicit owner and legal approval, collision analysis, benign artifacts, monitoring, and immediate stop criteria.

## Verification
Review artifact hashes, provenance, dependency graphs, registry records, build logs, permissions, and downstream reachability evidence. Confirm tests could not unintentionally affect unauthorized consumers.
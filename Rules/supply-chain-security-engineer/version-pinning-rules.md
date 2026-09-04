# Version Pinning Rules

## Purpose
Make software builds and deployments predictable by preventing unintended dependency or tool changes from entering trusted artifacts.

## Scope
Applies to package dependencies, build tools, CI actions, base images, compilers, plugins, infrastructure modules, and other externally versioned build inputs.

## MUST
- Security-critical build inputs MUST resolve to explicit versions or immutable digests where the ecosystem supports them.
- Lockfiles or equivalent resolution artifacts MUST be committed and reviewed when they determine production dependency graphs.
- Automated updates MUST produce reviewable diffs and rerun required security and regression checks.
- Mutable references used in production build paths MUST have documented justification and compensating verification.

## MUST NOT
- Floating versions such as latest MUST NOT be used for trusted release inputs when they can silently change artifact content.
- Pinning MUST NOT be used as an excuse to leave unsupported or vulnerable components indefinitely unchanged.
- Update automation MUST NOT bypass release policy or provenance verification.

## SHOULD
- Digests SHOULD be preferred over mutable tags for container images and reusable CI components.
- Pinning strategy SHOULD balance reproducibility with timely security updates.

## Exceptions
Exceptions require ecosystem limitation evidence, bounded risk, monitoring, review date, and accountable approval.

## Verification
Inspect manifests, lockfiles, CI workflows, image references, build metadata, update PRs, and tests showing repeated resolution produces the expected component versions.
# Dependency and Container Rules

## Purpose
Keep ML runtime environments reproducible, supportable, and resistant to supply-chain and compatibility failures.

## Scope
Covers language packages, system libraries, CUDA/accelerator stacks, base images, containers, and model-serving dependencies.

## MUST
- Release environments MUST pin or lock material dependencies to reproducible versions.
- Container images used for release MUST be immutable by digest or equivalent identity.
- Accelerator/runtime compatibility MUST be validated for the target hardware and serving/training stack.
- Dependency updates MUST pass relevant tests, evaluation gates, and vulnerability review.
- Base images MUST have an owner and update strategy.

## MUST NOT
- Production builds MUST NOT rely on floating latest tags for critical runtime components.
- Dependency upgrades MUST NOT be bundled with unrelated model changes when separation is needed for diagnosis or rollback.
- Known critical vulnerabilities MUST NOT be ignored without documented risk acceptance and mitigation.

## SHOULD
- Runtime images SHOULD minimize unnecessary packages and privileges.
- Dependency manifests SHOULD support software bill-of-materials generation where practical.

## Exceptions
A pinning or vulnerability exception requires reason, exposure analysis, compensating controls, expiry, and approval.

## Verification
Inspect lockfiles, image digests, SBOM/scanner output, compatibility tests, base-image provenance, runtime package inventory, and upgrade PR evidence.
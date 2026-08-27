# Dependency and Runtime Rules

## Purpose
Control compatibility, supply-chain, and reproducibility risks in vision stacks.

## Scope
Frameworks, CUDA/accelerator stacks, image codecs, native libraries, model runtimes, drivers, and Python/system dependencies.

## MUST
- Production dependencies MUST be version-controlled or otherwise reproducibly resolved.
- Runtime, driver, accelerator, and model-format compatibility MUST be tested on supported deployment targets.
- High-risk dependency upgrades MUST include regression, performance, and security review.
- Unsupported or end-of-life critical dependencies MUST have a migration or explicit risk-acceptance plan.

## MUST NOT
- Development-only dependency resolution MUST NOT be assumed equivalent to production runtime behavior.
- Large dependency migrations MUST NOT be executed in production without human approval and rollback planning.

## SHOULD
- Dependency surface SHOULD be minimized, especially for native and privileged components.

## Exceptions
Temporary pins or unsupported versions require reason, risk, owner, monitoring, and removal criteria.

## Verification
Inspect lockfiles, container/runtime manifests, compatibility tests, vulnerability scans, license checks, and target-device CI.
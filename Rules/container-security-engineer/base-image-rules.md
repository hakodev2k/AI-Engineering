# Base Image Rules

## Purpose
Reduce inherited vulnerabilities and operational risk introduced by container base images.

## Scope
Applies to operating-system images, language-runtime images, distroless images, and organization-approved base layers.

## MUST
- Base images MUST come from an approved source with maintained security support.
- Base image versions or digests MUST be pinned so rebuilds are reproducible.
- Base images MUST be scanned before adoption and after material updates.
- The selected base MUST contain only the packages and runtime capabilities required by the workload.
- Base image updates affecting production MUST pass application compatibility and regression checks.

## MUST NOT
- MUST NOT use abandoned or end-of-life base images for production workloads without an approved exception.
- MUST NOT inherit package managers, shells, debugging tools, or network utilities when they are unnecessary for runtime.
- MUST NOT assume an official-looking registry namespace is sufficient evidence of trust.

## SHOULD
- Prefer minimal, well-maintained images with transparent release and vulnerability practices.
- Maintain a small approved base-image catalog to reduce patching and review complexity.

## Exceptions
Exceptions require the unavailable capability to be documented, risks assessed, compensating controls defined, and a migration or removal plan approved.

## Verification
Review image manifests, package inventories, lifecycle status, vulnerability results, registry source, and deployment digests.
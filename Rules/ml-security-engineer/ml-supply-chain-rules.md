# ML Supply Chain Rules

## Purpose
Control compromise risk across code, data, models, packages, images, and build systems used in ML delivery.

## Scope
Applies to training and inference dependencies, model sources, package registries, containers, build runners, and artifact repositories.

## MUST
- Inventory externally sourced models, libraries, containers, and build tooling used in production ML workflows.
- Pin security-sensitive dependencies and verify origin and integrity during reproducible builds.
- Scan dependencies and images for known vulnerabilities and malicious packages before release.
- Define trusted registries and promotion paths for code and model artifacts.

## MUST NOT
- Pull mutable latest tags or unpinned critical artifacts into production pipelines.
- Bypass provenance or vulnerability checks to accelerate a release without approved risk acceptance.
- Assume a popular open-source model or package is safe solely because of adoption level.

## SHOULD
- Generate SBOMs or equivalent inventories for deployable ML workloads.
- Minimize build-runner privileges and isolate untrusted build inputs.

## Exceptions
Urgent vulnerability remediation may use expedited review only when scope, rollback, evidence, and approval are documented.

## Verification
Inspect lockfiles, SBOMs, registry configuration, signatures, scan results, build logs, and promotion controls.
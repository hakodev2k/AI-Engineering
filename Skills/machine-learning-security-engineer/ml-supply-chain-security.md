# ML Supply Chain Security

## Purpose
Reduce compromise risk from ML frameworks, model hubs, datasets, containers, packages, build systems, and external artifacts.

## When to use
Use for dependency onboarding, release hardening, supplier review, framework upgrades, and security incidents involving third-party components.

## Inputs
Dependency manifests, lockfiles, container definitions, artifact sources, build pipelines, SBOMs, model/dataset provenance, and vulnerability findings.

## Preconditions
Identify supported runtimes and authoritative dependency sources.

## Context to inspect
Review package registries, model hubs, base images, build runners, plugins, native extensions, notebooks, download scripts, and credentials used by automation.

## Core knowledge
ML stacks combine Python/native packages, drivers, containers, models, and data. Traditional CVE scanning is necessary but insufficient: malicious packages, dependency confusion, unsafe model serialization, compromised build runners, and unpinned remote code are common trust failures.

## Procedure
1. Inventory software, model, data, and image dependencies.
2. Classify each source by trust and update mechanism.
3. Pin versions and immutable digests where practical.
4. Generate and retain SBOM/provenance metadata.
5. Scan known vulnerabilities and malicious-package indicators.
6. Review packages that execute install/build hooks or native code.
7. Restrict registries and prevent dependency confusion.
8. Isolate build jobs and minimize credentials.
9. Sign or attest release artifacts.
10. Verify dependencies again at deployment.
11. Define emergency replacement and rollback paths.
12. Periodically review stale and unnecessary dependencies.

## Decision points
Patch immediately when exploitability and exposure are high; otherwise test controlled upgrades. Vendor a dependency only when ownership of maintenance is explicit. Prefer trusted mirrors for controlled environments.

## Common failure patterns
Floating versions, `latest` images, executing remote model code by default, broad CI tokens, treating model files as passive data, vulnerability triage based only on severity score.

## Verification
Confirm builds are reproducible enough to identify inputs, unauthorized registries are blocked, deployed digests match approved artifacts, and high-risk findings have documented disposition.

## Expected output
An inventory with pinned sources, provenance, risk decisions, hardened build controls, and verified release dependencies.

## Stop conditions
Escalate on suspected supplier compromise, unverifiable critical artifacts, exploitable critical vulnerabilities without mitigation, or required credentials exceeding approved privilege.
# Software Supply Chain Threat Modeling

## Purpose
Identify credible compromise paths across source, build, dependency, artifact, and deployment systems so controls address material risk rather than generic checklists.

## When to use
Use when designing or reviewing a delivery pipeline, onboarding a build service, responding to ecosystem compromise, or changing trust boundaries.

## Inputs
Architecture diagrams, repositories, CI/CD configuration, dependency sources, artifact registries, identity model, deployment flow, incident history, and business criticality.

## Preconditions
Confirm system scope, owners, production boundary, and evidence sources. Do not assume the documented pipeline matches reality.

## Context to inspect
Trace code from developer workstation through source control, CI runners, package resolution, build, signing, registry, promotion, and runtime deployment. Identify humans, service identities, secrets, external providers, and mutable state.

## Core knowledge
Model assets, actors, trust boundaries, entry points, attacker capabilities, integrity and provenance guarantees. Supply-chain attacks frequently exploit trusted automation, credential theft, dependency substitution, compromised maintainers, or mutable artifacts.

## Procedure
1. Define protected assets and unacceptable outcomes.
2. Draw the end-to-end software flow.
3. Mark every trust transition and privileged identity.
4. Enumerate compromise paths for source, dependencies, build infrastructure, artifacts, and deployment.
5. Rate likelihood and impact using the organization’s risk model.
6. Map existing preventive, detective, and recovery controls.
7. Identify control gaps and single points of trust.
8. Prioritize mitigations that reduce high-consequence paths.
9. Assign owners and measurable verification criteria.
10. Re-run the model after material architecture changes.

## Decision points
Prefer controls that create independent verification over controls that merely add process. Require stronger provenance and isolation for high-impact artifacts; avoid imposing identical controls on low-risk tooling.

## Common failure patterns
Threat modeling only dependencies; ignoring CI administrators; trusting branch protection as a complete boundary; omitting recovery; rating every threat high; documenting controls that are not enforced.

## Verification
Validate the model against actual configuration and sample pipeline executions. Confirm each high-risk path has an owner, mitigation, detection method, or explicit risk acceptance.

## Expected output
A current threat model, prioritized risks, control map, and actionable remediation backlog.

## Stop conditions
Escalate when scope ownership is unclear, production trust paths cannot be inspected, critical credentials appear exposed, or remediation requires risk acceptance outside the engineer’s authority.
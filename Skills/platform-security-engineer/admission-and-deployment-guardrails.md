# Admission and Deployment Guardrails

## Purpose
Enforce platform security requirements at deployment and resource-admission boundaries so unsafe workloads and configurations cannot enter protected environments.

## When to use
Use when implementing cluster admission, deployment policy, infrastructure validation, production release controls, or secure workload standards.

## Inputs
Deployment manifests, resource schemas, policy requirements, runtime constraints, exception process, environment classification, and current workload inventory.

## Context to inspect
Inspect privileged modes, host access, capabilities, image provenance, service accounts, resource limits, network exposure, secret mounts, storage, and security-context defaults.

## Core knowledge
Admission controls are strongest when they block high-confidence dangerous states close to the runtime boundary. Guardrails must balance prevention with availability and must support scoped, expiring exceptions.

## Procedure
1. Define prohibited and required workload states.
2. Rank controls by impact and confidence.
3. Inspect existing workloads for compatibility.
4. Implement policy checks at the authoritative admission boundary.
5. Require non-root execution and privilege reduction where supported.
6. Restrict host namespaces, host paths, privileged containers, and dangerous capabilities.
7. Validate trusted image sources and provenance for sensitive environments.
8. Require resource limits and appropriate isolation controls.
9. Enforce approved service-account and secret-use patterns.
10. Roll out new controls in audit mode when necessary.
11. Create a scoped, owner-bound, expiring exception path.
12. Test bypass attempts and failure behavior.

## Decision points
Block immediately for controls with clear catastrophic impact and low false-positive risk. Stage controls when legacy workloads need managed remediation.

## Common failure patterns
Policy only in CI, broad exemptions, namespace-wide bypass labels, stale exceptions, checking image tags rather than digests, and failing open without alerts.

## Verification
Verify unsafe deployment fixtures are rejected, compliant workloads deploy successfully, exceptions are narrow and expiring, and admission decisions are logged.

## Expected output
Enforced deployment guardrails, tested policy, exception governance, and migration evidence for affected workloads.

## Stop conditions
Stop when policy cannot be enforced at an authoritative boundary, blocking would cause unquantified production impact, or a bypass grants broad uncontrolled privilege.
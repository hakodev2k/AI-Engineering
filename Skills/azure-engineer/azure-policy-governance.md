# Azure Policy Governance

## Purpose
Use Azure Policy to enforce and measure cloud guardrails without creating an unmanageable delivery bottleneck.

## When to use
Use for compliance controls, allowed configurations, mandatory diagnostics/tags, regional restrictions, and organization-wide Azure standards.

## Inputs
Control objectives, resource inventory, management-group hierarchy, exemptions, remediation ownership, and deployment pipelines.

## Context to inspect
Inspect policy definitions, initiatives, assignments, effects, exemptions, remediation tasks, managed identities, compliance results, and IaC templates.

## Core knowledge
Policy evaluates resource state; effects such as Audit, Deny, Modify, and DeployIfNotExists have different operational risk. Assignment scope and inheritance determine blast radius. Exemptions need explicit owners and expiry.

## Procedure
1. Translate each governance objective into testable resource conditions.
2. Prefer built-in definitions when semantics fit.
3. Group related controls into initiatives.
4. Start high-impact changes in Audit where feasible.
5. Evaluate false positives and legacy-resource impact.
6. Design remediation for Modify/DeployIfNotExists controls.
7. Roll out assignments progressively through management-group scopes.
8. Establish an exemption process with reason, owner, scope, and expiry.
9. Integrate policy checks into deployment workflows where useful.
10. Review compliance trends and retire obsolete policies.

## Decision points
Use Deny for controls that must prevent unsafe creation; use Audit when visibility is sufficient or remediation requires planning. Prefer policy over ad-hoc scripts for continuously enforceable resource-state rules.

## Common failure patterns
Immediate broad Deny rollout, duplicate custom definitions, permanent exemptions, policies without remediation permissions, and treating compliance percentage as proof of security.

## Verification
Deploy compliant and deliberately non-compliant test resources, validate expected effects, run remediation, and confirm exemptions behave only at intended scopes.

## Expected output
Version-controlled policy initiatives, assignments, remediation procedures, and governed exception records.

## Stop conditions
Stop when policy semantics could block critical production operations, required remediation identity permissions are unclear, or control ownership is unresolved.
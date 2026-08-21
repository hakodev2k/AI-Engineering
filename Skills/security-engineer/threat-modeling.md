# Threat Modeling

## Purpose
Systematically identify assets, trust boundaries, abuse paths, and mitigations before security defects reach production.

## When to use
Use for new systems, major features, integrations, privilege changes, and material architecture changes. Do not use it as a substitute for testing.

## Inputs
Architecture diagrams, data flows, identities, requirements, deployment topology, dependencies, and known constraints.

## Context to inspect
Inspect entry points, data stores, external services, privileged operations, authentication boundaries, network boundaries, and sensitive data flows.

## Core knowledge
Threat models are decision tools, not compliance artifacts. Use structured approaches such as STRIDE where useful, but prioritize realistic attacker goals, reachable paths, impact, and existing controls.

## Procedure
1. Define scope and security objectives.
2. Inventory assets and sensitive operations.
3. Draw data flows and trust boundaries.
4. Identify actors and attacker capabilities.
5. Enumerate abuse cases per entry point and boundary.
6. Rank threats by likelihood, exploitability, and impact.
7. Map existing preventive, detective, and recovery controls.
8. Identify control gaps and assign mitigations.
9. Record accepted risks with owners and rationale.
10. Revisit the model after architecture changes.

## Decision points
Prefer architectural controls when they remove whole threat classes. Use compensating controls when redesign cost is disproportionate and residual risk is accepted.

## Common failure patterns
Modeling only infrastructure, ignoring business abuse, treating every threat equally, assuming trusted internal traffic is safe, and producing diagrams without actionable mitigations.

## Verification
Confirm every critical asset and trust boundary has been reviewed, high risks have owners, mitigations are testable, and unresolved risks are explicitly accepted.

## Expected output
A current threat model with prioritized threats, mitigations, owners, assumptions, and residual risks.

## Stop conditions
Escalate when scope is unclear, critical architecture is unavailable, or risk acceptance requires an authorized owner.
# Cloud Threat Modeling

## Purpose
Systematically identify cloud attack paths and controls before implementation or major change.

## When to use
Use for new workloads, trust-boundary changes, internet exposure, privileged integrations, or material architecture changes. Do not use as a substitute for penetration testing.

## Inputs
Architecture diagrams, data flows, identities, network paths, assets, compliance constraints, and deployment configuration.

## Context to inspect
Inspect actual cloud resources, IaC, identity relationships, ingress/egress, data stores, secrets, CI/CD, and operational ownership; do not infer architecture from documentation alone.

## Core knowledge
Model assets, actors, entry points, trust boundaries, abuse cases, blast radius, compensating controls, and residual risk. Prioritize realistic attack chains over exhaustive checklists.

## Procedure
1. Define scope and security objectives.
2. Inventory sensitive assets and privileged identities.
3. Map data and control-plane flows.
4. Mark trust boundaries and external dependencies.
5. Enumerate abuse cases and attacker prerequisites.
6. Rank likelihood and impact.
7. Map preventive, detective, and recovery controls.
8. Identify control gaps and owners.
9. Record residual risks and assumptions.
10. Re-review after architecture changes.

## Decision points
Choose deeper modeling for high-impact or novel boundaries; use lightweight review for low-risk incremental changes. Prefer reducing privileges or exposure before adding detective controls.

## Common failure patterns
Diagram-only reviews, ignoring control plane paths, treating managed services as inherently secure, missing CI/CD identities, and accepting risks without owners.

## Verification
Confirm each material threat maps to an implemented control or explicitly accepted risk; validate representative paths against deployed configuration.

## Expected output
A prioritized threat register with attack paths, controls, evidence, residual risk, and owners.

## Stop conditions
Escalate when architecture is unknown, critical assets lack owners, required evidence is unavailable, or residual risk exceeds approved tolerance.
# Firmware Threat Modeling

## Purpose
Create an actionable threat model for firmware and its hardware interfaces that drives architecture, implementation priorities, tests, and residual-risk decisions.

## When to use
Use at product inception, major architecture changes, new interfaces, security reviews, or after incidents that invalidate assumptions.

## Inputs
System architecture, data flows, hardware block diagram, firmware components, trust boundaries, interfaces, assets, lifecycle states, deployment environment, and attacker capabilities.

## Preconditions
Include hardware, manufacturing, update, cloud/mobile dependencies, and physical access where realistic; firmware cannot be modeled as an isolated codebase.

## Context to inspect
Boot chain, privileged execution, secrets, storage, radios/networking, buses, sensors/actuators, debug/test paths, update/recovery, provisioning, logs, external services, and RMA.

## Core knowledge
Threat modeling prioritizes plausible attack paths rather than enumerating generic vulnerabilities. Trust boundaries, attacker prerequisites, exploit impact, detectability, and recoverability matter. Physical attackers may observe buses, replace flash, glitch signals, or access test pads depending on product assumptions.

## Procedure
1. Define product security objectives and unacceptable outcomes.
2. Inventory assets and security-critical state.
3. Diagram data/control flows and lifecycle transitions.
4. Mark trust boundaries and privileged components.
5. Enumerate attackers: remote, adjacent, local software, physical, supply-chain, insider as applicable.
6. Derive abuse cases for each exposed boundary and critical transition.
7. Trace multi-step paths from attacker entry to asset impact.
8. Rate likelihood/exploitability and consequence using a consistent scheme.
9. Map threats to preventive, detective, and recovery controls.
10. Convert high-priority threats into engineering requirements and negative tests.
11. Record accepted risks with owner and rationale.
12. Revisit after design changes and incidents.

## Decision points
Use STRIDE or another taxonomy as a completeness aid, not as the output itself. Quantitative scoring is useful only when inputs are defensible; otherwise use transparent ordinal prioritization with explicit assumptions.

## Common failure patterns
Ignoring manufacturing and recovery; assuming physical access is impossible without evidence; listing controls without attack paths; scoring before understanding impact; failing to assign risk owners; threat model becoming stale documentation.

## Verification
Walk representative attack paths with engineering stakeholders, ensure every critical asset and boundary is covered, link high risks to requirements/tests, and confirm accepted risks have accountable owners and review dates.

## Expected output
Threat model diagrams, prioritized attack paths, security requirements, verification hooks, assumptions, and residual-risk decisions.

## Stop conditions
Escalate when architecture/lifecycle information is unavailable, threat assumptions conflict across stakeholders, or high-impact risks require product-level acceptance.
# IoT Security Threat Modeling

## Purpose
Identify cyber-physical attack paths across devices, networks, gateways, cloud services, manufacturing, and maintenance.

## When to use
Use before launch, major architecture changes, new connectivity, or security-sensitive features.

## Inputs
Architecture, data flows, physical access assumptions, identities, update paths, assets, operational environment.

## Context to inspect
Boot chain, debug ports, radios, local storage, APIs, brokers, mobile apps, provisioning, manufacturing and support workflows.

## Core knowledge
IoT expands attack surface into physical custody and long-lived hardware. Threats include cloning, extraction, malicious firmware, radio attacks, unsafe commands, fleet-wide compromise, and supply-chain abuse.

## Procedure
1. Define assets and safety/security objectives.
2. Map trust boundaries and physical access.
3. Enumerate entry points across lifecycle stages.
4. Model attacker capabilities and fleet-scale blast radius.
5. Prioritize threats by exploitability and impact.
6. Select preventive, detective, containment, and recovery controls.
7. Assign owners and residual risk.
8. Convert critical threats into tests.

## Decision points
Prioritize controls that limit fleet-wide compromise and irreversible physical impact. Accept device-level risk only with explicit blast-radius analysis.

## Common failure patterns
Ignoring factory/support paths, trusting local networks, shared secrets, no recovery design, and cloud-only threat models.

## Verification
Trace critical threats to implemented controls and adversarial tests.

## Expected output
A prioritized IoT threat model with actionable mitigations.

## Stop conditions
Escalate safety-critical or high-impact residual risks to authorized owners.
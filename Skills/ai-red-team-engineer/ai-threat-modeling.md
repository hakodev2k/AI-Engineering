# AI Threat Modeling

## Purpose
Identify abuse, security, privacy, and safety risks in AI systems before deployment and convert them into testable controls.

## When to use
Use during architecture review, feature design, model/provider changes, new tool integrations, or major trust-boundary changes. Do not treat it as a substitute for empirical red-team testing.

## Inputs
Architecture diagrams, data flows, model/tool capabilities, user roles, deployment topology, policies, prior incidents, and business impact.

## Context to inspect
Map model boundaries, prompts, retrieval sources, tools, credentials, external APIs, human approval points, logging, storage, and privileged actions. Verify assumptions from implementation and configuration.

## Core knowledge
AI threats combine conventional application threats with prompt injection, data poisoning, model extraction, unsafe agency, excessive permissions, sensitive-data disclosure, and output-driven downstream actions. Risk depends on attacker capability, reachability, impact, and control strength.

## Procedure
1. Define assets, actors, intended capabilities, and unacceptable outcomes.
2. Draw trust boundaries and data/action flows.
3. Enumerate entry points and attacker-controlled content.
4. Identify conventional and AI-specific abuse cases.
5. Rank scenarios by likelihood, impact, exploitability, and blast radius.
6. Map preventive, detective, and recovery controls.
7. Convert high-risk scenarios into adversarial test cases.
8. Assign owners and residual-risk decisions.
9. Reassess after architecture or capability changes.

## Decision points
Prefer architectural isolation over prompt-only controls for high-impact actions. Require human approval when consequence, reversibility, or uncertainty makes autonomous execution unacceptable.

## Common failure patterns
Threat modeling only the model; ignoring tool permissions; assuming retrieved content is trusted; vague severity labels; controls with no verification; overlooking multi-turn and cross-tenant attacks.

## Verification
Confirm every high-risk scenario has an owner, measurable test, mitigation, residual-risk disposition, and evidence that controls operate at the actual trust boundary.

## Expected output
A prioritized threat model linked to concrete adversarial tests and mitigations.

## Stop conditions
Escalate when system boundaries are unknown, critical assets cannot be identified, required evidence is unavailable, or residual risk requires security/product approval.
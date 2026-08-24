# Threat Modeling AI Systems

## Purpose
Systematically identify abuse cases, failure modes, trust-boundary violations, and mitigations in AI-enabled systems before release.

## When to use
Use during architecture, major model/tool changes, external integrations, or security review. Do not treat it as a substitute for empirical testing.

## Inputs
Architecture diagrams, data flows, model/tool capabilities, actor definitions, deployment environment, existing controls.

## Preconditions
Define system scope, intended users, protected assets, and decision owners.

## Context to inspect
Model boundaries, prompts, retrieval sources, tool permissions, secrets, identity, data stores, external APIs, logging, human approvals, and deployment topology.

## Core knowledge
AI threats combine conventional application security with model-specific risks such as prompt injection, unsafe tool use, data leakage, model manipulation, and emergent behavior. Risk depends on capability, exposure, autonomy, privileges, and consequence.

## Procedure
1. Define assets and unacceptable outcomes.
2. Map actors, trust boundaries, data flows, and privileged actions.
3. Enumerate accidental failures and intentional abuse paths.
4. Trace attacker-controlled content into model context and tool calls.
5. Rate likelihood, exploitability, blast radius, and detectability.
6. Identify preventive, detective, and recovery controls.
7. Prefer capability reduction and least privilege before prompt-only controls.
8. Assign owners and residual-risk decisions.
9. Convert high-risk scenarios into adversarial tests.
10. Revisit the model after material architecture changes.

## Decision points
Use stronger isolation when compromise can cause irreversible actions. Require human approval when confidence is insufficient for high-impact operations. Accept residual risk only when bounded, observable, and explicitly owned.

## Common failure patterns
Threat modeling only the model endpoint; assuming system prompts are security boundaries; ignoring indirect prompt injection; granting broad tool permissions; omitting recovery controls.

## Verification
Confirm every high-risk scenario maps to a tested control, owner, monitoring signal, and residual-risk decision.

## Expected output
A prioritized threat model with abuse paths, controls, tests, owners, and residual risks.

## Stop conditions
Escalate when system boundaries are unknown, critical assets cannot be protected, or release requires accepting unowned high-severity risk.
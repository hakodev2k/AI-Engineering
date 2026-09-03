# Agent Threat Modeling

## Purpose
Identify trust boundaries, attacker goals, abuse paths, and security controls for tool-using AI agents before implementation or release.

## When to use
Use for new agents, major tool additions, memory changes, identity changes, external integrations, or material workflow redesigns.

## Inputs
Architecture diagram, agent prompts, tool contracts, identities, data flows, memory design, deployment topology, trust assumptions, and business impact criteria.

## Preconditions
Understand what the agent is authorized to do and which actions can create irreversible or sensitive effects.

## Context to inspect
Inspect prompt construction, model providers, tool gateways, credentials, storage, retrieval, memory, browser/network access, human approval steps, logs, and downstream systems.

## Core knowledge
Agent systems combine probabilistic reasoning with deterministic capabilities. Threat modeling must therefore cover classical threats plus prompt injection, instruction hijacking, confused-deputy behavior, excessive agency, unsafe tool composition, cross-session leakage, and model-output trust failures.

## Procedure
1. Define protected assets and high-impact actions.
2. Draw trust boundaries across user, model, tools, memory, data, and infrastructure.
3. Enumerate identities and authorization paths.
4. Identify untrusted content entering the reasoning context.
5. Enumerate abuse cases for each tool and data source.
6. Map indirect prompt-injection paths.
7. Analyze cross-tool attack chains and privilege escalation.
8. Classify threats by likelihood, impact, detectability, and reversibility.
9. Assign preventative, detective, and recovery controls.
10. Define residual risk and explicit acceptance owners.
11. Add abuse cases to security tests.
12. Re-run the model when capabilities or trust boundaries change.

## Decision points
Use stronger approval and isolation for irreversible, financial, security-sensitive, or externally visible actions. Prefer capability reduction over attempting to prompt the model into safe behavior when a privilege is unnecessary.

## Common failure patterns
Treating the model as a trusted principal; reviewing tools independently but not compositions; ignoring retrieved content as attacker-controlled; failing to model memory poisoning; relying only on system prompts for authorization.

## Verification
Verify every privileged action maps to an identity, authorization check, audit trail, abuse case, and recovery path. Confirm security tests exercise representative attack chains.

## Expected output
A prioritized threat model with trust boundaries, attack paths, required controls, owners, and testable residual-risk statements.

## Stop conditions
Stop and escalate when ownership of a critical risk is unclear, required architecture is unavailable, or the design grants unbounded privileges that cannot be constrained.
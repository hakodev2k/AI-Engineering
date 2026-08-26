# ML Threat Modeling

## Purpose
Identify security threats across an ML system before implementation or major change, connecting assets, trust boundaries, attacker goals, and mitigations to concrete engineering work.

## When to use
Use for new ML products, architecture changes, new model/data suppliers, exposed inference endpoints, or security reviews. Do not use as a substitute for penetration testing or model evaluation.

## Inputs
Architecture diagrams, data flows, model lifecycle, identities, deployment topology, external dependencies, requirements, and existing controls.

## Preconditions
Confirm system scope, business-critical assets, deployment environments, and who can approve security-risk decisions.

## Context to inspect
Inspect data ingestion, training, artifact storage, CI/CD, serving, telemetry, human review, third-party models, and administrative paths. Mark every trust boundary and privileged identity.

## Core knowledge
ML systems add attack surfaces beyond conventional applications: poisoned data, malicious model artifacts, unsafe deserialization, model extraction, adversarial inputs, supply-chain compromise, prompt/instruction attacks for generative systems, and leakage through outputs. Risk depends on attacker capability, exposure, impact, and control strength.

## Procedure
1. Define system scope and security objectives.
2. Inventory sensitive data, model artifacts, credentials, compute, and decision outputs.
3. Draw end-to-end data and control flows.
4. Identify trust boundaries and privileged operations.
5. Enumerate credible threat actors and capabilities.
6. Apply structured threat categories to each boundary and ML-specific asset.
7. Record abuse cases and prerequisite conditions.
8. Rank threats by likelihood, exploitability, blast radius, and business impact.
9. Map preventive, detective, and recovery controls.
10. Identify residual risks and control owners.
11. Convert material gaps into testable engineering requirements.
12. Re-review after architecture changes.

## Decision points
Prefer architectural elimination of high-impact threats over downstream detection. Use isolation when a component cannot be trusted. Accept residual risk only with explicit ownership and evidence that expected impact fits risk tolerance.

## Common failure patterns
Threat modeling only the API layer; treating the model as a trusted binary; ignoring training pipelines and artifact registries; assuming internal users are trusted; listing generic threats without attack paths; controls with no owner or verification method.

## Verification
Verify every sensitive asset and trust boundary has been reviewed, high-risk threats have owners and mitigations, mitigations have tests or monitoring, and residual risks are explicitly recorded.

## Expected output
A scoped threat model with attack paths, ranked risks, controls, validation evidence required, and unresolved decisions.

## Stop conditions
Escalate when scope is unknown, critical architecture is unavailable, a high-impact threat has no viable control, or accepting residual risk requires authority the agent does not have.
# Security and Threat Modeling

## Purpose
Identify security risks introduced by models, retrieval, tools, external content, integrations, and AI-specific trust boundaries before implementation hardens around unsafe assumptions.

## When to use
Use during architecture design, major feature changes, new data/tool integrations, or before production launch.

## Inputs
Architecture diagrams, data flows, identities, tool boundaries, model/provider choices, external inputs, storage, and business impact.

## Context to inspect
Inspect trust boundaries, authentication and authorization, data classification, third-party dependencies, model inputs and outputs, retrieval sources, tool actions, logging, and deployment topology.

## Core knowledge
AI systems add risks such as prompt injection, unsafe tool invocation, data leakage through context, poisoned knowledge sources, over-trusting generated content, and inadequate separation between instructions and untrusted data.

## Procedure
1. Map assets, actors, trust boundaries, and data flows.
2. Identify untrusted inputs and externally controlled content.
3. Enumerate security-relevant model behaviors and tool side effects.
4. Verify authorization outside model reasoning.
5. Define input, output, and retrieval controls.
6. Bound tool capabilities and validate parameters.
7. Review storage, logging, and provider data-handling implications.
8. Define monitoring for abuse and anomalous behavior.
9. Prioritize mitigations by likelihood and impact.
10. Validate mitigations with adversarial and integration tests.

## Decision points
Prefer deterministic enforcement for permissions and policy. Reduce system authority when a risk cannot be reliably detected. Isolate high-impact tools from low-trust inputs.

## Common failure patterns
Treating prompts as security boundaries, logging sensitive context indiscriminately, allowing retrieved text to override system intent, and assuming model refusals replace authorization.

## Verification
Threats have owners and mitigations; tests prove critical boundaries; residual risks are explicitly accepted by accountable stakeholders.

## Expected output
A threat model with assets, boundaries, abuse cases, mitigations, verification evidence, and residual risks.

## Stop conditions
Stop when critical authorization cannot be enforced outside the model, sensitive-data handling is unresolved, or unacceptable risk lacks an approved mitigation.
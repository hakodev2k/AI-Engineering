# Privacy Threat Modeling

## Purpose
Identify privacy-specific abuse paths in AI systems before they become incidents. This skill complements security threat modeling by focusing on unwanted inference, disclosure, linkage, surveillance, memorization, and secondary use.

## When to use
Use for new AI architectures, high-risk data processing, RAG systems, fine-tuning, personalization, agentic workflows, data-sharing changes, and major model upgrades.

## Inputs
- Architecture and data-flow map
- Data classifications
- User roles and trust boundaries
- Model capabilities and interfaces
- Abuse cases and policy requirements

## Context to inspect
Inspect training data flows, inference prompts, retrieval sources, logs, caches, APIs, exports, model outputs, admin tools, and third-party services.

## Core knowledge
Privacy threats include linkability, identifiability, non-repudiation, detectability, information disclosure, unawareness, policy non-compliance, model memorization, membership inference, model inversion, prompt leakage, cross-tenant retrieval, and unintended profiling. Likelihood must account for realistic attacker access and system observability.

## Procedure
1. Define assets, actors, trust boundaries, and protected privacy properties.
2. Enumerate personal and sensitive data stores and transformations.
3. Identify adversaries, curious insiders, unintended recipients, and accidental disclosure paths.
4. Analyze collection, training, inference, retrieval, logging, and export stages.
5. Consider linkage and inference attacks using auxiliary data.
6. Test whether model outputs can expose training or user data.
7. Assess tenant, session, and user isolation.
8. Rank threats by impact, exploitability, population affected, and detectability.
9. Map preventive, detective, and recovery controls.
10. Assign owners and validation criteria.
11. Reassess residual risk after proposed mitigations.

## Decision points
Use stricter controls when data is sensitive, the affected population is vulnerable, outputs drive consequential decisions, or attack detection is weak. Prefer architectural elimination of a data flow over compensating controls when feasible.

## Common failure patterns
- Treating privacy as only confidentiality
- Ignoring inference from non-sensitive attributes
- Missing insider or support-tool access
- Assuming model providers cannot retain data without checking configuration
- Failing to test cross-user or cross-tenant leakage

## Verification
Validate mitigations with adversarial tests, access-control tests, data-leakage probes, logging review, and evidence that identified high-risk paths are eliminated or bounded.

## Expected output
A prioritized privacy threat model with threat scenarios, affected assets, mitigations, residual risk, owners, and test evidence.

## Stop conditions
Escalate when a high-impact privacy threat lacks an effective mitigation, when residual risk exceeds approved tolerance, or when required provider behavior cannot be verified.
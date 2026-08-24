# Research — Guardrail Disclosure Oracle Gate

## Topic
Guardrail/refusal responses as an adaptive reconnaissance oracle.

## Category
Security

## Problem
An AI assistant can correctly refuse a risky action yet disclose security-relevant implementation details while explaining the refusal: disabled parameters, hidden routes, guardrail categories, execution assumptions, connector behavior, or historical protection changes. An adaptive attacker can repeatedly reframe questions and use each denial as feedback to map the attack surface.

## Why it matters now
Recent 2026 research moved this from a generic prompt-leak concern to an exploitable agent-security pattern. Varonis' CoSnitch investigation reported that Copilot disclosed an undocumented URL parameter and protection history during repeated refusal-oriented questioning; that information was then used in a one-click exploit chain. Separately, black-box research published in July 2026 showed that guardrail presence and blocked content categories can be inferred with high accuracy from lexical, HTTP, and timing behavior even without explicit disclosure. Together, these signals show that denial behavior itself can become a security side channel.

## Affected users
- Builders of copilots and tool-using agents with privileged connectors.
- Platform teams that expose natural-language explanations for denied actions.
- Security teams testing prompt injection, jailbreak and data-exfiltration resistance.
- Developers whose assistants know internal tool names, routes, feature flags or policy details.

## Current public evidence

### Observed evidence
1. **Varonis Threat Labs — CoSnitch, 2026-08-18.** Researchers repeatedly reframed refusal questions; Copilot disclosed an undocumented URL parameter plus historical protections, which was used to build the exploit chain. CVE-2026-24301 was patched by Microsoft on 2026-08-18. Source: https://www.varonis.com/blog/cosnitch
2. **Dark Reading, 2026-08-18.** Independent reporting describes the same meta-hacking technique as manipulating Copilot into revealing architecture/security details, and confirms Microsoft's server-side remediation. Source: https://www.darkreading.com/vulnerabilities-threats/cosnitch-attack-copilot-mapping-out-architecture
3. **Behind the Refusal: Determining Guardrail Activation via Behavioral Monitoring, 2026-07.** Black-box experiments showed guardrail presence and blocked categories can be inferred from behavioral signals, with reported 98% average F1 for distinguishing guardrail blocks from model rejection on unseen prompts. Source: https://arxiv.org/abs/2607.02121
4. **AWS Security Blog, 2026-07-08.** AWS recommends designing on the assumption that system-prompt information can leak and keeping secrets/authorization outside prompts. Source: https://aws.amazon.com/blogs/security/designing-for-the-inevitable-system-prompt-leakage-and-mitigations-in-generative-ai-applications/

## Interpretation
The problem is not merely 'the model may reveal its prompt.' A denial channel can expose a structured sequence of clues. Even a response that never prints the full system prompt can reduce attacker uncertainty about hidden parameters, policy categories, tool capabilities or execution paths. Repeated probing compounds this leakage.

## Existing approaches
- Generic refusal templates and provider safety policies.
- System-prompt secrecy instructions.
- Server-side patching of disclosed implementation weaknesses.
- Prompt-injection filters and jailbreak classifiers.
- Rate limiting and abuse monitoring.
- Least-privilege connector scopes.

## Remaining limitations
- Generic refusal policies often optimize helpfulness and may explain *why* a request failed in implementation-specific terms.
- Prompt secrecy does not cover route names, parameter names, tool metadata or historical mitigations learned from other context.
- Rate limits slow reconnaissance but do not make individual responses non-disclosing.
- Prompt-injection classifiers target malicious inputs; they do not necessarily evaluate the disclosure content of the denial itself.
- A patched vulnerability can be replaced by a new one if the assistant continues to disclose future security-sensitive deltas.

## Root-cause analysis
1. The same model is given enough operational context to reason about internal controls and to generate user-facing explanations.
2. Denials are treated as normal natural-language output rather than a security-sensitive interface with a disclosure budget.
3. Protected literals and concepts are not consistently classified before output.
4. Multi-turn probing is evaluated one message at a time, so cumulative information gain is not measured.
5. Security verification usually tests whether harmful actions are blocked, not whether blocked responses teach an attacker how to bypass the block.

## Improvement opportunity
Treat denial/refusal output as a security boundary. Introduce a deterministic disclosure gate that checks refusal responses against protected literals/concepts, enforces coarse reason codes, tracks cumulative disclosure across a probe sequence, and runs adversarial regression tests before release.

## Proposed solution
This package defines a reusable procedure and executable audit tool that:
- separates internal denial reasons from external user-facing reason codes;
- scans responses for configured protected literals and sensitive implementation patterns;
- detects repeated leakage across a multi-turn transcript;
- blocks release when a denial reveals a configured protected surface;
- requires an independent verifier for high-risk changes.

## Goal
Reduce actionable information disclosed through refusal/guardrail responses without weakening the underlying safety control or hiding ordinary user-correctable input errors.

## Metrics
- protected-literal disclosure count;
- unique protected concepts leaked per probe sequence;
- disclosure density per denied response;
- cumulative probe information count;
- false-positive rate on safe user-correctable errors;
- attack-path regression pass rate.

## Trigger
Any release/change that modifies system prompts, guardrails, tool metadata, connector behavior, denial templates, error messages or security-sensitive routing.

## Inputs
Probe transcript JSONL, protected-surface configuration, expected public reason codes.

## Outputs
Audit report, blocking/non-blocking status, matched evidence and regression result.

## Relevant sources
- https://www.varonis.com/blog/cosnitch
- https://www.darkreading.com/vulnerabilities-threats/cosnitch-attack-copilot-mapping-out-architecture
- https://arxiv.org/abs/2607.02121
- https://aws.amazon.com/blogs/security/designing-for-the-inevitable-system-prompt-leakage-and-mitigations-in-generative-ai-applications/

## Verification
**Implemented** means the gate and policy exist. **Measured** means a representative benign/adversarial transcript suite has been audited. **Verified** means protected details are absent from denied outputs, benign correction messages remain useful, and the independent verifier approves the evidence.
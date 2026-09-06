# Security Adversarial Testing

## Purpose
Test AI application security boundaries against prompt injection, data exfiltration, unsafe tool use, authorization bypass, secret exposure, and untrusted content manipulation.

## When to use
Use for AI systems that process untrusted inputs, retrieve private data, call tools, maintain memory, or act with user/service permissions.

## Inputs
Threat model, architecture, trust boundaries, tool permissions, data classifications, prompts, retrieval sources, and security requirements.

## Preconditions
Testing is authorized and destructive actions can be sandboxed or safely simulated.

## Context to inspect
Inspect system prompts, input channels, retrieval sources, tool schemas, authentication/authorization, tenant isolation, logs, memory, secrets handling, and output sinks.

## Core knowledge
Prompt injection is an application security problem, not merely a prompt-quality problem. Untrusted content must not gain authority through the model. Authorization must be enforced outside model judgment for protected actions and data.

## Procedure
1. Map trust and authorization boundaries.
2. Identify attacker-controlled input channels.
3. Test direct and indirect prompt injection.
4. Attempt cross-tenant or unauthorized data retrieval using safe test data.
5. Test secret and system-instruction extraction resistance.
6. Probe tool calls for parameter tampering and privilege escalation.
7. Test malicious content returned from tools or retrieved documents.
8. Verify output encoding and downstream execution boundaries.
9. Confirm logs do not expose sensitive prompt or data content unnecessarily.
10. Record reproducible findings and retest mitigations.

## Decision points
Enforce security controls in deterministic application layers where possible. Treat prompt defenses as defense-in-depth, not primary authorization.

## Common failure patterns
Relying on system prompts for access control, trusting retrieved text, overbroad tool credentials, logging secrets, and testing only direct jailbreaks.

## Verification
Confirm protected operations require deterministic authorization and validated attacks cannot cross intended data or permission boundaries.

## Expected output
A security test report with reproducible scenarios, severity, affected boundaries, evidence, and mitigation verification.

## Stop conditions
Stop when testing could affect real users/data, authorization scope is unclear, or a critical vulnerability requires immediate security escalation.
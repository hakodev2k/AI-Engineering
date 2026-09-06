# Release Security Review

## Purpose
Identify security regressions introduced by AI artifacts, serving changes, tool integrations, dependencies, or release configuration before production exposure.

## When to use
Use for model/provider changes, new tools, new retrieval sources, permission changes, runtime upgrades, or new deployment surfaces.

## Inputs
Threat model, architecture, dependency inventory, artifact provenance, tool permissions, secrets configuration, security test results, and candidate deployment.

## Preconditions
System boundaries and data classifications are known.

## Context to inspect
Inspect model supply chain, container/runtime dependencies, API authentication, authorization, prompt-injection exposure, tool scopes, network access, secrets, and logging.

## Core knowledge
AI systems add attack surfaces through untrusted model inputs/outputs, tool execution, retrieval, and third-party model providers. Model behavior must never be treated as a security boundary.

## Procedure
1. Identify release-specific changes to trust boundaries.
2. Verify artifact integrity and dependency provenance.
3. Review authentication and least-privilege authorization.
4. Test untrusted input paths, including prompt injection where relevant.
5. Validate tool calls through deterministic policy enforcement.
6. Check secrets handling and sensitive logging.
7. Review network egress and provider data-handling assumptions.
8. Scan changed dependencies and images for known vulnerabilities.
9. Validate abuse controls, rate limits, and auditability.
10. Record findings by severity and remediation status.

## Decision points
Block on exploitable high-severity findings. Use compensating controls only when they materially reduce risk and have explicit ownership and expiry.

## Common failure patterns
Giving the model direct privileged credentials, trusting model-generated authorization decisions, broad tool scopes, secrets in prompts/logs, and unsigned or ambiguous artifacts.

## Verification
Re-test remediated findings, verify permissions in the deployed environment, and trace a privileged action through enforcement and audit logs.

## Expected output
A release security decision with findings, evidence, residual risk, and approved exceptions.

## Stop conditions
Stop on critical unresolved vulnerabilities, unknown data handling, missing authorization boundaries, or required specialist/security approval.

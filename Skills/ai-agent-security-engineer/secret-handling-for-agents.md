# Secret Handling for Agents

## Purpose
Prevent credentials, tokens, private keys, and sensitive configuration from entering model-visible context or leaking through tools, logs, memory, or outputs.

## When to use
Use when agents authenticate to external systems, call privileged APIs, execute code, or process responses that may contain secrets.

## Inputs
Credential inventory, tool architecture, identity flows, prompt pipeline, logs, memory design, and secret-store configuration.

## Preconditions
Know which secret each workflow actually requires and whether delegated short-lived credentials can replace static secrets.

## Context to inspect
Environment variables, vault integration, tool gateway, prompt templates, traces, model-provider logging, error handling, browser/session storage, and generated artifacts.

## Core knowledge
Models should receive authority through constrained tools rather than raw credentials. Secret minimization lowers exfiltration risk from injection, logging, debugging, memory, and provider retention.

## Procedure
1. Inventory secrets reachable by the agent runtime.
2. Remove secrets not required by active workflows.
3. Move credential use behind trusted server-side tools.
4. Prefer short-lived scoped tokens or workload identity.
5. Prevent secrets from being serialized into prompts or tool responses.
6. Redact secrets from logs, traces, errors, and persisted memory.
7. Restrict secret-store access by workload identity and environment.
8. Rotate credentials and define revocation paths.
9. Test prompt-injection attempts to reveal credentials.
10. Test exception paths and debug modes for accidental leakage.
11. Scan generated artifacts and telemetry for secret patterns.
12. Document emergency rotation procedures.

## Decision points
Prefer brokered authorization when an agent needs an effect but not the credential itself. Use raw credentials only when a trusted adapter cannot perform the operation.

## Common failure patterns
API keys in system prompts, broad environment variables inherited by sandboxes, secrets returned in tool JSON, verbose stack traces, and long-lived tokens.

## Verification
Confirm the model cannot retrieve raw secrets through normal or adversarial prompts and that credentials are absent from representative logs, traces, and memory.

## Expected output
A least-exposure credential design, redaction rules, rotation plan, and leakage test evidence.

## Stop conditions
Escalate if a required integration forces a high-value long-lived credential into model-readable context.
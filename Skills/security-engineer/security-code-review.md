# Security Code Review

## Purpose
Review source code for security defects, unsafe assumptions, and control bypasses that automated scanners may miss.

## When to use
Use for high-risk changes, authentication/authorization code, input parsers, cryptographic logic, deserialization, file handling, payment or privileged workflows, and vulnerability remediation.

## Inputs
Code changes, repository context, threat model, security requirements, tests, framework conventions, relevant scanner findings.

## Context to inspect
Call sites, data flow, authorization layers, validation, error handling, dependency APIs, configuration, tests, and related historical vulnerabilities.

## Core knowledge
Security review should follow attacker-controlled data and privilege transitions. Correctness depends on context: framework defaults, encoding rules, transaction boundaries, and object ownership all matter.

## Procedure
1. Understand the business and security intent of the change.
2. Identify untrusted inputs and sensitive outputs.
3. Trace authorization decisions and ownership checks.
4. Inspect dangerous sinks such as SQL, shell, templates, filesystem, URLs, and deserializers.
5. Check cryptographic and token-handling code for misuse.
6. Review error and logging paths for sensitive disclosure.
7. Validate concurrency and race-sensitive security checks where relevant.
8. Inspect tests for negative and abuse cases.
9. Compare with framework-recommended primitives and existing secure patterns.
10. Produce findings with concrete evidence and remediation guidance.

## Decision points
Escalate custom cryptography or security protocol design to specialists. Prefer proven framework primitives over bespoke control logic.

## Common failure patterns
Reviewing only changed lines, missing transitive call paths, assuming middleware guarantees every endpoint, ignoring business logic abuse, and accepting comments as evidence of enforcement.

## Verification
Re-run tests and targeted security checks after remediation, confirm the vulnerable path is closed, and verify legitimate behavior still works.

## Expected output
A focused security review with evidence-based findings, severity rationale, remediation, and regression coverage.

## Stop conditions
Stop when critical context or dependent code is unavailable, or when validating a finding would require unauthorized access or destructive testing.
# Source-Assisted Penetration Testing

## Purpose
Use available source code and configuration to increase penetration-test depth, coverage, and confidence while still validating security impact through observable behavior.

## When to use
Use for white-box or gray-box assessments where repositories, builds, IaC, or configuration are explicitly provided.

## Inputs
Source repository, build instructions, architecture, deployed environment mapping, secrets policy, and assessment scope.

## Context to inspect
Inspect trust boundaries, authorization checks, dangerous sinks, deserialization, file/process/network operations, cryptography use, secret loading, feature flags, infrastructure definitions, and dependency configuration.

## Core knowledge
Source review can reveal unreachable or mitigated code; runtime validation remains important. Trace attacker-controlled data and identity context to security-sensitive operations rather than searching only for suspicious strings.

## Procedure
1. Map source components to in-scope deployed services.
2. Identify entry points and security enforcement layers.
3. Trace untrusted data to sensitive sinks.
4. Trace identity/authorization decisions to protected operations.
5. Review configuration and environment-dependent controls.
6. Identify candidate vulnerabilities and prerequisites.
7. Validate candidates against the running target safely.
8. Determine exploitability and realistic impact.
9. Suggest fixes at the correct abstraction boundary.
10. Note untested code paths and environment assumptions.

## Decision points
Use code evidence to reduce intrusive testing, but do not report unreachable patterns as exploitable without evidence. Prefer systemic fixes over local patches when the root cause is shared.

## Common failure patterns
Treating static warnings as findings, missing runtime configuration, exposing repository secrets in reports, reviewing out-of-scope components, and failing to map source version to deployment.

## Verification
Confirm deployed version/context, reproduce behavior when safe, and distinguish code weakness, exploitable vulnerability, and defense-in-depth issue.

## Expected output
High-confidence findings with code location/context, runtime evidence where applicable, root cause, impact, and remediation.

## Stop conditions
Stop if source access exceeds authorization, deployed-version mapping is unreliable, or validation would violate engagement constraints.
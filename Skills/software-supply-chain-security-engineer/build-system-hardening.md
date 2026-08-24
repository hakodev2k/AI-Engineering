# Build System Hardening

## Purpose
Reduce the probability that compromised build infrastructure can silently alter software or leak high-value credentials.

## When to use
Use when designing CI, reviewing runners, migrating build platforms, or after a build-system incident.

## Inputs
CI configuration, runner topology, network policy, identities, secrets, build scripts, artifact flow, and administrative permissions.

## Context to inspect
Inspect hosted and self-hosted runners, persistent state, caches, privileged containers, network egress, secret injection, reusable workflows, plugins, and administrator paths.

## Core knowledge
Build systems execute attacker-influenced code and therefore require strong isolation. Ephemeral workers, least privilege, controlled egress, immutable configuration, protected credentials, and independent artifact verification reduce blast radius.

## Procedure
1. Classify builds by trust level and secret access.
2. Separate untrusted contributions from privileged release jobs.
3. Minimize runner permissions and filesystem persistence.
4. Prefer ephemeral clean workers for sensitive builds.
5. Restrict network destinations and metadata-service access.
6. Pin and verify third-party actions, images, and tools.
7. Remove long-lived credentials; use short-lived workload identity where possible.
8. Protect caches from cross-trust poisoning.
9. Centralize security-relevant logs and administrative audit events.
10. Test compromise scenarios and recovery procedures.

## Decision points
Self-hosted runners provide control but increase operational responsibility. Privileged builds should be exceptional and isolated. Performance gains from shared caches must be weighed against poisoning and data-leakage risk.

## Common failure patterns
Running pull requests on trusted persistent runners; exposing secrets to fork builds; mutable action tags; unrestricted egress; shared Docker sockets; administrator tokens in build variables.

## Verification
Execute representative trusted and untrusted builds, confirm permission boundaries, inspect resulting credentials and network access, and verify workers are cleaned or destroyed.

## Expected output
A hardened build architecture with documented trust tiers, enforced controls, and tested recovery.

## Stop conditions
Escalate on evidence of runner compromise, unknown privileged plugins, unavoidable shared trust boundaries, or inability to rotate exposed credentials.
# Package Registry Security

## Purpose
Protect package publication and consumption from namespace confusion, account compromise, malicious replacement, and unauthorized release.

## When to use
Use when operating internal registries, publishing public packages, configuring package clients, or investigating suspicious package resolution.

## Inputs
Registry configuration, namespaces, package-manager settings, publisher identities, tokens, retention rules, and network architecture.

## Context to inspect
Trace package naming, source precedence, authentication, publishing permissions, immutability, mirrors/proxies, metadata, and deletion/yank behavior.

## Core knowledge
Package resolution can cross trust domains unexpectedly. Namespace reservation, explicit source mapping, immutable versions, strong publisher identity, and controlled promotion are primary defenses.

## Procedure
1. Inventory package sources and namespaces.
2. Identify names that exist or could appear in multiple registries.
3. Configure explicit source/namespace mapping where supported.
4. Reserve critical public and internal names as policy permits.
5. Enforce MFA or workload identity for publishers.
6. Restrict publication to release automation for critical packages.
7. Prevent version overwrite and uncontrolled deletion.
8. Validate checksums/signatures and registry TLS trust.
9. Monitor new publishers, ownership transfers, and unusual releases.
10. Test resolution from clean environments.

## Decision points
Use a proxy/mirror when centralized policy and availability justify it; ensure it does not silently broaden trust. Public publishing requires stronger account recovery and namespace governance.

## Common failure patterns
Mixed registries without source mapping; reusable publisher tokens; mutable versions; shared publisher accounts; assuming lockfiles fully prevent substitution.

## Verification
Resolve representative packages in clean CI, confirm expected registry origin, and test unauthorized publication and version replacement.

## Expected output
A deterministic package trust model with controlled publishing and monitored ownership.

## Stop conditions
Escalate on suspected namespace takeover, unexpected package origin, compromised publisher identity, or inability to make critical releases immutable.
# Encryption in Transit

## Purpose
Protect database traffic against interception, tampering, and endpoint impersonation.

## When to use
Use for new connections, TLS hardening, certificate changes, cross-network replication, or insecure transport findings.

## Inputs
Connection strings, server TLS configuration, certificate chain, client libraries, network topology, and compatibility constraints.

## Context to inspect
Inspect every path: application, admin tools, proxies, replicas, ETL, monitoring, backup agents, and internal service hops.

## Core knowledge
Encryption without certificate validation can still permit impersonation. Protocol and cipher policy must balance current security baselines with supported clients. Mutual TLS adds client identity but increases certificate lifecycle complexity.

## Procedure
1. Enumerate connection paths.
2. Determine current protocol and validation behavior.
3. Require encrypted transport where supported.
4. Enable hostname and certificate-chain validation.
5. Remove obsolete protocols and weak suites according to policy.
6. Plan certificate issuance, renewal, trust distribution, and rollover.
7. Test all client classes.
8. Monitor handshake and expiry failures.

## Decision points
Use mTLS when certificate-based client identity materially improves assurance. Terminate TLS at proxies only when downstream protection and trust boundaries are explicitly addressed.

## Common failure patterns
Trust-all client settings, expired certificates, plaintext replica traffic, untested certificate rollover, and assuming private networks remove transport risk.

## Verification
Capture negotiated protocol metadata, test invalid certificates, verify plaintext rejection, and exercise certificate rollover.

## Expected output
A validated transport-security configuration and lifecycle plan.

## Stop conditions
Escalate if required legacy clients cannot support the minimum policy or if certificate changes threaten production connectivity.
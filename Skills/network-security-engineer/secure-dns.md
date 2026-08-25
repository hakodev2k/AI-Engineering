# Secure DNS

## Purpose
Design and operate DNS with controls against spoofing, unauthorized changes, data leakage, abuse, and availability failures.

## When to use
Use for DNS architecture, resolver hardening, authoritative service changes, incident investigation, or DNS security reviews.

## Inputs
Zones, resolver topology, forwarding rules, access policy, query logs, DNSSEC requirements, availability targets.

## Context to inspect
Authoritative servers, recursive resolvers, split-horizon design, dynamic updates, registrar controls, cloud DNS, logging and egress paths.

## Core knowledge
Recursive vs authoritative roles, cache poisoning, DNSSEC, DoH/DoT trade-offs, RPZ/filtering, tunneling indicators, amplification risks.

## Procedure
1. Map DNS trust and resolution paths.
2. Separate recursive and authoritative duties.
3. Restrict recursion and dynamic updates.
4. Harden administrative access and registrar controls.
5. Apply DNSSEC where justified and operationally supportable.
6. Define filtering policy and exceptions.
7. Monitor query anomalies and availability.
8. Test failover and recovery.

## Decision points
Encrypt DNS where privacy and interception risks justify it, while preserving required enterprise controls. Use filtering based on risk tolerance and false-positive cost.

## Common failure patterns
Open resolvers, stale delegation, weak registrar security, broken DNSSEC rollover, excessive logging of sensitive queries, unmonitored bypass resolvers.

## Verification
Test resolution from each trust zone, validate recursion restrictions, DNSSEC chain where enabled, failover, and detection telemetry.

## Expected output
Hardened DNS design/configuration, monitoring plan, test evidence, recovery procedure.

## Stop conditions
Escalate registrar ownership ambiguity, DNSSEC changes without rollover plan, or changes that risk broad name-resolution outage.
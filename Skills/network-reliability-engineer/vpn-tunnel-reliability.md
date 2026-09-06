# VPN and Tunnel Reliability

## Purpose
Design and troubleshoot encrypted and overlay tunnels with predictable failover, MTU behavior, routing, and key lifecycle.

## When to use
Use for site-to-site VPNs, cloud tunnels, overlay connectivity, intermittent tunnel resets, or migration between providers.

## Inputs
Tunnel configuration, routing, crypto parameters, DPD/keepalive settings, MTU, logs, SA state, and failover design.

## Context to inspect
Inspect underlay reachability, phase negotiation, route attachment, NAT traversal, key rotation, tunnel health semantics, and active/standby behavior.

## Core knowledge
Tunnel reliability depends on both underlay and overlay. A tunnel can appear administratively up while carrying no useful traffic. Encapsulation changes MTU and may alter routing symmetry.

## Procedure
1. Separate underlay reachability from tunnel state.
2. Validate negotiated parameters and key lifetimes.
3. Inspect route selection through the tunnel.
4. Check keepalive and dead-peer detection behavior.
5. Validate MTU and MSS handling.
6. Confirm failover tunnels advertise or receive expected routes.
7. Review key rotation and certificate expiry risks.
8. Test controlled failover when safe.
9. Document recovery timing and dependencies.

## Decision points
Use route-based tunnels for scalable routing integration; use policy-based tunnels only when interoperability requires them. Prefer diverse underlays for meaningful redundancy.

## Common failure patterns
Tunnel-up/data-down states, mismatched selectors, synchronized rekeys, MTU black holes, duplicate route preference, and redundant tunnels sharing one underlay.

## Verification
Confirm bidirectional application traffic, route state, rekey success, MTU behavior, and failover recovery.

## Expected output
A verified tunnel configuration or diagnosis with explicit failure behavior.

## Stop conditions
Escalate when peer configuration is externally controlled or testing could sever the only management path.
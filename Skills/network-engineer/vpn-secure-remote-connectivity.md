# VPN and Secure Remote Connectivity

## Purpose
Design and troubleshoot site-to-site and remote-access VPNs with correct cryptography, routing, identity, and failure handling.

## When to use
Use for IPsec tunnels, remote access, cloud VPNs, certificate migration, intermittent tunnels, or routing-over-VPN issues.

## Inputs
Peer endpoints, protected networks, IKE/IPsec parameters, certificates/PSKs, identity policy, routes, NAT, logs, and packet captures.

## Context to inspect
IKE phase/state, proposals, lifetimes, selectors, NAT traversal, certificates, routing, firewall policy, MTU/MSS, DPD, HA, and authentication dependencies.

## Core knowledge
Separate control-plane negotiation from data-plane forwarding. A tunnel can be established while selectors, routing, NAT, MTU, or return path still break traffic. Prefer modern cryptographic suites and certificate-based identity where operationally mature.

## Procedure
1. Define peers, identities, traffic selectors, and expected routes.
2. Confirm basic IP reachability and UDP/IPsec path.
3. Compare IKE proposals and authentication parameters.
4. Validate certificate chain, identity, time, and revocation behavior when applicable.
5. Confirm child SA/IPsec selectors and counters.
6. Trace routing before and after encryption.
7. Check NAT exemptions/order and return path.
8. Test MTU/MSS with realistic payloads.
9. Review rekey, DPD, and HA behavior.
10. Apply the smallest change and capture before/after evidence.
11. Test failover and session recovery where required.

## Decision points
Use route-based VPNs for scalable routing and dynamic protocols when supported; policy-based tunnels can suit simple fixed selectors. Use remote-access split tunneling only after security and application-path analysis.

## Common failure patterns
Proposal mismatch, expired certificates, selector mismatch, NAT before encryption, asymmetric return path, PMTUD failure, overlapping networks, and tunnel-up/traffic-down misdiagnosis.

## Verification
Confirm SAs, encryption/decryption counters, intended routes, bidirectional application traffic, MTU behavior, rekey, and failover.

## Expected output
Validated VPN configuration/change, cryptographic and routing evidence, security rationale, and recovery notes.

## Stop conditions
Escalate when credentials/certificates are unavailable, requested cryptography violates policy, overlap requires architectural remediation, or production peer coordination is missing.
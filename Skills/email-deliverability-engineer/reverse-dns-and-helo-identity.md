# Reverse DNS and HELO Identity

## Purpose
Configure and validate sending-IP identity so reverse DNS, forward DNS, and SMTP HELO/EHLO present a stable, attributable mail system to receivers.

## When to use
Use when provisioning dedicated IPs, migrating MTAs/providers, diagnosing connection-level blocks, or reviewing infrastructure identity.

## Inputs
Sending IPs, PTR ownership, HELO/EHLO names, A/AAAA records, provider/MTA configuration, SMTP responses, and IP-pool assignments.

## Preconditions
Confirm who controls reverse DNS; cloud/ESP providers often manage PTR delegation or configuration differently from ordinary DNS.

## Context to inspect
Inspect PTR records for every sending IP, forward resolution of HELO names, MTA banner/EHLO, TLS certificate expectations where relevant, IP ownership, and mailbox-provider responses.

## Core knowledge
Receivers commonly expect a meaningful PTR and coherent HELO identity. Forward-confirmed reverse DNS is a strong hygiene pattern: IP -> PTR hostname -> address record including that IP. PTR alone does not grant sender authorization and must be paired with normal authentication and reputation controls.

## Procedure
1. Inventory every public IP that can originate SMTP delivery.
2. Query its PTR and identify the administrative owner.
3. Choose stable hostnames representing sending infrastructure rather than recipient-facing marketing domains.
4. Publish/verify forward A or AAAA records as appropriate.
5. Configure the MTA/provider to present the intended HELO/EHLO.
6. Confirm IP, PTR, forward DNS, and HELO relationships externally.
7. Test SMTP sessions and capture receiver responses.
8. Verify pool/routing changes do not introduce unconfigured IPs.
9. Add DNS/PTR checks to provisioning and migration runbooks.
10. Monitor for drift after provider or network changes.

## Decision points
Use distinct hostnames when infrastructure ownership or pools require them, but avoid needless hostname churn. Coordinate PTR changes with provider support when reverse zones are externally controlled.

## Common failure patterns
Generic or missing PTR, HELO set to localhost/internal names, PTR pointing to a hostname with no matching forward record, new IPs entering pools before DNS is ready, and using rDNS changes as a substitute for fixing poor reputation.

## Verification
From external resolvers, confirm PTR and forward resolution; open a controlled SMTP session to verify EHLO identity; check representative mailbox-provider acceptance and headers after rollout.

## Expected output
A validated identity map for each sending IP with PTR, forward DNS, HELO, ownership, and operational checks.

## Stop conditions
Stop production rollout when PTR ownership cannot be changed, HELO is inconsistent with intended infrastructure, or newly assigned IP identity cannot be externally verified.
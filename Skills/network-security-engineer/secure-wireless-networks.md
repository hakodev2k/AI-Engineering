# Secure Wireless Networks

## Purpose
Secure enterprise wireless access against unauthorized association, weak authentication, rogue infrastructure, and lateral exposure.

## When to use
Use for WLAN design, WPA migration, guest networks, rogue AP investigations, or wireless security reviews.

## Inputs
SSID inventory, authentication design, RF/site context, client capabilities, segmentation and guest requirements.

## Context to inspect
Controllers/APs, WPA settings, RADIUS, certificates, management frames, guest isolation, rogue detection, wired uplinks.

## Core knowledge
WPA2/WPA3 Enterprise, 802.1X, EAP, PMF, roaming, captive portals, evil-twin risks, RF limitations.

## Procedure
1. Inventory SSIDs and intended populations.
2. Remove obsolete or duplicate networks.
3. Select strong enterprise authentication.
4. Segment corporate, IoT, and guest traffic.
5. Protect management access and frames where supported.
6. Configure rogue detection with operational triage.
7. Test roaming and certificate behavior.
8. Monitor association and authentication anomalies.

## Decision points
Use PSK only where enterprise authentication is impractical and compensate with isolation and key lifecycle controls. Prefer WPA3 when client support is sufficient.

## Common failure patterns
Shared long-lived PSKs, guest-to-LAN reachability, weak EAP, unmanaged APs, ignored rogue alerts, insecure controller management.

## Verification
Test authorized and unauthorized clients, guest isolation, roaming, authentication failures, and management-plane restrictions.

## Expected output
WLAN security configuration, segmentation model, exception list, validation evidence.

## Stop conditions
Stop migration if critical client compatibility is untested or fallback would materially weaken security without approval.
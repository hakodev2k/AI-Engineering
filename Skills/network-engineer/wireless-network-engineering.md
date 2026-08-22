# Wireless Network Engineering

## Purpose
Design and troubleshoot enterprise Wi-Fi for reliable coverage, capacity, roaming, security, and user experience.

## When to use
Use for new wireless deployments, office redesign, density growth, roaming failures, interference, authentication issues, or performance complaints.

## Inputs
Floor plans, client density/types, application needs, RF survey data, AP/controller capabilities, authentication design, channel plan, and wired uplinks.

## Context to inspect
Inspect RF spectrum, RSSI/SNR, channel utilization, co-channel interference, AP placement/power, roaming events, 802.1X/RADIUS, DHCP/DNS, and switch PoE/uplinks.

## Core knowledge
Wi-Fi is shared half-duplex radio capacity. Coverage alone is insufficient; channel reuse, client behavior, interference, airtime, and roaming determine experience.

## Procedure
1. Define coverage, capacity, roaming, and application requirements.
2. Survey RF environment and physical constraints.
3. Design AP placement and channel/power plan.
4. Choose bands/channel widths based on density and spectrum.
5. Configure secure authentication and segmentation.
6. Validate wired uplink and PoE capacity.
7. Test representative client types and roaming paths.
8. Measure SNR, retries, airtime, throughput, and latency.
9. Tune using observed RF/client behavior.
10. Document expected coverage and operational thresholds.

## Decision points
Prefer narrower channels in dense deployments for reuse; wider channels may help low-density high-throughput cases. Use 802.1X for enterprise identity where supported; PSKs require stronger lifecycle controls.

## Common failure patterns
Adding APs to fix interference, excessive transmit power, overly wide channels, relying on signal bars, poor roaming assumptions, weak guest isolation, and ignoring wired bottlenecks.

## Verification
Perform post-deployment survey, roaming tests, authentication, capacity tests, spectrum review, and client-experience validation.

## Expected output
A validated wireless design or remediation with RF plan, security, capacity, roaming, and monitoring guidance.

## Stop conditions
Escalate when physical survey access is unavailable, regulatory constraints are unclear, or remediation requires structural/cabling changes outside scope.
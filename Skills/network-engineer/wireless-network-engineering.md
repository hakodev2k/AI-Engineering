# Wireless Network Engineering

## Purpose
Design and troubleshoot enterprise Wi-Fi for coverage, capacity, roaming, security, and predictable client experience.

## When to use
Use for WLAN design, site expansion, roaming failures, interference, capacity complaints, or authentication issues.

## Inputs
Floor plans, client/device types, density, applications, RF survey data, AP/controller configuration, spectrum data, authentication logs, and performance telemetry.

## Context to inspect
Channel plan, channel width, transmit power, SNR, retries, airtime utilization, roaming, band steering, DFS, SSIDs, VLANs, 802.1X/RADIUS, and wired uplinks.

## Core knowledge
Wi-Fi is shared half-duplex airtime. Strong signal alone does not imply capacity. Design from client capabilities and application requirements; minimize co-channel interference and excessive SSID overhead.

## Procedure
1. Define coverage, capacity, roaming, and application targets.
2. Inventory client radios and regulatory constraints.
3. Perform predictive design followed by on-site validation for important deployments.
4. Set channel widths appropriate to density and spectrum.
5. Tune power to create useful cell boundaries without coverage holes.
6. Limit SSIDs and map segmentation deliberately.
7. Validate authentication and key-management flows.
8. Measure SNR, retries, airtime, channel utilization, and PHY rates.
9. Investigate interference with spectrum evidence.
10. Test roaming using representative clients and applications.
11. Verify wired uplink, DHCP, DNS, and gateway paths.
12. Compare post-change telemetry to baseline.

## Decision points
Prefer 5/6 GHz where client support and regulation allow; retain 2.4 GHz for compatibility/IoT needs. Use wider channels only where spectrum reuse and density permit.

## Common failure patterns
Too many APs at high power, 80/160 MHz channels in dense sites, excessive SSIDs, sticky clients, hidden-node problems, DFS surprises, and blaming RF for DHCP/RADIUS failures.

## Verification
Validate coverage and capacity survey, authentication, roaming, throughput, latency, retry rates, and peak-hour airtime.

## Expected output
RF/WLAN design or remediation, survey evidence, configuration rationale, and measured client-experience results.

## Stop conditions
Stop when regulatory constraints are uncertain, physical survey access is required but unavailable, or client limitations invalidate the proposed design.
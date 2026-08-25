# Analysis Environment Safety

## Purpose
Design and operate a reverse-engineering environment that protects production systems, evidence integrity, credentials, and analysts from untrusted or unstable artifacts.

## When to use
Use before executing unknown binaries, opening potentially hostile documents in analysis tools, attaching debuggers, or interacting with device/firmware targets.

## Inputs
Artifact risk profile, required tools, OS/platform, network requirements, data sensitivity, snapshot/recovery capability.

## Preconditions
Confirm authorization and classify whether execution, network access, or hardware interaction is actually necessary.

## Context to inspect
Host/guest isolation, hypervisor configuration, shared folders, clipboard, credentials, network routing, DNS, proxies, snapshots, USB/device passthrough, logging, and tool update state.

## Core knowledge
Analysis tools themselves parse attacker-controlled data and may contain vulnerabilities. Isolation should cover both target execution and artifact parsing. Convenience integrations such as shared clipboard or mounted host folders weaken boundaries.

## Procedure
1. Classify the artifact and planned interaction risk.
2. Use a dedicated disposable VM/container or isolated hardware appropriate to the threat.
3. Remove personal/cloud credentials and unnecessary secrets.
4. Disable host integration features not required for the task.
5. Configure network as offline, simulated, or tightly controlled by need.
6. Snapshot a clean baseline and record tool versions.
7. Transfer artifacts through a controlled staging path and verify hashes.
8. Collect logs externally where possible without exposing sensitive systems.
9. Revert or rebuild after risky execution.
10. Patch analysis tools and retire contaminated environments.

## Decision points
Prefer no execution over execution, offline over internet access, and disposable environments over long-lived analyst machines. Hardware passthrough requires additional containment because VM boundaries may not cover devices.

## Common failure patterns
Using production credentials; bridged networking by default; host-shared folders; reusing contaminated VMs; trusting analysis tools with hostile files on the host.

## Verification
Confirm isolation settings before execution, test network policy, verify snapshot restoration, and ensure no sensitive credentials are present.

## Expected output
A documented, reproducible containment profile matched to the analysis risk.

## Stop conditions
Stop if required isolation cannot be established, the artifact requires unsafe privileges, or the planned interaction could affect unauthorized systems.
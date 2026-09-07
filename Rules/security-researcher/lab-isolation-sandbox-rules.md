# Lab Isolation and Sandbox Rules

## Purpose
Prevent security research from unintentionally affecting production systems, neighboring networks, personal devices, or uncontrolled third parties.

## Scope
Applies to research environments used for exploit reproduction, malware handling, fuzzing, protocol testing, suspicious document analysis, vulnerable images, and untrusted binaries.

## MUST
- High-risk research MUST use an isolated environment appropriate to the threat model.
- Network connectivity MUST be disabled, restricted, or explicitly routed through controlled inspection points when samples or tools may initiate outbound traffic.
- Lab credentials, tokens, certificates, and datasets MUST be non-production unless production material is explicitly required and approved.
- Snapshots or equivalent reproducible reset mechanisms MUST exist before destructive or state-corrupting tests.
- Host-to-guest integration features such as shared folders, clipboard synchronization, device passthrough, and credential forwarding MUST be minimized for hostile workloads.
- Research environments MUST be clearly distinguishable from production and personal environments.
- Data leaving the sandbox MUST be treated as untrusted and scanned or reviewed before reuse.
- Any experiment capable of generating significant traffic, resource exhaustion, or propagation MUST include containment controls and a defined stop condition.

## MUST NOT
- MUST NOT execute unknown or malicious artifacts directly on a workstation containing valuable credentials or production access.
- MUST NOT connect intentionally vulnerable systems directly to an unrestricted public network.
- MUST NOT reuse production secrets in disposable research images.
- MUST NOT assume virtualization alone provides sufficient containment for code specifically capable of escaping or attacking its host.
- MUST NOT allow autonomous tooling to expand its network reach beyond configured research boundaries.

## SHOULD
- Labs SHOULD use disposable infrastructure and infrastructure-as-code where practical.
- Egress logging, packet capture, process telemetry, and filesystem auditing SHOULD be enabled when they improve evidence without altering the behavior under study.
- Separate trust zones SHOULD be used for sample acquisition, execution, evidence storage, and reporting.

## Exceptions
Reduced isolation is acceptable only when required to reproduce environment-specific behavior and after documenting the reason, expected exposure, compensating controls, rollback method, and human approval for material risk.

## Verification
Inspect network routes, firewall rules, credentials, shared resources, snapshots, telemetry, and host integration settings before execution. After the test, review logs for unexpected egress, lateral access, persistence, or interactions outside the lab.
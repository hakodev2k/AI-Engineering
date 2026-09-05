# Skill: Egress Threat Assessment

## Purpose
Determine whether an agent runtime can contact anything beyond the explicitly required task scope and convert the result into enforceable egress policy.

## Trigger
New agent runtime, cyber/browser evaluation, added network tool, sandbox/proxy change, external integration, or containment incident.

## Inputs
Task specification; runtime topology; DNS/proxy/firewall configuration; allowed destinations; protocols/ports; approval policy; logs from baseline probes.

## Preconditions
Read-only access to deployment/network metadata. Authorization to run non-destructive connectivity probes only against owned or approved test endpoints.

## Required context
Effective runtime path from agent process to resolver, proxy, firewall, NAT, and external destination.

## Allowed tools
Config inspection, safe DNS resolution, socket/proxy metadata, packet/log inspection, approved test endpoints, `scripts/check_egress_policy.py`.

## Constraints
Do not probe arbitrary third parties. Do not transmit secrets. Do not execute consequential actions to prove reachability.

## Procedure
1. Enumerate every network-capable tool/process available to the agent.
2. Record baseline destinations reachable from the runtime.
3. Derive the minimum destination/protocol/port set required by the task.
4. Compare baseline reachability with required scope.
5. Validate hostname canonicalization and resolved addresses.
6. Classify destinations/actions by risk and approval requirement.
7. Encode the result in a policy file and run the checker.
8. Implement runtime controls mirroring the declared policy.
9. Perform safe negative probes against denied test destinations.
10. Hand evidence to an independent Containment Reviewer.

## Decision points
- Wildcard/public internet route: block unless explicitly justified and approved for a controlled research case.
- Destination not required by task: deny.
- Hostname resolves outside declared address scope: deny.
- External write/auth/account/package-publish action: require explicit human approval.
- Unknown effective route: stop and escalate.

## Expected output
Reachability baseline, required-destination matrix, policy JSON, violations, remediation evidence, verification status.

## Metrics
Required/allowed destination ratio; unauthorized reachability count; negative-probe pass rate; DNS/IP mismatch count; denied attempts.

## Verification
Policy checker passes and safe negative probes demonstrate that denied routes do not establish connections.

## Failure handling
Retry transient DNS/config collection once. Missing or contradictory network evidence is blocking.

## Stop conditions
Stop immediately on unexpected external side effect, uncontrolled wildcard route, unknown proxy bypass, or policy ambiguity after one retry.
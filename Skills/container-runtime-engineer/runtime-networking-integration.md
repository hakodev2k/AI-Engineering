# Runtime Networking Integration

## Purpose
Integrate container process isolation with network namespaces and external networking systems without conflating runtime and network-plugin ownership.

## When to use
Use for netns setup, CNI-style integration, interface lifecycle bugs, DNS/connectivity incidents, or teardown leaks.

## Inputs
Network namespace handles, plugin/configuration, routes, links, addresses, iptables/nftables/eBPF state, runtime logs.

## Context to inspect
Determine who creates the network namespace, who configures interfaces/routes, when setup occurs relative to process start, and who owns teardown.

## Core knowledge
The runtime typically establishes namespace context while networking components configure connectivity. Network namespace lifetime and plugin idempotency are critical during partial failures.

## Procedure
1. Define ownership of namespace creation and network configuration.
2. Capture namespace identity before setup.
3. Inspect links, addresses, routes, DNS, and policy inside the namespace.
4. Trace setup result persistence.
5. Reproduce failure between setup and process start.
6. Validate teardown after normal exit and runtime crash.
7. Test duplicate setup/delete calls.
8. Check host-side residual interfaces/rules/maps.
9. Verify multi-network and port-mapping behavior if supported.
10. Add observability around plugin latency/errors.

## Decision points
Keep network policy/configuration outside the low-level runtime unless architecture explicitly owns it. Persist enough plugin result data to support deterministic cleanup.

## Common failure patterns
Leaked veth pairs, stale netns bind mounts, teardown without original config, DNS assumptions, non-idempotent plugins, and racing network deletion with exec.

## Verification
Test connectivity, isolation, policy, restart recovery, and zero residual host network state after deletion.

## Expected output
A clear network lifecycle contract or evidence-backed networking RCA.

## Stop conditions
Stop before modifying host-wide routing/firewall policy without scoped ownership and rollback.
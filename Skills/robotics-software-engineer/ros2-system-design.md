# ROS 2 System Design

## Purpose
Design and evolve production-grade ROS 2 systems with deliberate choices for nodes, executors, callback groups, QoS, namespaces, lifecycle management, and composition.

## When to use
Use when adding ROS 2 capabilities, reviewing communication behavior, resolving discovery or QoS issues, or restructuring a robot runtime. Do not use ROS abstractions when a subsystem does not benefit from middleware semantics.

## Inputs
- ROS 2 distribution and middleware implementation
- Existing node graph
- Message/service/action interfaces
- Expected message rates and payload sizes
- Reliability and latency requirements
- Deployment topology

## Preconditions
Know the target ROS 2 distribution and DDS/RMW implementation because features and behavior differ across versions and vendors.

## Context to inspect
Inspect packages, launch files, node composition, topic graph, QoS profiles, callback groups, executors, parameters, lifecycle nodes, namespaces, remappings, and diagnostics.

## Core knowledge
A Senior engineer must understand topics, services, actions, DDS discovery, durability, reliability, history depth, liveliness, executors, callback scheduling, intra-process communication, lifecycle nodes, parameter semantics, and interface compatibility.

## Procedure
1. Map publishers, subscribers, services, and actions with ownership and rates.
2. Confirm whether each interaction is streaming, command/reply, or long-running goal execution.
3. Select QoS based on data semantics rather than defaults.
4. Check callback concurrency and blocking behavior.
5. Separate mutually exclusive and reentrant callback groups intentionally.
6. Choose single-threaded or multi-threaded executors using measured concurrency needs.
7. Use composition where reduced copying and startup overhead justify shared fault domains.
8. Apply namespaces and remappings to support multiple robots and reusable components.
9. Use lifecycle nodes when activation order or controlled transitions matter.
10. Define parameter validation and update behavior.
11. Test discovery, restart, packet loss, late joining, and incompatible QoS scenarios.
12. Record interface compatibility rules for downstream consumers.

## Decision points
Use topics for ongoing asynchronous data, services for bounded request/response operations, and actions for cancellable long-running goals with feedback. Use reliable QoS only when dropped samples are unacceptable and latency/backpressure trade-offs are understood. Use best-effort for high-rate sensor streams when freshness matters more than completeness.

## Common failure patterns
- Reliable QoS on high-rate data causing backpressure
- Blocking callbacks starving an executor
- Services used for long-running work
- Interface changes without compatibility review
- Node composition creating unsafe shared failure domains
- Hard-coded namespaces that prevent multi-robot deployment

## Verification
Use ROS graph inspection, topic statistics, QoS introspection, rosbag replay, restart tests, and load tests. Confirm no hidden callback starvation, unexpected queue growth, or incompatible endpoint pairs.

## Expected output
A documented ROS 2 communication design with interfaces, QoS choices, execution model, lifecycle behavior, and compatibility rules.

## Stop conditions
Stop when middleware behavior cannot satisfy required latency or determinism, an interface change would break unmanaged consumers, or observed DDS behavior contradicts assumptions and requires vendor-specific investigation.
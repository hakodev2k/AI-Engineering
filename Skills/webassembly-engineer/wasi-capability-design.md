# WASI Capability Design

## Purpose
Expose operating-system-like capabilities to Wasm workloads through WASI with deliberate least privilege and portability.

## When to use
Use when guests need files, clocks, randomness, sockets, environment data, or other system resources. Do not grant ambient host access merely to simplify integration.

## Inputs
Required guest operations, target WASI generation/runtime, filesystem/network needs, trust model, deployment topology, and policy constraints.

## Context to inspect
Inspect runtime WASI support, preopened resources, environment variables, inherited descriptors, network policy, host mounts, secrets handling, and component dependencies.

## Core knowledge
WASI is capability-oriented: access should be explicitly provisioned. Preview generations and runtime implementations differ. A preopened directory or socket capability can be more authority than application logic appears to need. Portability depends on avoiding undocumented runtime extensions.

## Procedure
1. Enumerate every external resource the guest truly needs.
2. Map each requirement to the narrowest WASI capability.
3. Select the supported WASI interface/version deliberately.
4. Configure preopens and handles with minimum scope and permissions.
5. Keep secrets out of broad environment inheritance where possible.
6. Define network destinations and protocols explicitly.
7. Test denied operations as well as allowed operations.
8. Verify behavior on each supported runtime.
9. Record capability assumptions as deployment policy.
10. Review capabilities whenever guest functionality expands.

## Decision points
Mount a narrow directory instead of a filesystem root. Prefer explicit resource handles over ambient configuration. Use runtime-specific extensions only behind an adapter when portability is required.

## Common failure patterns
Preopening `/`; inheriting all environment variables; assuming WASI versions are interchangeable; enabling unrestricted outbound networking; relying on host path layout; failing open when a capability is absent.

## Verification
Demonstrate required operations succeed and unauthorized file/network/environment operations fail. Validate on the declared runtime matrix.

## Expected output
A minimal capability manifest/configuration, compatibility notes, and tests proving both functionality and denial boundaries.

## Stop conditions
Stop if requested authority exceeds policy, runtime WASI semantics are incompatible, or required access cannot be scoped safely.
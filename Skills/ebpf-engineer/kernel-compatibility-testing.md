# Kernel Compatibility Testing

## Purpose
Establish evidence that eBPF functionality works across a declared kernel/distribution support matrix.

## When to use
Use before release, after kernel-sensitive changes, or when support incidents reveal drift.

## Inputs
Support matrix, BPF artifacts, test workloads, expected events/actions, kernel configs and BTF metadata.

## Context to inspect
Inspect minimum/maximum kernels, vendor backports, architecture, BTF, helper/program/map support, lockdown/security settings, and container hosts.

## Core knowledge
Kernel version alone is insufficient because vendors backport features and fixes. Tests should probe capabilities and semantics directly.

## Procedure
1. Define supported kernel/distribution/architecture combinations.
2. Identify each feature's kernel dependencies.
3. Build capability probes and expected fallback behavior.
4. Automate load/attach and functional scenarios.
5. Validate decoded data, not merely load success.
6. Include oldest supported and representative vendor kernels.
7. Exercise missing-feature paths.
8. Record verifier logs and kernel metadata on failure.
9. Gate releases on explicit compatibility criteria.

## Decision points
Use representative sampling when matrix size is large, prioritizing boundary and vendor-divergent kernels. Remove support rather than silently degrade required semantics.

## Common failure patterns
Testing only latest upstream, assuming version implies capability, no semantic assertions, and undocumented vendor dependencies.

## Verification
CI/lab results must show load, attach, behavior, fallback, and cleanup across the matrix.

## Expected output
A reproducible compatibility report tied to declared support policy.

## Stop conditions
Stop release when required targets fail semantics or fallback is unsafe.
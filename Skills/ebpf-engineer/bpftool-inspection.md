# bpftool Inspection

## Purpose
Use bpftool and kernel-exposed metadata to inspect eBPF programs, maps, links, BTF, and runtime state safely.

## When to use
Use for deployment verification, debugging, capacity inspection, and incident evidence collection.

## Inputs
Host access, expected program/map identities, pin paths, incident or validation question.

## Context to inspect
Inspect bpftool/kernel compatibility, privileges, namespaces, program IDs/tags, map IDs, link targets, BTF IDs, and pin ownership.

## Core knowledge
Runtime IDs are ephemeral; tags, pins, build metadata, and attachment context provide stronger correlation. Inspection commands can expose sensitive data in maps.

## Procedure
1. Define the question before dumping broad state.
2. Inventory programs, maps, links, and BTF metadata.
3. Correlate program IDs/tags with expected deployment artifacts.
4. Confirm attachment targets and link ownership.
5. Inspect map metadata before values.
6. Sample map values only when authorized and necessary.
7. Record memory/cardinality indicators and frozen/pinned state.
8. Capture structured output for reproducibility.
9. Avoid mutations unless explicitly part of remediation.

## Decision points
Use JSON output for automation/evidence. Prefer metadata inspection to full map dumps when data sensitivity or scale is high.

## Common failure patterns
Treating IDs as stable identity, dumping sensitive maps, mutating state during diagnosis, overlooking links, and inspecting wrong namespace/host.

## Verification
Cross-check bpftool state with loader logs, filesystem pins, and expected attachments.

## Expected output
A minimally invasive runtime inventory tied to the investigation question.

## Stop conditions
Stop if required inspection would expose restricted data or mutation is needed without approval.
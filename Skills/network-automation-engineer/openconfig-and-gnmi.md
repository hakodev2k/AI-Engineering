# OpenConfig and gNMI

## Purpose
Use OpenConfig models and gNMI for vendor-neutral configuration and streaming state where platform support is sufficient.

## When to use
Use for telemetry, structured state collection, and configuration across heterogeneous network fleets.

## Inputs
Supported OpenConfig paths, gNMI capabilities, target inventory, TLS/authentication, desired data, and subscription requirements.

## Context to inspect
Vendor model coverage, path deviations, encoding support, certificates, sampling modes, and controller/collector limits.

## Core knowledge
gNMI supports capabilities, get, set, and subscribe. OpenConfig improves portability but implementations vary by path, revision, semantics, and completeness.

## Procedure
1. Query capabilities per platform/version.
2. Establish secure authenticated transport.
3. Define canonical paths and encodings.
4. Test Get against known device state.
5. For telemetry, choose ON_CHANGE, SAMPLE, or appropriate subscription semantics.
6. For Set, validate update/replace/delete scope carefully.
7. Normalize vendor deviations in adapters.
8. Monitor stream gaps, timestamps, and backpressure.
9. Verify post-change operational state.
10. Maintain capability matrices.

## Decision points
Use OpenConfig for common portable intent; use native models for unsupported features behind explicit abstractions. Choose streaming frequency from operational need, not maximum possible rate.

## Common failure patterns
Assuming all paths exist, replace operations deleting siblings, certificate neglect, telemetry overload, and timestamp interpretation errors.

## Verification
Cross-check gNMI state with device truth, test reconnect/resubscribe, validate Set diffs, and measure collector loss/backpressure.

## Expected output
Capability-aware gNMI integration, normalized data, safe configuration operations, and telemetry validation.

## Stop conditions
Stop on ambiguous path semantics, insecure transport, or incomplete capability evidence for write operations.
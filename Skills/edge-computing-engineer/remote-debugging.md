# Remote Debugging

## Purpose
Diagnose edge failures safely when direct physical access is limited, expensive, or impossible.

## When to use
Use for field-only bugs, site-specific failures, intermittent crashes, network issues, or unexplained device drift.

## Inputs
Incident description, device identity, software version, logs, metrics, configuration, connectivity status, access policy.

## Context to inspect
Inspect fleet health, recent changes, crash artifacts, resource pressure, network state, configuration drift, update history, and peer-device behavior.

## Core knowledge
Remote debugging must preserve evidence, minimize production risk, respect least privilege, and avoid one-off manual changes that create untracked drift.

## Procedure
1. Confirm device identity, version, and incident scope.
2. Compare failing nodes with healthy peers.
3. Capture immutable diagnostic evidence before remediation.
4. Correlate failures with configuration, update, network, and resource changes.
5. Increase telemetry narrowly and temporarily if needed.
6. Reproduce in a lab or simulator whenever possible.
7. Use read-only remote access before mutation.
8. Apply the smallest reversible diagnostic change.
9. Remove temporary access or verbosity after investigation.
10. Convert the root cause into automated detection or regression coverage.

## Decision points
Prefer fleet telemetry over interactive shells. Use remote shell access only when policy permits and structured diagnostics cannot answer the question.

## Common failure patterns
Editing production state without audit, losing crash evidence, permanent debug ports, excessive log collection, treating one device as fleet-wide proof.

## Verification
Verify the root cause against independent evidence and confirm remediation on affected and representative healthy devices.

## Expected output
A reproducible diagnosis with evidence, remediation, and follow-up prevention actions.

## Stop conditions
Stop when investigation requires unauthorized access, destructive evidence collection, or physical intervention outside the approved support process.
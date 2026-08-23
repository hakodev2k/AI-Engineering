# Manufacturing Test and Provisioning

## Purpose
Create repeatable factory workflows that validate hardware and securely establish device identity/configuration.

## When to use
Use when moving prototypes to production, changing contract manufacturers, or diagnosing factory escapes.

## Inputs
Board test points, production limits, firmware, identity process, calibration needs, traceability requirements.

## Context to inspect
Factory fixtures, test software, golden units, programming interfaces, key custody, serial/lot data, and failure handling.

## Core knowledge
Manufacturing tests must be fast, deterministic, traceable, and resistant to secret leakage. Factory firmware and debug access can become production backdoors if lifecycle transitions are weak.

## Procedure
1. Define critical electrical and functional tests.
2. Design fixtures and stable test interfaces.
3. Establish calibration/reference equipment where needed.
4. Program approved firmware and immutable identity.
5. Protect provisioning credentials and signing material.
6. Record unit, lot, hardware revision and test evidence.
7. Define retest and failure disposition.
8. Lock production debug/security state before shipment.
9. Audit yield and escape trends.

## Decision points
Test high-risk functions at factory even when field self-test exists; balance test depth against cycle time using defect cost evidence.

## Common failure patterns
Shared factory secrets, manual identity entry, no traceability, uncontrolled retests, and shipping devices in debug mode.

## Verification
Run known-good and known-bad units, validate uniqueness, trace records, security locking, and fixture repeatability.

## Expected output
An auditable production test and secure provisioning process.

## Stop conditions
Stop production when identity uniqueness, key custody, or critical test coverage cannot be assured.
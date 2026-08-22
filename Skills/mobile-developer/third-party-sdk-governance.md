# Third-Party SDK Governance

## Purpose
Evaluate and operate mobile SDK dependencies without accepting hidden security, privacy, performance, or lifecycle risk.

## When to use
Adding analytics, ads, payments, maps, identity, crash, social, or vendor SDKs.

## Inputs
SDK documentation, license, data flows, binary size, permissions, update history.

## Context to inspect
Transitive dependencies, initialization, collected data, network endpoints, permissions, lifecycle hooks, build impact.

## Core knowledge
An SDK executes inside the app trust boundary and can affect startup, privacy, crashes, binary size, and supply-chain exposure.

## Procedure
1. Define the capability actually required.
2. Compare SDK against native/API alternatives.
3. Review maintenance, license, vulnerabilities, and release cadence.
4. Map data collection and destinations.
5. Inspect permissions and initialization cost.
6. Isolate SDK behind a narrow adapter when useful.
7. Add consent gating and configuration controls.
8. Test failure/unavailability and upgrade behavior.
9. Define ownership and update cadence.

## Decision points
Reject an SDK when marginal convenience does not justify data, supply-chain, performance, or lock-in cost.

## Common failure patterns
Initializing everything at startup, undocumented data collection, direct SDK calls throughout codebase, abandoned dependencies.

## Verification
Dependency scan, runtime network/permission inspection, startup benchmark, privacy review.

## Expected output
Documented dependency decision and controlled integration.

## Stop conditions
Escalate unknown data handling, unacceptable license, or unresolved critical vulnerability.
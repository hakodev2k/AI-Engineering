# Third-Party SDK Security

## Purpose
Control security, privacy, supply-chain, and operational risks introduced by mobile SDKs and libraries.

## When to use
Use before adding SDKs, during dependency reviews, after vulnerability disclosures, and before major upgrades.

## Inputs
Dependency inventory, SDK purpose, permissions, data flows, vendor documentation, vulnerability information, build artifacts.

## Preconditions
Know why the dependency is required and what data/capabilities it can access.

## Context to inspect
Transitive dependencies, manifests, permissions, initialization, network endpoints, telemetry, native binaries, update cadence, and vendor trust.

## Core knowledge
An SDK executes with application privileges and may silently expand data collection or attack surface. Minimize dependencies and isolate optional integrations where practical.

## Procedure
1. Inventory direct and transitive dependencies.
2. Establish business necessity and ownership.
3. Review permissions, data collection, network destinations, and native code.
4. Check maintenance and vulnerability posture.
5. Pin/version dependencies according to release policy.
6. Disable unnecessary SDK features.
7. Verify production configuration.
8. Define upgrade and emergency-removal paths.
9. Monitor advisories and behavior changes.

## Decision points
Prefer smaller, maintained dependencies with transparent behavior. Build internally only when long-term ownership cost is lower than vendor risk.

## Common failure patterns
Abandoned SDKs, unchecked transitive code, unexpected manifest permissions, excessive analytics data, dynamic code loading, and upgrades without behavioral review.

## Verification
Inspect packaged dependency graph, runtime traffic, permissions, and security scan results; confirm documented ownership and update process.

## Expected output
An approved dependency posture with risk rationale, constrained configuration, and lifecycle ownership.

## Stop conditions
Escalate when vendor behavior is opaque, critical vulnerabilities lack remediation, or data collection violates requirements.
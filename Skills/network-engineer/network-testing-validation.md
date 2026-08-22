# Network Testing and Validation

## Purpose
Prove that network designs and changes satisfy intended reachability, performance, security, resilience, and operational requirements before declaring completion.

## When to use
Use after implementation, migrations, major policy changes, upgrades, incident remediation, or before production cutover.

## Inputs
Requirements, topology, flow matrix, success criteria, performance targets, failure scenarios, configuration changes, and monitoring.

## Context to inspect
Inspect intended and live routes, policies, DNS, load balancing, redundancy, device health, application endpoints, and pre-change baselines.

## Core knowledge
Configuration presence is implementation evidence, not outcome verification. Tests should cover positive, negative, degraded, and recovery behavior from representative source locations.

## Procedure
1. Translate requirements into explicit test cases.
2. Capture pre-change baseline where possible.
3. Verify configuration/state against intended design.
4. Test required end-to-end flows.
5. Test prohibited flows and segmentation boundaries.
6. Measure latency, loss, throughput, and DNS where relevant.
7. Exercise component/path failure safely.
8. Verify recovery and failback.
9. Confirm monitoring and alerts observe failures.
10. Record evidence, exceptions, and residual risk.

## Decision points
Use synthetic probes for repeatability and application transactions for user realism. Perform destructive/failure testing only when blast radius and rollback are controlled.

## Common failure patterns
Testing only ping, testing from one location, ignoring negative security tests, no baseline, declaring success from config diff, and skipping failover because redundancy “should work.”

## Verification
Require objective evidence for every critical acceptance criterion and document any untested condition explicitly.

## Expected output
A test record linking requirements to results, measurements, failure/recovery evidence, and unresolved risks.

## Stop conditions
Stop when tests could harm production without approval, required endpoints are unavailable, or success criteria are too ambiguous to verify.
# Abort Criteria and Kill Switches

## Purpose
Define objective conditions and reliable controls for terminating an experiment before unacceptable harm occurs.

## When to use
Use for every experiment that can affect shared or production-like systems.

## Inputs
SLOs, business impact limits, fault tooling, dependency risks, and recovery procedures.

## Context to inspect
Review monitoring latency, injector control path, access permissions, automation behavior, and failure modes that could disable the primary kill mechanism.

## Core knowledge
Abort criteria must be measurable before execution. Kill switches should be fast, tested, independent of the impaired path, and followed by recovery verification.

## Procedure
1. Identify unacceptable user, data, security, and infrastructure outcomes.
2. Convert them into measurable thresholds.
3. Define automatic and manual abort triggers.
4. Configure maximum experiment duration.
5. Test the kill path without injecting the full fault.
6. Assign authority to stop without debate.
7. During execution, continuously evaluate criteria.
8. After abort, verify fault removal and recovery.

## Decision points
Automate aborts for fast-moving measurable risks; retain manual authority for ambiguous business signals. Use multiple kill mechanisms for high-risk experiments.

## Common failure patterns
Subjective abort language, thresholds unavailable in real time, kill switch on the failed dependency, and assuming fault expiration guarantees cleanup.

## Verification
Demonstrate kill controls before the experiment and confirm recovery after termination.

## Expected output
Explicit abort matrix and tested termination controls.

## Stop conditions
Do not start if abort criteria or a reliable kill path cannot be established.
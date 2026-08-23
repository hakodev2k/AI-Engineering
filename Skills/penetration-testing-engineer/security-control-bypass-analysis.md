# Security Control Bypass Analysis

## Purpose
Evaluate whether preventive controls such as WAF rules, network restrictions, client checks, feature gates, or policy enforcement actually protect the intended security boundary.

## When to use
Use when a control is explicitly relied upon to mitigate a validated weakness or protect a sensitive operation.

## Inputs
Control design, protected operation, test identities, architecture, observed requests, and authorized bypass-testing constraints.

## Context to inspect
Inspect where enforcement occurs, canonicalization, alternate protocols/routes, direct backend reachability, identity context, fail-open behavior, and control dependencies.

## Core knowledge
A compensating control is effective only if attackers cannot reliably route around it and it fails safely. Test the security invariant, not an endless catalogue of evasions.

## Procedure
1. Define the threat the control is intended to stop.
2. Identify the authoritative enforcement point.
3. Establish baseline blocked and allowed behavior.
4. Look for alternate legitimate paths that reach the same protected action.
5. Test normalization and protocol differences conservatively.
6. Evaluate direct backend or service access where in scope.
7. Test behavior during control errors only when safe and authorized.
8. Stop once bypassability or robust enforcement is established.
9. Determine whether remediation belongs in the application, identity layer, network, or control itself.
10. Document control assumptions and residual risk.

## Decision points
Prefer fixing the underlying vulnerability over expanding brittle detection signatures. Accept compensating controls only when coverage and ownership are durable.

## Common failure patterns
Endless payload mutation, high-volume evasion attempts, assuming WAF presence fixes authorization, bypassing via out-of-scope infrastructure, and reporting harmless filter differences.

## Verification
Demonstrate either a controlled path around the intended boundary or consistent enforcement across materially different authorized paths.

## Expected output
A control-effectiveness conclusion with evidence, bypass prerequisites, residual risk, and remediation recommendation.

## Stop conditions
Stop if bypass testing risks service degradation, crosses scope, or requires prohibited stealth/persistence techniques.
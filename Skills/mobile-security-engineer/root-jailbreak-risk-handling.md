# Root and Jailbreak Risk Handling

## Purpose
Design proportionate behavior for rooted, jailbroken, instrumented, or otherwise high-risk devices without treating detection as a perfect security boundary.

## When to use
Use for high-value applications, device-integrity policy, fraud controls, or compromised-device incident analysis.

## Inputs
Threat model, business impact, integrity APIs, user population, false-positive tolerance, regulatory requirements.

## Preconditions
Define which threats device-integrity controls are expected to reduce.

## Context to inspect
Platform attestation, root/jailbreak signals, debugger/hooking detection, backend risk scoring, offline behavior, and support flows.

## Core knowledge
Local compromise detection is bypassable. Signals should inform layered risk decisions. Stronger enforcement increases false positives, accessibility/support cost, and availability risk.

## Procedure
1. Define protected actions and attacker goals.
2. Inventory available integrity signals.
3. Evaluate bypassability and false-positive characteristics.
4. Send relevant signals to trusted backend evaluation where appropriate.
5. Choose response: observe, step-up, restrict sensitive actions, or block.
6. Provide safe recovery/support paths.
7. Instrument decisions and outcomes.
8. Test bypass and false-positive scenarios.

## Decision points
Block only when business/security impact justifies availability cost. Prefer step-up or capability restriction when uncertainty is material.

## Common failure patterns
Single boolean root checks, client-only enforcement, security-through-obscurity claims, blocking legitimate custom devices without policy, and no telemetry.

## Verification
Demonstrate that bypassing one signal does not defeat critical server controls and measure false-positive behavior.

## Expected output
A layered device-risk policy with explicit responses, telemetry, and limitations.

## Stop conditions
Escalate when integrity policy has legal, accessibility, or major customer-impact implications.
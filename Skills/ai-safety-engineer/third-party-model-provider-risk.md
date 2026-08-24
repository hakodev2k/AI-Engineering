# Third-Party Model Provider Risk

## Purpose
Evaluate and control safety dependencies introduced by external model and AI service providers.

## When to use
Use during provider selection, contract changes, model migrations, or critical provider incidents.

## Inputs
Provider capabilities, documentation, retention terms, security controls, model-change practices, SLAs, test results.

## Context to inspect
Data flows, residency, logging, version pinning, fallback providers, rate limits, safety controls, and outage behavior.

## Core knowledge
Outsourcing inference does not outsource accountability. Provider behavior, retention, model updates, and availability become system dependencies.

## Procedure
1. Classify data and actions sent to the provider.
2. Review retention, training-use, security, and access terms.
3. Test model behavior against application-specific safety requirements.
4. Determine versioning and change-notification guarantees.
5. Identify provider-side controls and their limits.
6. Design local controls that remain enforceable independently.
7. Define outage, degradation, and fallback behavior.
8. Establish monitoring for behavioral drift.
9. Reassess after provider or model changes.

## Decision points
Avoid sending data the provider need not receive. Use provider fallback only if alternate behavior is independently safety-qualified.

## Common failure patterns
Assuming provider filters satisfy application policy; silent model upgrades; unsafe fallback; unclear retention; no exit strategy.

## Verification
Confirm contractual/technical assumptions and run the same safety suite against production-equivalent provider configurations.

## Expected output
A provider risk assessment with dependencies, controls, fallback plan, and reassessment triggers.

## Stop conditions
Escalate unresolved data-use terms, inability to pin/qualify critical behavior, or provider controls insufficient for required risk level.
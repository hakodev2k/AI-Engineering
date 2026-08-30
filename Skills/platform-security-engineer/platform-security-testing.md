# Platform Security Testing

## Purpose
Build a repeatable security-testing strategy for platform control planes, shared services, tenant boundaries, developer self-service, CI/CD, and runtime guardrails.

## When to use
Use when launching new platform capabilities, reviewing major architectural changes, validating remediations, preparing for production readiness, or investigating suspected security regressions.

## Inputs
Threat model, API contracts, tenant model, IAM policies, deployment workflows, runtime policies, security requirements, test environments, and known abuse cases.

## Context to inspect
Inspect trust boundaries, privileged endpoints, authorization logic, generated infrastructure, shared caches and queues, identity federation, policy engines, network boundaries, secrets handling, and recovery paths.

## Core knowledge
Platform testing should emphasize negative paths and privilege boundaries rather than only functional success. High-value tests include cross-tenant access, privilege escalation, confused-deputy behavior, unsafe defaults, policy bypass, replay, credential misuse, resource exhaustion, and control-plane tampering.

## Procedure
1. Derive security invariants from the threat model and architecture.
2. Convert each invariant into concrete positive and negative tests.
3. Prioritize tests for control-plane privilege and cross-tenant impact.
4. Create isolated fixtures with representative identities and tenants.
5. Test authentication, object-level authorization, and privilege escalation paths.
6. Test unsafe input, replay, idempotency, and confused-deputy scenarios.
7. Validate policy and admission bypass attempts.
8. Exercise secret exposure and credential-lifetime assumptions safely.
9. Test network segmentation and runtime privilege boundaries.
10. Add automated regression tests for confirmed vulnerabilities and high-value invariants.
11. Run manual adversarial reviews for workflows too complex for automation.
12. Record evidence, severity, reproduction steps, and verified remediation.

## Decision points
Automate deterministic security invariants in CI or platform conformance tests. Use focused manual testing for chained attack paths, novel abuse cases, or controls that depend on operational context.

## Common failure patterns
Testing only happy paths, using admin identities for all fixtures, treating scanner output as security testing, omitting cross-tenant cases, and closing findings without regression coverage.

## Verification
Verify tests fail against intentionally unsafe fixtures, pass against remediated behavior, run reliably in representative environments, and map back to documented security invariants.

## Expected output
A risk-based security test suite, reproducible findings, regression protection, and evidence that critical platform boundaries behave as intended.

## Stop conditions
Stop and escalate when testing could affect real tenants or production without authorization, required test identities cannot be isolated safely, or evidence indicates an active exploitable production condition.
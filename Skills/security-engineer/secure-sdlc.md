# Secure Software Development Lifecycle

## Purpose
Integrate practical security activities into planning, design, implementation, review, testing, release, and operations without turning security into a late-stage gate.

## When to use
Use when defining engineering security practices, reducing recurring vulnerabilities, or standardizing security expectations across teams.

## Inputs
Development workflow, repository structure, CI/CD pipeline, threat model process, security tooling, release process, incident history.

## Context to inspect
Backlog templates, design reviews, code review rules, dependency management, CI checks, test environments, release approvals, telemetry, and vulnerability response.

## Core knowledge
Security works best when controls are placed at the earliest reliable point, with stronger verification near release for high-risk changes. Processes should be risk-based and automate repeatable checks while preserving expert review for contextual decisions.

## Procedure
1. Identify recurring security defect classes and high-risk change types.
2. Add security requirements to planning for relevant work.
3. Trigger threat modeling for material architecture or trust-boundary changes.
4. Define secure coding and review expectations by technology.
5. Integrate secret, dependency, static, and configuration checks into CI.
6. Add negative authorization and abuse-case tests where risk warrants them.
7. Define release criteria for unresolved security findings.
8. Ensure production telemetry supports security detection and investigation.
9. Feed incident and vulnerability lessons back into standards and tests.
10. Periodically measure process effectiveness and remove low-value friction.

## Decision points
Use mandatory gates only where signal quality and impact justify blocking delivery. Prefer targeted requirements over universal heavyweight process.

## Common failure patterns
Security review only before release, noisy gates developers learn to ignore, no ownership for findings, generic secure-coding checklists, and incidents that do not change engineering practices.

## Verification
Sample recent changes across risk levels and confirm expected security activities were triggered, findings were owned, and critical controls produced evidence.

## Expected output
A risk-based secure SDLC with clear triggers, automated checks, review responsibilities, release criteria, and feedback loops.

## Stop conditions
Escalate when required security controls conflict with contractual, regulatory, or production constraints that need accountable approval.
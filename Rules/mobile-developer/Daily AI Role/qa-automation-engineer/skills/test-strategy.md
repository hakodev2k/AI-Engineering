# Skill: Test Strategy and Risk-Based Planning

## Purpose
Convert product requirements, change scope, architecture context, and operational risk into an executable automated-test strategy.

## Trigger
Use for a new feature, meaningful change, release candidate, incident follow-up, or when coverage is unclear.

## Inputs
- Business objective and acceptance criteria
- Change diff or technical design
- Architecture and dependency map
- Existing test inventory and recent failures
- Production risk, deadlines, supported environments
- Known defects and incident history

## Preconditions
- The target behavior is identifiable.
- Missing or conflicting requirements are recorded.
- Test environment ownership and data constraints are known or escalated.

## Required context
Gather only evidence needed to reason about behavior, integration points, failure modes, and release risk. Separate facts, assumptions, hypotheses, decisions, and open questions.

## Tools
Repository search, issue tracker, CI results, API specifications, browser/devtools, logs, database read access when permitted, test management artifacts.

## Procedure
1. Translate requirements into observable behaviors and acceptance conditions.
2. Build a change-impact map: entry points, critical paths, integrations, persistence, auth, async work, compatibility boundaries.
3. Identify failure modes using business impact, likelihood, detectability, reversibility, and blast radius.
4. Classify candidate checks by layer: unit, component, API/integration, UI/E2E, contract, performance, security-related validation, exploratory.
5. Prefer the lowest reliable layer that proves the behavior; reserve UI E2E for user-critical cross-boundary flows.
6. Define positive, negative, boundary, permission, state-transition, retry/idempotency, and recovery scenarios as applicable.
7. Mark scenarios as automate-now, automate-later, manual/exploratory, or out-of-scope with reason.
8. Define test-data strategy, environment assumptions, isolation requirements, and cleanup ownership.
9. Define evidence and release gates before execution starts.
10. Review the plan for duplicated coverage, blind spots, brittle implementation coupling, and schedule risk.

## Decision rules
- Prioritize by `risk = impact × likelihood`, adjusted upward for poor detectability and low reversibility.
- Automate stable, repeatable, high-value behavior first.
- Do not treat code coverage percentage as proof of behavioral coverage.
- Do not test framework internals or implementation details unless they are contractual behavior.
- A critical path without deterministic verification is a release risk that must be visible.

## Constraints
- Do not invent acceptance criteria.
- Do not silently reduce coverage to meet a deadline.
- Do not request production write access merely to make testing convenient.

## Expected outputs
A test strategy containing scope, risks, prioritized scenarios, automation layers, data/environment needs, dependencies, evidence requirements, owners, and explicit exclusions.

## Quality criteria
Every high-risk requirement maps to at least one verification method or a documented accepted risk. Redundant UI coverage is minimized. Blocking dependencies and approvals are visible.

## Verification
Trace acceptance criteria and high-risk failure modes to planned checks. Confirm the planned checks are executable in available environments.

## Failure handling
If requirements conflict, stop affected test design and escalate with examples. If environment capability is unknown, plan non-destructive probes or request evidence. If schedule cannot support required risk coverage, present a minimum safe gate plus deferred coverage.

## Stop conditions
Stop before destructive production tests, policy changes, credential changes, or any test that can materially affect real users without explicit human approval.

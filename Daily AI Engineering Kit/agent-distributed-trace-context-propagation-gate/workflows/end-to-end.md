# Workflow: End-to-End Trace Propagation Gate

## Trigger
Broken/discontinuous distributed trace or a code change crossing an HTTP, message, or job boundary.

## Entry conditions
Repository is readable; task scope is known; package config exists.

## Inputs
Repository root, task description, changed files, optional logs/traces.

## Stages

### 1. Preflight — Repository Explorer
- run config validation;
- run deterministic scanner;
- identify affected boundary set.

Artifact: scanner JSON and boundary inventory.

Checkpoint: stop on invalid configuration or unreadable repository.

### 2. Context mapping — Repository Explorer
- identify entry point;
- locate extraction/active context;
- locate exit injection;
- locate consumer parent/link behavior;
- identify relevant tests.

Artifact: propagation map represented in evidence JSON.

Checkpoint: hypotheses are not promoted to facts without evidence.

### 3. Plan — Implementation Agent
For each confirmed defect, define smallest change, focused test, expected before/after evidence, and approval requirements.

Approval point: stop before production config, security weakening, infrastructure/secrets, destructive operations, breaking contracts, or Git history rewrite.

### 4. Execute — Implementation Agent
Implement one boundary at a time. Add/adjust tests. No unrelated refactoring.

### 5. Deterministic verification — Implementation Agent
Run formatter, targeted tests, host build/test requirements, scanner, and evidence validation.

### 6. Independent verification — Verification Agent
Re-run applicable checks read-only, inspect diff, validate parent/trace/carrier behavior, and set verification status.

## Retry rules
Maximum implementation retries: **2**.

Retryable: focused test failure caused by the attempted repair; deterministic scanner high finding caused by touched boundary; compile/build error introduced by the change.

Not retryable autonomously: permission failure, approval-required action, ambiguous architecture ownership, unavailable required environment, second failed implementation retry.

Evidence preserved across retries: scanner output, failing commands, test output, changed-file diff, prior hypothesis and decision.

Escalation: after retry budget is exhausted or a non-retryable failure occurs, set `status=blocked`, preserve evidence, and stop.

## Failure paths
- transient tool error: one tool retry;
- validation failure: stop;
- build/test failure: use implementation retry budget;
- permission failure: stop without escalation of privilege;
- runtime evidence unavailable: substitute deterministic boundary test only when it proves the same contract;
- business-rule conflict: stop for human decision.

## Produced artifacts
- scanner JSON;
- evidence JSON matching `schemas/evidence.schema.json`;
- implementation/test diff when required;
- final verification status.

## Definition of Done
All affected boundaries mapped; confirmed defects repaired; targeted and required host tests pass; deterministic findings resolved/evidenced; evidence contract validates; independent verification is `verified`; no pending approval or blocking risk remains.
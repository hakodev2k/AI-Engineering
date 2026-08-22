# Skill: Verification Contract Design

## Purpose
Translate repository risk and scope into explicit, observable completion checks without requesting hidden chain-of-thought.

## Trigger
Before implementation for nontrivial work, or when a repository lacks a machine-readable Definition of Done.

## Inputs
Changed scope, repository instructions, CI commands, test topology, risk classification, cost constraints.

## Preconditions
Canonical build/test commands are known or can be discovered from repository configuration.

## Allowed tools
Read-only repository search, CI configuration inspection, test runner, git status/diff.

## Constraints
Do not invent a passing check. Do not substitute a narrower check for a required canonical check. Do not run the full suite repeatedly when the contract permits focused intermediate checks.

## Procedure
1. Record facts: changed files, affected components, available checks.
2. Record assumptions separately and mark unresolved assumptions.
3. Assign risk using observable criteria: production/security/data/schema/public API changes are high; isolated internal changes may be low/medium.
4. Map risk to required checks in `config/verification-contract.json`.
5. Define evidence fields: check ID, exact command, start/end time, tree SHA, exit code, output digest, log path.
6. Require focused checks during iteration and canonical checks at the contract's final checkpoint.
7. Reject completion if evidence is missing, stale, from another tree, or has a nonzero exit code.

## Decision points
Escalate risk when scope grows. Require human approval for destructive/production actions. If canonical verification is unavailable, mark completion BLOCKED rather than infer success.

## Expected output
A concrete verification plan listing Facts, Assumptions, Risk, Required checks, Evidence requirements, Stop conditions, and Approval requirements.

## Metrics
Unsupported completion claims, verification coverage, repeated unchanged-tree test runs, time/cost per successful task, rework rate.

## Verification
An independent verifier validates evidence with `scripts/verify_evidence.py`.

## Failure handling
At most three fix/verify attempts. Each failed attempt must record a new hypothesis based on observed evidence. Then stop and escalate.

## Stop conditions
All required checks pass on the current tree; or max attempts, unavailable canonical environment, contradictory evidence, or dangerous action requiring approval.
# Skill — Repository Evidence Preflight

## Purpose
Establish a verifiable source inventory and authoritative evidence set before scope-sensitive agent work begins.

## Trigger
Use for exhaustive tasks, migrations, repository-wide edits, resumed work based on handovers/checkpoints, release-readiness decisions, or whenever missing repository evidence could materially change scope.

## Inputs
Task statement, repository root(s), expected evidence classes/patterns, ignore rules, checkpoint assertions, known authoritative artifacts.

## Preconditions
Read access to declared roots. No mutation has occurred for the current task baseline.

## Required context
User deliverable, acceptance criteria, repository boundaries, generated/vendor exclusions, and known source-of-truth documents.

## Allowed tools
Filesystem search/read, Git status/tree, repository search, deterministic inventory script, read-only subagents.

## Constraints
Do not use hidden chain-of-thought. Record only facts, assumptions, evidence, hypotheses, decisions, risks, and verification status. Do not broaden beyond declared repository boundaries without evidence.

## Procedure
1. Translate the task into evidence classes: source code, tests, docs, assets, manifests, migrations, configs, release state, or domain-specific artifacts.
2. Mark each class required/optional and define deterministic patterns/roots where possible.
3. Run `check_inventory.py` and persist the baseline manifest.
4. Read the authoritative artifacts needed to resolve acceptance criteria and any inherited checkpoint claims.
5. Classify inherited claims as claimed/observed/persisted/verified; downgrade any claim unsupported by current artifacts.
6. If a required class is unresolved, perform at most two evidence-driven search expansions.
7. Establish denominators for exhaustive work (files/items/repos/records) before mutation.
8. Produce a preflight decision: `allow`, `blocked_missing_evidence`, or `blocked_authority_conflict`.
9. After implementation, re-run inventory and compare new in-scope sources against the baseline.

## Decision points
- If a missing class can alter task scope or safety, block implementation.
- If a checkpoint conflicts with durable state, durable current evidence wins; record the conflict.
- If newly discovered sources appear after work, determine whether they are outputs or missed inputs before completion.

## Expected output
Baseline manifest, evidence-class coverage table, authority conflicts, denominator, decision, and verification requirements.

## Metrics
100% required classes resolved, 100% exhaustive tasks with pre-mutation denominator, zero post-hoc missed inputs, zero unsupported durable-state claims.

## Verification
A separate verifier reruns the inventory and samples authoritative evidence independently.

## Failure handling
Maximum two search expansions. If evidence remains unresolved, report exact gaps and stop rather than guessing.

## Stop conditions
Allow implementation only after all material required classes are resolved; otherwise stop as blocked with evidence.
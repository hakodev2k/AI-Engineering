# Skill: Architecture Drift Analysis

## Purpose

Determine whether a proposed or completed code change stays within the approved architecture, introduces a temporary exception, or requires an explicit architecture decision.

## When to use

Run after the architecture baseline is available and before implementation for high-risk changes; rerun after implementation against the final diff.

## Inputs

- architecture baseline;
- architecture policy;
- task acceptance criteria;
- changed files or proposed file changes;
- project/package/import dependency changes;
- deterministic checker output;
- relevant ADRs and approved exceptions.

## Preconditions

- affected modules are mapped or explicitly marked unknown;
- policy validator passes;
- deterministic checker results are available when applicable.

## Process

1. Classify each changed file by architectural module and responsibility.
2. Identify new dependency edges introduced by imports, project/package references, service registrations, message contracts, shared models, or direct calls.
3. Compare every new edge against allowed dependency direction.
4. Identify responsibility drift even when no forbidden import exists, for example business rules moved into controllers or persistence-specific concepts leaking into domain models.
5. Check whether new public types/endpoints/events expand a module contract.
6. Check relevant ADRs for constraints that are not encoded mechanically.
7. Classify each finding as one of:
   - `compliant`;
   - `suspected-drift`;
   - `confirmed-drift`;
   - `approved-exception`;
   - `architecture-change-required`;
   - `insufficient-evidence`.
8. For every drift finding, record evidence, affected modules, why the rule matters, and the smallest safe remediation.
9. Prefer fixing code to fit the current architecture when the requested behavior does not require an architecture change.
10. If a true architecture change is needed, stop at the approval boundary and propose the decision/ADR update separately.
11. If an exception is used, require a narrow scope, owner, reason, and review/expiry date.
12. After implementation, rerun the deterministic checker and compare the final state against the baseline.

## Allowed tools

- read/search repository;
- git diff/status;
- dependency/project graph inspection;
- policy validator;
- boundary checker;
- build/test/static-analysis commands that do not change production state.

## Constraints

- Do not classify a green build as architecture compliance.
- Do not waive a boundary because fixing it is inconvenient.
- Do not expand scope into unrelated architecture cleanup.
- Do not introduce a new framework/dependency merely to satisfy a small drift finding without explicit need.
- Do not self-approve a new dependency direction, breaking public contract, or permanent exception.

## Expected output

A drift report containing:

- baseline references;
- changed modules;
- new dependency edges;
- deterministic findings;
- semantic findings;
- classification per finding;
- proposed remediation or exception;
- approval requirements;
- final verification status.

## Verification

A `pass` requires:

- no unapproved deterministic violations;
- no unresolved `confirmed-drift` or `insufficient-evidence` findings;
- architecture-changing findings have explicit human approval and updated decision evidence;
- final diff has been re-evaluated after edits.

## Failure handling

- False-positive deterministic rule: collect evidence and narrow the rule once; never disable all checks.
- Missing architecture evidence: one targeted baseline refresh.
- Repeated semantic disagreement: maximum two revision rounds, then human architecture review.
- Required architecture change without approval: stop and report `blocked`.

## Stop conditions

Stop with `pass`, `revise`, or `blocked`. Never continue an autonomous fix/review loop beyond two semantic revision rounds.

# Subagents

## Dependency Evidence Analyst
**Mission:** determine whether a proposed package/version has enough authoritative evidence to enter the install workflow.
**Responsibility:** normalize package identity; query authoritative registry metadata; record version age, repository/source link, yanked/deprecated state, integrity/hash information, and policy exceptions.
**Inputs:** ecosystem, requested spec, policy, existing manifests/lockfiles.
**Required context:** approved/blocked catalog and project registry configuration.
**Allowed tools:** read-only registry/API access, repository file reads, `scripts/dependency_guard.py --no-audit`.
**Forbidden actions:** package installation, manifest mutation, shell execution from package content, policy modification.
**Expected output:** structured evidence record with `allow`, `review`, `deny`, or `error` and reasons.
**Completion criteria:** every required field is sourced or marked unavailable; no install side effect occurred.
**Handoff target:** Install Controller or Human Approver.

## Install Controller
**Mission:** execute only an already-approved dependency change using restricted package-manager settings.
**Responsibility:** validate decision freshness, install the exact approved identity/version, capture manifest/lockfile changes, run post-install checks, stop on mismatch.
**Inputs:** signed/recorded allow decision, package spec, baseline hashes.
**Required context:** package-manager capabilities and project test commands.
**Allowed tools:** package manager, isolated environment, lockfile diff, tests/security scanners.
**Forbidden actions:** choosing a different package/version, weakening policy, enabling scripts/sources not explicitly approved, publishing packages.
**Expected output:** install verification record.
**Completion criteria:** resolved dependency matches approval, required security checks finish, changes are reviewable.
**Handoff target:** Independent Verifier.

## Independent Verifier
**Mission:** independently verify that the dependency gate and installation outcome satisfy policy.
**Responsibility:** compare proposal, preflight evidence, lockfile resolution, integrity/hash data, post-install checks, and project tests.
**Inputs:** decision log, diff, lockfile, post-install outputs.
**Required context:** policy and threat model.
**Allowed tools:** read-only inspection, tests, signature/provenance verification, vulnerability scanning.
**Forbidden actions:** approving its own implementation changes, suppressing failed security checks, editing policy to make a failure pass.
**Expected output:** `verified`, `rejected`, or `needs-human-review` with objective evidence.
**Completion criteria:** all Definition-of-Done checks have explicit status.
**Handoff target:** Orchestrator/Human Approver.

## Human Approver Boundary
Fresh, ambiguous, disallowed-source, or exception-path dependencies require a human decision. The human approval record must include package identity/version, evidence reviewed, reason, scope, and expiration. An agent cannot self-approve this boundary.

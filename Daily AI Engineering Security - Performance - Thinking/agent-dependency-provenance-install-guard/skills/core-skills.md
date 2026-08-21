# Core Skills

## Skill 1 — Dependency Proposal Triage
**Purpose:** convert an agent-proposed dependency into an auditable trust decision before package-manager execution.
**Trigger:** any new package reference, install command, manifest addition, `npx`/`pipx` execution, or version change.
**Inputs:** ecosystem, package spec, reason for dependency, target repo, policy.
**Preconditions:** policy file present; registry network available or explicit offline fallback.
**Required context:** existing manifests/lockfiles, approved package catalog, requested capability.
**Tools:** `scripts/dependency_guard.py`, package-manager metadata commands, diff viewer.
**Procedure:** (1) identify whether dependency is new or already locked; (2) normalize package identity; (3) reject non-registry source forms unless separately approved; (4) require exact version when policy says so; (5) query authoritative registry; (6) capture age, yanked/deprecated state, repository/source metadata and integrity/hash evidence; (7) apply cooldown/approval policy; (8) emit allow/review/deny evidence; (9) only then hand off to installation.
**Decisions:** allow only when deterministic checks pass; review for fresh/ambiguous packages; deny nonexistent, blocked, yanked/deprecated or disallowed-source packages.
**Constraints:** registry existence is not proof of safety; popularity is not a sole trust signal; never silently downgrade a review/deny.
**Expected output:** JSON decision record.
**Metrics:** guarded-install coverage; deny/review rate; false-positive review rate; unguarded install count.
**Verification:** decision record matches registry state and policy; install did not occur before allow.
**Failure handling:** network or parser failures return error and fail closed.
**Stop conditions:** deny, review awaiting human decision, or allow with evidence complete.

## Skill 2 — Safe Install and Post-Install Verification
**Purpose:** minimize execution exposure after a dependency passes preflight.
**Trigger:** preflight decision is `allow`.
**Inputs:** exact package/version, package-manager version, lockfile state, preflight record.
**Preconditions:** clean working tree or recorded baseline; scripts/source restrictions supported or compensating sandbox available.
**Required context:** package-manager capabilities and existing dependency policy.
**Tools:** npm/pip, isolated environment/container, `npm audit signatures` where applicable, lockfile diff.
**Procedure:** (1) snapshot manifest/lockfile hashes; (2) install exact version in restricted mode; for npm prefer lifecycle scripts disabled and git/remote/file sources disabled unless explicitly required; (3) inspect changed direct/transitive dependencies; (4) run signature/provenance verification where supported; (5) run vulnerability/security checks; (6) compare resolved identity and integrity with preflight evidence; (7) run project tests; (8) persist outcome.
**Decisions:** accept only if resolved package/version matches approval and no blocking verification failure appears.
**Constraints:** provenance confirms origin/build linkage, not absence of malicious code.
**Expected output:** installation verification record plus lockfile diff.
**Metrics:** install failures, unexpected transitive additions, signature failures, test regressions.
**Verification:** exact approved direct dependency resolved; lockfile reproducible; required checks pass.
**Failure handling:** revert generated manifest/lockfile changes or isolate them for review; do not auto-retry malicious/security failures.
**Stop conditions:** verified success, bounded technical retry exhausted, or security review required.

## Skill 3 — Dependency Incident Recovery
**Purpose:** respond when a previously approved package later becomes suspicious, yanked, deprecated, compromised, or policy-blocked.
**Trigger:** advisory, registry removal, policy update, suspicious behavior, signature/provenance failure.
**Inputs:** affected package/version, projects, lockfiles, prior decision records.
**Preconditions:** evidence preservation enabled.
**Procedure:** freeze upgrades/installs; identify exposure; preserve hashes and lockfiles; block package/version; determine safe replacement or removal; test remediation; rotate secrets only when exposure analysis warrants it; document incident and update policy/tests.
**Expected output:** containment/remediation record.
**Verification:** affected version absent from resolved graph; tests pass; policy blocks recurrence.
**Failure handling:** escalate when removal is impossible or compromise scope is unknown.
**Stop conditions:** containment verified and residual risk accepted by an authorized human.

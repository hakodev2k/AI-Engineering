# Workflows

## Workflow A — New Dependency Gate
**Trigger:** agent proposes a new package, package exec command, or version change.
**Goal:** prevent hallucinated, newly squatted, ambiguous, or disallowed-source dependencies from executing before evidence-based approval.
**Inputs:** ecosystem, package spec, business/technical reason, policy, current manifests/lockfiles.
**Baseline:** capture current direct dependencies, lockfile hash, package-manager version, and whether the dependency already exists.
**Context:** authoritative registry configuration, approved/blocked package catalog, required project capability.

### Stages
1. **Observe — Orchestrator:** classify the operation as dependency-affecting; extract ecosystem/spec and whether execution is implied.
2. **Baseline — Dependency Evidence Analyst:** record manifests/lockfile and existing dependency identity.
3. **Normalize:** canonicalize package identity. Reject unsupported or ambiguous specs.
4. **Registry evidence:** run `python scripts/dependency_guard.py --policy config/policy.json --ecosystem <npm|pypi> --spec <exact-spec>`.
5. **Decision checkpoint:**
   - exit 0 / allow: continue;
   - exit 2 / review: stop and require human approval;
   - exit 3 / deny: stop; do not install;
   - exit 4 / error: stop; one bounded technical retry permitted for transient registry failure.
6. **Restricted install — Install Controller:** execute exact approved version with safe source/script restrictions appropriate to the package manager.
7. **Post-install evidence:** capture resolved version, lockfile integrity/hashes, transitive diff, package-manager security output, tests.
8. **Independent verification:** verify approved identity equals resolved identity and all mandatory checks passed.
9. **Complete:** persist records and return verified result.

**Tools:** guard script, npm/pip, lockfile diff, `npm audit signatures` where supported, vulnerability scanners, project tests.
**Outputs:** preflight JSON, install diff, post-install evidence, verifier status.
**Checkpoints:** before any install; after dependency resolution; before final acceptance.
**Metrics:** gate coverage, blocked nonexistent packages, fresh-package reviews, unexpected transitive changes, verification failures.
**Retry policy:** registry/network technical errors: maximum 1 retry after bounded backoff; security/policy failures: 0 automatic retries.
**Stop conditions:** deny, review pending human approval, technical retry exhausted, identity mismatch, or verification complete.
**Failure path:** preserve evidence; revert or isolate generated dependency changes; do not weaken policy.
**Verification:** Independent Verifier compares proposal, decision, resolution, and checks.
**Definition of Done:** decision recorded; exact identity resolved; required lock/integrity evidence captured; security/tests pass; independent verifier says `verified`.

## Workflow B — Agent Install-Path Audit
**Trigger:** onboarding an agent/runtime, changing hooks, or discovering an unguarded install.
**Goal:** prove all dependency execution paths are intercepted.
**Inputs:** agent tool catalog, shell policy, CI files, Dockerfiles, scripts, package manifests.
**Baseline:** enumerate known install verbs (`npm install`, `npm add`, `npx`, `pnpm`, `yarn`, `bun`, `pip install`, `pipx`, generated shell scripts).
**Stages:** search repo/runtime configs -> classify direct and indirect install paths -> map each to pre-task hook -> inject deny test using a nonexistent package -> verify package manager never executes -> test a permitted known fixture -> record coverage.
**Responsible agent:** Security Reviewer; implementation may be delegated, verification must be independent.
**Outputs:** install-path coverage matrix and test evidence.
**Metrics:** percentage of install-capable paths guarded; bypass count must be zero.
**Retry policy:** maximum 2 implementation/test cycles; after two failed cycles escalate.
**Stop condition:** 100% known install paths covered or blocking gap escalated.
**Failure path:** disable autonomous installs for the uncovered path until enforcement exists.
**Definition of Done:** every identified install route is gated deterministically, including generated scripts and package-exec commands.

## Workflow C — Suspicious Dependency Recovery
**Trigger:** package becomes yanked/deprecated/blocked, provenance/signature fails, or an advisory/incident appears.
**Goal:** contain and remove unsafe dependency usage without losing evidence.
**Stages:** freeze installs -> inventory affected lockfiles -> preserve decision records/hashes -> block package/version -> assess execution/secrets exposure -> replace/remove -> rebuild lockfiles in restricted mode -> run tests/security checks -> independent verification -> close or escalate.
**Retry policy:** remediation implementation maximum 2 cycles; no retry of a known malicious install.
**Stop conditions:** affected version absent and verification passes, or unresolved risk escalated to human owner.

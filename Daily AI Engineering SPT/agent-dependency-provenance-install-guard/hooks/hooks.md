# Hooks

## Pre-Dependency-Execution Hook
**Trigger:** before any command or tool that can add/execute a package: npm/pnpm/yarn/bun install/add/exec/npx, pip/pipx install/run, manifest mutation followed by install, generated setup scripts.
**Action:** extract ecosystem/spec; require exact version where policy applies; invoke the guard; block execution unless exit code is 0.
**Command:** `python scripts/dependency_guard.py --policy config/policy.json --ecosystem npm --spec 'package@1.2.3'` or PyPI equivalent `name==1.2.3`.
**Expected result:** machine-readable allow/review/deny/error record and audit entry.
**Failure behavior:** exit 2/3/4 blocks package-manager execution. Never convert failure to warning-only.

## Pre-Install Baseline Hook
**Trigger:** immediately after preflight allow and before package-manager mutation.
**Action:** record manifest/lockfile hashes, package-manager version, working-tree status, approved package/version, and decision record path.
**Expected result:** immutable comparison baseline for post-install verification.
**Failure behavior:** do not install without baseline.

## Restricted-Install Hook
**Trigger:** package-manager execution after allow.
**Action:** enforce package-manager restrictions: disable lifecycle scripts by default; deny git/remote/file sources unless approved; use exact approved version; prefer isolated environment for first resolution.
**Expected result:** resolution occurs without running unapproved package-controlled install code.
**Failure behavior:** terminate and mark review; do not retry with weaker flags.

## Post-Install Verification Hook
**Trigger:** package-manager returns success.
**Action:** compare direct resolved identity/version to approval; inspect lockfile diff and transitive additions; run applicable signature/provenance verification (for npm, `npm audit signatures` where supported), vulnerability checks, and project tests.
**Expected result:** objective verification evidence.
**Failure behavior:** reject dependency change or escalate; preserve evidence.

## Final Completion Hook
**Trigger:** before agent reports dependency task complete.
**Action:** require preflight decision, baseline, resolved identity, lock/integrity evidence, security/test outputs, and independent verifier status.
**Expected result:** all Definition-of-Done criteria explicitly satisfied.
**Failure behavior:** task remains incomplete; no unsupported success claim.

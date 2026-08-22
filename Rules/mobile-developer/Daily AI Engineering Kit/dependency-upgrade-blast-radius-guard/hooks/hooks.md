# Hooks

## PreTask
**Trigger:** before upgrade analysis starts.

**Action:** verify the repository is a Git worktree and capture baseline status.

**Command:**
```bash
git status --short
git rev-parse --show-toplevel
```

**Failure behavior:** stop if repository root cannot be resolved. If the worktree is already dirty, record pre-existing changes and do not attribute them to the upgrade.

## PreDependencyEdit
**Trigger:** before dependency or lockfile modification.

**Action:** require a valid `upgrade-manifest.json` and approval status.

**Command:**
```bash
python scripts/verify-upgrade-manifest.py --manifest upgrade-manifest.json --preflight
```

**Failure behavior:** block dependency edits.

## PostDependencyEdit
**Trigger:** after dependency declarations/lockfiles change.

**Action:** collect deterministic diff metadata.

**Command:**
```bash
python scripts/collect-dependency-diff.py --base "${UPGRADE_BASE_REF:-HEAD~1}" --output dependency-diff.json
```

**Failure behavior:** stop verification if dependency diff cannot be produced.

## PreTest
**Trigger:** before repository-native tests.

**Action:** run restore/build commands configured for the repository and ensure no unexpected dependency delta is present.

**Failure behavior:** do not start broad test loops when restore/build fails deterministically; diagnose first.

## PostTestFailure
**Trigger:** after a failed mandatory test.

**Action:** record the failing command, test name, error signature, and whether failure is transient or deterministic.

**Failure behavior:** retry transient infrastructure failures at most twice. Deterministic failures require a changed hypothesis or code change before rerun.

## PreComplete
**Trigger:** before declaring the upgrade verified.

**Action:**
```bash
python scripts/verify-upgrade-manifest.py --manifest upgrade-manifest.json --dependency-diff dependency-diff.json
git diff --check
git status --short
```

Then verify all manifest-required build/test/runtime checks have recorded passing evidence.

**Failure behavior:** report `implemented` but not `verified`.

# Hooks

## PreTask
**Trigger:** before non-trivial change analysis starts.

**Action:** confirm repository is a Git work tree and capture clean/dirty state.

**Command:**
```bash
git rev-parse --is-inside-work-tree && git status --short
```

**Failure behavior:** stop if the repository cannot be identified. If pre-existing changes exist, record them before proceeding so they are not misattributed to the task.

## PreEdit
**Trigger:** immediately before implementation edits begin.

**Action:** validate that `impact-manifest.json` exists and passes deterministic structural checks.

**Command:**
```bash
python scripts/verify-impact-manifest.py --manifest impact-manifest.json --schema-only
```

**Failure behavior:** block editing until the manifest is corrected and reviewed.

## PostImplementation
**Trigger:** after implementation edits and before final verification.

**Action:** capture the actual changed-file set.

**Command:**
```bash
python scripts/detect-changed-files.py --base "${IMPACT_BASE_REF:-HEAD}" --output changed-files.json
```

**Failure behavior:** stop verification if changed files cannot be determined reliably.

## PreComplete
**Trigger:** before the task is reported as verified.

**Action:** reconcile actual changed files with the reviewed manifest.

**Command:**
```bash
python scripts/verify-impact-manifest.py --manifest "${IMPACT_MANIFEST:-impact-manifest.json}" --changed-files changed-files.json
```

**Failure behavior:** do not report success. Unexpected files must be explained by evidence and reflected in a re-reviewed manifest, or reverted.

## Project-specific test hook
Projects should append their native verification commands here, for example build, unit tests, integration tests, static analysis, or contract checks. Commands must be real commands already supported by the repository; this kit intentionally does not invent a universal build command.

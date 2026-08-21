# Hooks

## PreTask
**Trigger:** before repository planning or editing.

**Preconditions:** repository root and target paths known.

**Action:** discover instruction sources.

**Command:**
```bash
python scripts/scan-instructions.py --root . --policy config/instruction-policy.json --targets <target-path> --out .agent/instruction-sources.json
```

**Expected result:** exit code 0 and source manifest produced.

**Failure behavior:** block task start when a potentially applicable instruction source is unreadable or policy is invalid.

## PrePlan
**Trigger:** after normalized instruction manifest is prepared.

**Action:** validate and resolve conflicts.

**Commands:**
```bash
python scripts/validate-manifest.py .agent/instruction-manifest.json
python scripts/resolve-conflicts.py --manifest .agent/instruction-manifest.json --policy config/instruction-policy.json --out .agent/effective-instructions.json
```

**Expected result:** resolver status is `resolved` or `verified-pending-review`; no blocking conflict.

**Failure behavior:** block planning; route unresolved conflicts to reviewer/human approval.

## ScopeChange
**Trigger:** task begins editing a path outside previously verified target scope.

**Action:** rerun discovery and resolution for the new target path.

**Failure behavior:** block edits until a new effective instruction set is verified.

## PreComplete
**Trigger:** before declaring task complete.

**Action:** rerun source scan and conflict resolution, then compare source hashes to the reviewed manifest.

**Expected result:** no instruction drift and no newly applicable conflicts.

**Failure behavior:** invalidate prior verification and repeat review. This hook is blocking.

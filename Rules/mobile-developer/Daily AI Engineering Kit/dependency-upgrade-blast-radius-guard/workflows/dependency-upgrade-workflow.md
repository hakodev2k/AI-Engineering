# Workflow: Dependency Upgrade Blast-Radius Guard

## Entry condition
A specific dependency upgrade is requested and the current/target versions can be identified.

## Required inputs
- dependency name and target version;
- repository dependency files;
- current Git state;
- relevant upstream release/migration/security evidence;
- repository-native restore/build/test commands.

## Stages

### 1. Baseline
**Owner:** Upgrade Analyst

Capture current direct dependency declarations, lockfiles, relevant transitive dependencies, target framework/runtime, and existing tests.

**Artifact:** initial `upgrade-manifest.json`.

**Checkpoint:** current state is reproducible enough to rollback.

### 2. Upstream evidence
**Owner:** Upgrade Analyst

Identify breaking changes, removed/deprecated APIs, changed defaults, config changes, runtime prerequisites, transitive changes, security fixes, persistence/serialization effects, and migration actions.

**Checkpoint:** every material upstream item is either mapped to repository impact or explicitly marked not applicable.

### 3. Repository impact mapping
**Owner:** Upgrade Analyst

Trace affected symbols/configuration/entry points/tests and populate expected changed files, required checks, rollback steps, and risk level.

### 4. Independent risk review
**Owner:** Upgrade Risk Reviewer

Decision:
- `approved` → continue;
- `revise` → return to stages 2–3;
- `human-approval-required` → stop.

**Retry rule:** at most two analyst-review revision cycles. A third unresolved gap stops the workflow.

### 5. Approval gate
Human approval is mandatory when the manifest indicates:
- major breaking API/contract change;
- database/schema/data migration;
- authentication/authorization/security-control change;
- production configuration/infrastructure change;
- multi-application runtime/framework target change;
- large dependency replacement or more than one major-version jump.

### 6. Implementation
**Owner:** Implementation Agent or primary coding agent

Apply only dependency and compatibility changes declared by the manifest. Avoid unrelated refactoring.

**Artifacts:** dependency-file changes, minimal compatibility edits, new/updated regression tests.

### 7. Deterministic dependency diff
Run:
```bash
python scripts/collect-dependency-diff.py --base <base-ref> --output dependency-diff.json
```

Unexpected dependency files or version declarations return the workflow to analysis before further edits.

### 8. Build and test
Run repository-native restore/build/static analysis and tests listed in the manifest. Add contract/runtime checks where upstream behavior changed.

**Retry rule:** retry transient infrastructure failures at most twice. Do not retry deterministic code/test failures without changing the hypothesis or implementation.

### 9. Independent verification
Use `skills/upgrade-verification.md` and:
```bash
python scripts/verify-upgrade-manifest.py --manifest upgrade-manifest.json --dependency-diff dependency-diff.json
```

### 10. Completion
Record two independent statuses:
- `implemented`: dependency and compatibility edits exist;
- `verified`: all mandatory evidence passes.

## Failure and recovery
- Missing upstream evidence: retry alternate authoritative source once; otherwise stop high-risk upgrades.
- Unexpected transitive package: return to analysis and review.
- Build/test regression: isolate compatibility change; rollback if the causal path cannot be proven after two focused fix attempts.
- Manifest/diff mismatch: do not waive automatically; either update analysis with evidence or revert unexpected change.
- Approval missing: stop before dangerous action.

## Stop conditions
Stop when:
- target version is not explicit;
- rollback is unsafe or unknown;
- same deterministic failure persists after two focused fix attempts;
- reviewer still finds material unresolved risk after two revisions;
- required human approval is absent.

## Definition of Done
The upgrade is done only when:
1. manifest validates;
2. actual dependency delta matches intent;
3. no unrelated edits remain;
4. restore/build succeed;
5. required tests and runtime/contract checks pass;
6. approvals are recorded;
7. rollback steps are valid;
8. unresolved risks are explicitly documented;
9. final status is `verified`, not merely `implemented`.

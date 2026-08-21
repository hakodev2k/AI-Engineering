# Integration Guide

## Integration goal

Place workspace freshness checks at orchestration boundaries rather than relying on the model to remember that previously-read state may be stale.

## 1. Choose tracked dependencies

At planning time, identify files whose contents materially support the plan. Prefer explicit paths for critical code/config plus selected lockfiles, schemas, project files, and generated contracts. Do not hash the entire repository by default.

Example:

```bash
python scripts/workspace_guard.py capture \
  --root . \
  --snapshot .agent-state/auth-plan.json \
  --files src/Auth/AuthHandler.cs src/Auth/AuthOptions.cs src/App/App.csproj
```

The snapshot stores hashes and workspace metadata, not source contents.

## 2. Bind the plan to the snapshot

Persist the snapshot path/ID alongside the plan. Assumptions and verification records should declare the paths they depend on; `examples/assumption-registry.json` shows a minimal representation.

## 3. Gate resume and mutation

Before the first mutation after planning or resume:

```bash
python scripts/workspace_guard.py check \
  --root . \
  --snapshot .agent-state/auth-plan.json \
  --policy config/policy.json
```

Exit codes:

- `0`: `none` or policy-allowed `non-impacting` drift; protected action may proceed.
- `10`: `revalidation-required`; reread changed dependencies and repair affected plan/evidence.
- `20`: `hard-stop`; do not mutate.
- `30`: guard execution/configuration failure; fail closed for protected actions.

Integrate this command into every mutation path available to the agent: editor tools, patch application, shell redirection, code generators, formatters with write mode, and repository automation. Hooking only `Edit`/`Write` is insufficient when alternate tools can mutate files.

## 4. Handle revalidation-required

Parse the JSON drift report. Intersect changed paths with the assumption/evidence dependency registry. Mark intersecting records stale, reread the changed files, repair only affected plan steps, rerun invalidated verification, then capture a new snapshot.

Do not replace the old snapshot. Retain it with the drift report for auditability.

## 5. Handle branch and HEAD drift

Default policy hard-stops branch changes because branch identity changes task intent and merge target. HEAD changes require revalidation by default but can be promoted to hard-stop for repositories with strict history control.

If your orchestrator intentionally rebases or merges during execution, make that transition explicit: complete the operation, re-evaluate the plan against the new tree, capture a new snapshot, then resume.

## 6. Bind test evidence

Store test/build evidence with:

- command
- completion time
- snapshot ID
- dependency paths
- status (`fresh`, `stale`, `failed`)

When drift changes any declared dependency, evidence becomes stale even if its raw output still exists. Rerun only the affected verification rather than every test suite.

## 7. Resume integration

When a thread resumes after pause, disconnect, compaction, or handoff, execute the drift check before interpreting instructions such as `continue` or `implement the plan`. A model summary is not a freshness proof.

## 8. Final completion integration

After the last source mutation:

1. Run required verification.
2. Capture/check the final workspace state.
3. Confirm evidence dependencies remain unchanged.
4. Emit `Verified` only after the final freshness gate passes.

If build/test commands generate tracked files, include those mutations in the workflow and take the final snapshot afterward.

## 9. Policy tuning

`config/policy.json` provides safe defaults. Common adjustments:

- Set `hard_stop_on_head_change=true` for release/security-critical workflows.
- Reduce `max_tracked_files` when hashing overhead is excessive, but require explicit dependency selection rather than silent truncation.
- Lower verification TTL for rapidly changing or multi-agent workspaces.
- Add repository-specific dependency rules in your orchestration layer.

## 10. CI and agent harness usage

Run the included benchmark and tests:

```bash
python scripts/drift_benchmark.py
python -m unittest tests/test_workspace_guard.py -v
```

For CI, use the guard around long-lived generated plans or staged autonomous workflows. For interactive IDE agents, execute it at pause/resume and immediately before patch application.

## Failure handling

- Snapshot missing/corrupt: stop protected work and recapture only after re-establishing plan dependencies.
- Repository root mismatch: hard-stop.
- Branch mismatch: hard-stop by default.
- Tracked file missing: hard-stop by default.
- Tracked file/HEAD changed: bounded scoped revalidation.
- Revalidation fails twice because workspace keeps changing: stop and escalate instead of looping.

## Security and safety

The scripts are read-only with respect to source files. Snapshot writes are restricted to the requested snapshot path and contain hashes/metadata only. Do not store secrets or source contents in assumption registries. This package does not replace OS sandboxing, worktree isolation, permissions, or source-control review; it adds freshness and reasoning integrity across observation/action gaps.

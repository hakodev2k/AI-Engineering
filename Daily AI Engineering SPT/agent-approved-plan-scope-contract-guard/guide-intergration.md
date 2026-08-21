# Integration Guide

## Integration goal
Insert a task-level scope contract between **plan approval** and **mutation**, then enforce that contract again at every mutation boundary and before completion. The package is harness-agnostic: Codex, Claude Code, custom agents, CI bots, and multi-agent orchestrators can use the same contract format.

## 1. Choose the enforcement boundary
The strongest integration point is outside the model, in the host/tool dispatcher. Intercept all mutation-capable surfaces:
- file Edit/Write/Delete/Rename tools;
- patch/apply-patch tools;
- shell commands that can write;
- package/dependency managers;
- migration/deploy helpers;
- IDE or MCP tools capable of mutation;
- subagent delegated writes.

Do not protect only one editing tool and assume the workspace is safe.

## 2. Compile the approved plan
After explicit approval:
1. Capture `git rev-parse HEAD` and dirty state.
2. Create `plan-contract.json` conforming to `config/plan-contract.schema.json`.
3. Keep paths narrow. Example: `src/pricing/**` rather than `src/**`.
4. Record explicit forbidden paths and out-of-scope concerns.
5. Record operation classes. A plan that only needs edit/test should not implicitly allow delete, dependency-change, network, or deploy.
6. Hash the canonical contract without `contract_id`, then set `contract_id` to the hex SHA-256 (or `sha256:<hex>`).
7. Bind the approval event to that exact ID/version.

Freeze it:
```bash
python scripts/plan_scope_guard.py freeze \
  --contract plan-contract.json \
  --repo . \
  --snapshot .plan-guard/baseline.json
```

## 3. Gate each mutation
Before a mutating tool executes, classify the operation and target paths, then call:
```bash
python scripts/plan_scope_guard.py check \
  --contract plan-contract.json \
  --repo . \
  --operation edit \
  --path src/pricing/PriceService.cs
```
Exit 0 means path/operation scope is authorized. Exit 3 means deny and route to the deviation workflow. Input/runtime errors also fail closed.

For shell commands, the host should parse or sandbox the command sufficiently to determine mutation targets. If targets cannot be known safely, require an explicit broader contract entry or deny the mutation; do not guess.

## 4. Handle delegation
Every child agent receives:
- active contract ID/version;
- delegated subset of allowed paths/operations;
- acceptance criteria it owns;
- explicit statement that it cannot amend or self-approve the parent contract.

The parent validates returned changes cumulatively. A child completion summary is not authorization evidence.

## 5. Handle tool failure without drift
Use `workflows/workflows.md` Workflow B. Up to two retries of the same mechanism are permitted only if both remain inside the current contract. A workaround that introduces another subsystem, dependency, migration, architecture path, destructive operation, or unplanned file requires a versioned amendment.

An amendment must state:
- observed failure;
- minimal proposed deviation;
- added/removed paths and operations;
- changed risks/invariants/criteria;
- reason the original contract cannot complete;
- parent contract ID.

No approval means no material deviation.

## 6. Revalidate at checkpoints
After compaction/resume, delegated work, a major implementation stage, or workspace drift, run:
```bash
python scripts/plan_scope_guard.py verify \
  --contract plan-contract.json \
  --repo . \
  --snapshot .plan-guard/baseline.json --json
```
This catches cumulative scope drift even if individual actions appeared reasonable.

## 7. Completion gate
Before claiming success:
1. Join/stop all mutating workers.
2. Run scope verification.
3. Run project tests/build.
4. Map every acceptance criterion to evidence.
5. Confirm invariants and forbidden scope.
6. Require an independent verifier for material/high-risk changes.

Only label **Verified** when changed-path explanation ratio and acceptance-criterion coverage are both 100% with zero unresolved invariant/scope violations.

## Integration patterns
### Claude Code hooks
Use plan acceptance/transition as the freeze point when available. Use `PreToolUse` for mutation tools, but remember advisory context is weaker than host-level deny. If caller identity is unavailable, enforce the parent contract uniformly rather than relying on actor-specific exemptions.

### Codex/custom tool router
Place the guard in the central tool dispatch path so `apply_patch`, exec commands, MCP write tools, and delegated operations cannot bypass it. Preserve contract ID across compaction/resume.

### CI
Run final `verify` plus tests as a required job. Store plan-contract and verification evidence as build artifacts. CI is a backstop, not a replacement for pre-mutation gating.

## Customization
Extend the contract schema with repository-specific operation classes or semantic boundaries, but keep default-deny semantics. For monorepos, generate per-workstream delegated subsets while retaining one parent contract. For database or cloud workflows, add resource identifiers alongside file paths and implement equivalent deterministic guards.
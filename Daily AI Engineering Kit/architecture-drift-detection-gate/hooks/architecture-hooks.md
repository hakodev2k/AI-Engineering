# Architecture Hooks

Hooks are lifecycle adapters. Map these events to your AI tool, CI system, or local workflow. Prefer deterministic scripts where possible.

## PreTask

**Trigger:** before architecture-sensitive work starts.

**Action:** locate `.architecture-policy.json`, validate it, and identify whether affected files belong to mapped modules.

**Command:**

```bash
python scripts/validate-architecture-policy.py --policy "${ARCHITECTURE_POLICY:-.architecture-policy.json}"
```

**Failure behavior:** block architecture verification. One configuration repair attempt is allowed.

## PostPlan

**Trigger:** after implementation plan is drafted.

**Action:** require the plan to list affected modules, expected new dependency edges, and any architecture-change/exception request.

**Command:** semantic agent check; no deterministic command can reliably infer responsibility intent.

**Failure behavior:** return plan for revision before edits begin.

## PreEdit

**Trigger:** immediately before editing a file in a mapped module.

**Action:** confirm the target module and its allowed dependencies are known.

**Command:** policy lookup or lightweight checker invocation on the target path.

**Failure behavior:** if module mapping is unknown, stop for targeted Architecture Mapper discovery.

## PostEdit

**Trigger:** after a batch of file modifications.

**Action:** run boundary scan against changed/affected files.

**Command:**

```bash
python scripts/check-import-boundaries.py \
  --policy "${ARCHITECTURE_POLICY:-.architecture-policy.json}" \
  --root . \
  --files <changed-files>
```

**Failure behavior:** return violations to Drift Analysis; maximum two automatic fix/rescan rounds.

## PreDependencyChange

**Trigger:** before adding a project/package/module dependency.

**Action:** classify source and target modules and compare the proposed edge with `allowed_dependencies` and ADR evidence.

**Command:** policy lookup plus semantic review.

**Failure behavior:** block if the edge is forbidden or unknown. A new direction requires explicit human approval.

## PreArchitectureException

**Trigger:** before adding an exception to policy.

**Action:** require scope, owner, reason, and expiry/review date; require human approval for long-lived or policy-weakening exceptions.

**Command:** policy validator after editing the exception record.

**Failure behavior:** reject broad, ownerless, reasonless, or expired exceptions.

## PostImplementation

**Trigger:** when requested implementation is functionally complete.

**Action:** run normal build/tests and the architecture scan separately.

**Command:** repository-specific build/test command plus:

```bash
python scripts/check-import-boundaries.py \
  --policy "${ARCHITECTURE_POLICY:-.architecture-policy.json}" \
  --root .
```

**Failure behavior:** do not claim architecture verification; route semantic findings to Drift Reviewer.

## PreComplete

**Trigger:** before final success response, commit, or merge-ready claim.

**Action:** validate policy, scan final state, ensure reviewer status is `pass`, confirm exceptions are valid, and confirm no unreviewed changes occurred after the last scan.

**Commands:**

```bash
python scripts/validate-architecture-policy.py --policy "${ARCHITECTURE_POLICY:-.architecture-policy.json}"
python scripts/check-import-boundaries.py --policy "${ARCHITECTURE_POLICY:-.architecture-policy.json}" --root .
```

**Failure behavior:** block `architecture verified`. Report `completed but not architecture verified` when implementation exists but the gate fails.

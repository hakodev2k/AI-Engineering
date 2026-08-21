# Workflow: Preflight, Rebind, Verify

## Trigger
Switching an existing session between Windows-native and WSL, or rebinding a session to a project with a different path namespace.

## Goal
Migrate environment-specific state without widening filesystem authority or leaving stale policy bindings.

## Inputs
Source state export, source/destination environment, explicit mappings, approved destination roots, protected roots.

## Baseline
Inventory all `cwd`, workspace, writable, sandbox, permission, visualization, and host-skill paths before any mutation.

## Stages
1. **Observe** — Migration Auditor records all path-bearing security state.
2. **Diagnose** — classify source-native, destination-native, mixed, unmapped, and outside-approved paths.
3. **Form mapping** — map only explicitly established drive/project identities.
4. **Stage** — create backup and transform a copy/transaction; regenerate destination permission structures rather than blindly copying incompatible policy objects.
5. **Audit staged state** — deterministic gate must pass.
6. **Independent verify** — Security Verifier confirms authority is preserved or narrowed and stores converge.
7. **Commit** — only after verification; retain rollback until smoke test passes.
8. **Smoke test** — resume session with read-only operation inside project and denied probe outside approved roots.

## Checkpoints
Baseline inventory; backup confirmed; staged audit; independent verification; post-commit smoke test.

## Metrics
Mixed paths, unmapped paths, outside-approved roots, cross-store mismatches, policy-root delta, denied-outside-root test result, rollback count.

## Retry policy
One corrected migration retry maximum. No automatic retry after permission broadening or unknown mapping.

## Stop conditions
Active writer, missing backup, ambiguous mapping, outside-root permission, store mismatch, failed denied-access smoke test, or second failure.

## Failure path
Abort transaction or restore backup, preserve audit evidence, keep old environment binding, and escalate mapping/schema incompatibility.

## Verification
The implementing component cannot be the sole verifier. Effective destination permissions must be no broader than the approved root set.

## Definition of Done
Backup exists; all security paths mapped; staged audit passes; independent verifier passes; commit succeeds; inside-root operation works; outside-root operation remains denied; no stale mixed-namespace state remains.
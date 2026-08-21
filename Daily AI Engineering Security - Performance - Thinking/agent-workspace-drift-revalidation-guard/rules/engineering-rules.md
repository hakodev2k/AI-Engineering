# Engineering Rules

## MUST

- MUST bind every non-trivial plan to a trusted workspace snapshot ID before mutation begins.
- MUST record branch and HEAD when Git metadata is available.
- MUST hash explicitly tracked critical files; mtime alone is insufficient proof of freshness.
- MUST run a drift check before resume, protected writes, reuse of cached verification, and final completion.
- MUST classify branch/root identity changes as blocking when policy says so.
- MUST invalidate test/build evidence when any declared dependency changes.
- MUST reread changed relevant files before repairing a stale plan.
- MUST preserve the old snapshot as evidence; revalidation creates a new snapshot rather than mutating history.
- MUST keep automatic revalidation retries bounded.
- MUST distinguish `Implemented`, `Measured`, and `Verified`.
- MUST fail closed when freshness cannot be established for a protected action.
- MUST emit machine-readable drift details for hooks and orchestration.

## MUST NOT

- MUST NOT treat model context as current merely because the file was previously read.
- MUST NOT silently overwrite a newer workspace snapshot with a new baseline after drift.
- MUST NOT reuse test results whose dependencies are stale.
- MUST NOT continue a stale plan across a prohibited branch/root change.
- MUST NOT use `git status` alone as proof that tracked file content is unchanged.
- MUST NOT automatically resolve semantic conflicts by last-writer-wins.
- MUST NOT retry a failed stale patch without rereading/revalidating the affected state.
- MUST NOT claim verification if the final drift check was executed before the last mutation.
- MUST NOT drop tracked files because of policy limits without surfacing the loss of coverage.

## SHOULD

- SHOULD scope tracking to files and artifacts that materially support the plan to avoid full-repository hashing.
- SHOULD include lockfiles, schemas, project files, generated API contracts, migrations, and configuration when they influence the planned work.
- SHOULD bind each assumption and verification result to explicit dependency paths where practical.
- SHOULD use content hashes for critical files and Git object identity for committed state.
- SHOULD rerun only verification invalidated by changed dependencies.
- SHOULD capture a fresh trusted state after successful scoped revalidation.
- SHOULD expose drift telemetry: classification counts, revalidation latency, blocked stale writes, and stale-evidence reuse attempts.
- SHOULD require an independent verifier when drift repair changes public behavior, schema, security boundaries, or deployment configuration.

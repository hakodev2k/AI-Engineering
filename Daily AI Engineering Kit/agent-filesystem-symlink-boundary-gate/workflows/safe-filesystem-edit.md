# Workflow: Safe Filesystem Edit

## Trigger
An agent or automation will create, edit, rename, generate, or bulk-modify repository files.

## Entry conditions
Trusted workspace root and intended edit scope are known.

## Stages
1. **Pre-task** — canonicalize root and run full boundary audit.
2. **Explore** — Boundary Explorer maps links affecting task paths.
3. **Plan** — enumerate exact write/rename destinations.
4. **Pre-write gate** — validate every planned path.
5. **Approval checkpoint** — stop if task requires boundary widening, link replacement, external edit, permission/mount change, or other dangerous action.
6. **Execute** — implementation owner makes only validated edits.
7. **Post-edit checks** — run relevant format/build/tests and collect changed files.
8. **Final boundary scan** — scan all existing workspace paths.
9. **Verify** — independent Verification Agent checks reports, diff, approvals, and host evidence.
10. **Complete** — only when Definition of Done passes.

## Produced artifacts
Pre-task scan, planned-path list, pre-write report, changed-file list, final scan, host test/build output, verification record.

## Retry rules
- transient metadata/tool error: maximum 2 retries;
- path topology changed between check and write: maximum 2 revalidation attempts;
- permission failure: no automatic escalation;
- approval failure: stop;
- repeated escape: stop and preserve evidence.

## Failure paths
Boundary failure blocks write. Unexpected changed file blocks completion. A changed root invalidates previous evidence and restarts the workflow.

## Definition of Done
Trusted root unchanged or explicitly re-approved; every write validated; final scan passes; no unexpected changes exist; relevant host checks pass; independent verifier returns `verified`; no blocking approval remains.
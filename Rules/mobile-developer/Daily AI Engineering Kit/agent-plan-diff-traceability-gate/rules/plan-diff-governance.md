# Plan–Diff Governance Rules

## MUST

- Capture and freeze the implementation plan before editing begins.
- Give every plan item a stable ID, intent, acceptance criteria, allowed path patterns, and risk classification.
- Bind every changed file to at least one valid plan item before final verification.
- Explain why each changed file exists and which acceptance criterion it supports.
- Recompute the plan fingerprint after any plan edit; previous validation/review becomes stale immediately.
- Mark every plan item as `implemented`, `not-needed`, `blocked`, or `pending` and provide evidence for `implemented` items.
- Treat changed paths outside a plan item's `allowed_paths` as a blocking scope violation.
- Require explicit human approval before production deployment, destructive SQL, schema change, data/file deletion, force push/history rewriting, infrastructure change, secret change, production configuration change, breaking API change, security weakening, irreversible migration, or large dependency upgrade.
- Require an independent reviewer for high/critical-risk work; the implementing actor cannot be the sole verifier.
- Preserve validation errors, review findings, plan fingerprint, manifest fingerprint, base revision, and head revision as evidence.
- Distinguish execution from verification. A generated diff is only executed work until traceability and required tests/reviews are verified.

## MUST NOT

- Add a file to the manifest with an invented plan mapping just to satisfy the gate.
- Expand `allowed_paths` after implementation merely to legitimize an already-created out-of-scope change without explicit replanning.
- Treat formatting, generated artifacts, snapshots, lockfiles, migrations, or configuration as implicitly exempt from traceability.
- Reuse a review after plan or manifest fingerprints change.
- Mark a plan item `not-needed` without a concrete reason/evidence.
- Silently drop an unplanned file from the manifest while it remains in the actual diff.
- Use a permission failure as justification to silently widen scope or privileges.
- Retry validation/business-rule failures. Retry only transient I/O/tool failures and only up to the configured maximum.
- Force-push or rewrite history to make the gate pass.

## SHOULD

- Keep plan items small enough that each changed file has a clear primary owner item.
- Prefer acceptance criteria that can be proven by tests, build output, contracts, static checks, or reproducible commands.
- Separate mechanical generated changes from semantic changes, but map both.
- Replan when the implementation discovers materially new work instead of accumulating exceptions.
- Review deleted/renamed files explicitly because their impact is often underrepresented in line-oriented summaries.

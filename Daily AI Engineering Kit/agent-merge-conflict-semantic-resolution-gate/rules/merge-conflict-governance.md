# Merge Conflict Governance

## MUST
- Inventory every conflict before resolution and bind evidence to the exact repository revision.
- Capture side signatures before editing conflicted hunks.
- Record one explicit resolution decision per conflict ID with rationale, preserved-side declaration, and targeted checks.
- Recreate inventory when integration state or conflict set changes.
- Run deterministic marker/signature evaluation before final verification.
- Preserve build/test output for the exact resolved revision.
- Require independent review for high/critical conflicts.
- Require explicit human approval before production deployment, destructive SQL, database schema change, data/file deletion, force push/history rewrite, infrastructure/secret/production configuration changes, breaking API changes, security weakening, irreversible migrations, or large dependency upgrades.
- Use least privilege and bounded retries.

## MUST NOT
- Resolve all conflicts using blanket `ours`, `theirs`, `checkout --ours`, `checkout --theirs`, or strategy flags without conflict-specific evidence.
- Treat absence of Git conflict markers as semantic correctness.
- Delete one side's behavior silently.
- Modify unrelated files merely to make tests pass.
- Reuse an inventory, report, or review whose fingerprint/revision no longer matches.
- Let review override deterministic blockers.
- Let the implementing actor self-review high/critical resolution when policy forbids it.
- Force push or rewrite history without explicit human approval.
- Retry failing resolution/test loops indefinitely.

## SHOULD
- Inspect commits or PR intent for both sides when repository evidence is ambiguous.
- Prefer targeted tests around affected behavior before broad test suites.
- Preserve both sides when their behaviors are complementary and compatible.
- Keep conflict resolution changes separate from opportunistic refactors.
- Document remaining uncertainty and owner decisions.

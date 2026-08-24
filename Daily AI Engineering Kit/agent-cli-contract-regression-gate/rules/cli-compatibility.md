# CLI Compatibility Rules

## MUST

- Capture the current public CLI contract before changing commands, options, positionals, defaults, choices, environment fallbacks, or documented exit codes.
- Generate a candidate contract from the changed implementation before merge.
- Run `scripts/compare_cli_contract.py` against the reviewed baseline.
- Treat comparator exit code `2` as blocking unless every breaking finding has explicit human approval and migration evidence.
- Preserve comparator output with build/test evidence.
- Re-run the comparator after any further CLI change.
- Verify actual CLI behavior independently from the implementing agent for approved breaking changes.

## MUST NOT

- Update the baseline merely to make a breaking candidate pass.
- Remove or rename public commands/options without explicit approval.
- Make an optional public option or positional required without explicit approval.
- Narrow accepted values or silently change defaults without review.
- Claim compatibility from compilation or unit tests alone.
- Change production deployment, destructive operations, secrets, infrastructure, database schema, or other high-risk behavior while resolving a CLI regression unless separately approved.

## SHOULD

- Prefer additive options and commands.
- Keep deprecated names as aliases during a migration window where feasible.
- Add repository-native tests that assert help text, parser behavior, and exit codes.
- Record migration notes when an approved break affects scripts or CI automation.
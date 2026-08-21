# Configuration Safety Rules

## MUST
- Parse every in-scope changed config before claiming verification.
- Compare key paths and types against an approved baseline.
- Preserve evidence without configuration values.
- Run affected consumer tests after an intentional contract change.
- Require explicit human approval before replacing a baseline for removed keys, type changes, production config changes, secret changes, or breaking contracts.
- Keep tool permissions read-only except for repository-local report/baseline generation.

## MUST NOT
- Print, commit, summarize, or transmit secret values.
- Treat a generated baseline as approval of a breaking change.
- Modify production configuration, secret stores, infrastructure, or deployment targets.
- Suppress a parse error to make the gate pass.
- Increase permissions when a scan fails.
- Mark execution as verified when required tests were not run.

## SHOULD
- Keep config contracts backward compatible.
- Scope globs narrowly enough to avoid vendor/build output.
- Review sensitive-looking new key names for secret-handling risk.
- Commit baseline updates in the same reviewed change that intentionally changes the contract.

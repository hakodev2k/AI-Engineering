# Environment Contract Rules

## MUST

- Every environment variable read by production code must be declared in `config/env-contract.json` unless explicitly excluded by repository policy.
- Update the contract and sample configuration in the same change that introduces, renames, removes, or constrains a variable.
- Run `scripts/check_env_contract.py` for every target environment affected by a configuration change.
- Mark credential/token/password/connection-secret variables with `secret: true`.
- Use placeholders rather than usable credentials in committed sample files.
- Treat validator exit codes other than `0` as blocking.
- Require explicit human approval before changing production values, rotating secrets, weakening production-required variables, deployment, or infrastructure configuration.

## MUST NOT

- Commit real credentials to sample files, tests, examples, logs, or reports.
- Remove a production requirement merely to make CI pass without evidence that the application no longer needs it.
- Silently accept undocumented variables when `allow_undocumented` is false.
- Print secret values during validation or agent reporting.
- Rename environment variables without checking all code, tests, deployment manifests, CI definitions, and operational documentation that reference them.
- Treat successful validation as proof that external services or credentials themselves are valid.

## SHOULD

- Prefer startup-time validation in the application in addition to this repository gate.
- Keep allowed-value sets narrow and use regex only when a finite enum is not suitable.
- Avoid optional variables whose absence materially changes security behavior; make such variables explicit and required where practical.
- Add regression tests whenever a production configuration incident reveals a missing contract rule.
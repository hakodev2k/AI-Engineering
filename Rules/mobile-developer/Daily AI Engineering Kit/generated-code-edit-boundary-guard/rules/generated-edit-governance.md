# Generated Edit Governance

## MUST
- Classify every planned edit target as `source`, `generated`, `vendor`, `derived`, or `unknown` before modifying it.
- Preserve evidence for generated markers, source-of-truth, generator command, and current hashes.
- Change generated behavior through the authoritative source when one exists.
- Regenerate with the documented command and inspect the resulting diff.
- Require an independent reviewer when generated or vendor surfaces changed.
- Require explicit human approval for direct generated-file exceptions, vendor patching, generator/version changes, destructive regeneration, public contract breakage, production configuration changes, or irreversible migrations.
- Treat `unknown` ownership as blocking.
- Preserve unrelated pre-existing changes.

## MUST NOT
- Hand-edit files marked `do not edit`, `auto-generated`, generated-by-tool, or matching protected patterns unless an approved exception explicitly names the path and reason.
- Silence the guard by deleting generated markers, changing policy patterns, or moving a file to escape classification.
- Modify `obj/`, `bin/`, `node_modules/`, vendored third-party source, compiled assets, generated SDKs, or checked-in build outputs as a shortcut.
- Claim verification because generation completed; build/tests/diff review are separate evidence.
- Retry generator failures indefinitely. Maximum automatic retry: 1 for transient tool/environment failures only.
- Upgrade generators or dependencies merely to make regeneration succeed.
- Let the implementing agent be the only verifier for an exception.

## SHOULD
- Prefer deterministic generators and pinned tool versions.
- Keep source and generated output changes in the same reviewable change when generated artifacts are intentionally checked in.
- Minimize regenerated scope and investigate unrelated churn.
- Record generator version and command in the manifest when available.
- Prefer repository-native generation commands over ad-hoc local commands.

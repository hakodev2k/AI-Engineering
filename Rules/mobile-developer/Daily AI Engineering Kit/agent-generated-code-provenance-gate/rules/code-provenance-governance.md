# Rules: Agent-Generated Code Provenance Governance

## MUST
- Record the task id, baseline ref, allowed scope, changed paths, rationale, evidence references, and verification obligations.
- Recompute the diff before final verification; do not trust a stale manifest.
- Map every material changed path to at least one requirement or evidence item.
- Treat deletion, dependency changes, public API changes, security changes, migrations, infrastructure changes, and production configuration changes as high risk.
- Require an independent reviewer for high-risk changes.
- Preserve the first failing verification output before any retry.
- Use bounded retries: maximum 2 verification reruns, and only after an identified transient/environment correction.
- Require explicit human approval before destructive, production, irreversible, security-weakening, breaking-contract, or history-rewriting actions.
- Keep `implemented` and `verified` as separate states.

## MUST NOT
- Do not claim a change is requirement-driven without a traceable requirement/evidence id.
- Do not hide incidental changes inside a broad rationale such as "cleanup".
- Do not widen allowed scope automatically to accommodate an unexpected diff.
- Do not let the implementation agent be the sole verifier of a high-risk diff.
- Do not mark tests as passed when they were skipped, unavailable, flaky, or not run.
- Do not discard unexplained changes to make the gate pass without recording why they were reverted.
- Do not expose secrets, credentials, tokens, private keys, or sensitive values in provenance artifacts.
- Do not auto-approve dangerous changes.

## SHOULD
- Prefer atomic requirement ids and focused diffs.
- Separate generated artifacts from hand-edited code.
- Use deterministic scripts for changed-path inventory and policy checks.
- Record unresolved risks explicitly.
- Prefer evidence close to the repository: tests, contracts, logs, build output, configuration, and official requirements.
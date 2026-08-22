# Completion Claim Rules

- An agent MUST NOT state `done`, `verified`, `tests pass`, `build passes`, or equivalent unless required evidence exists for the current tree.
- Evidence MUST contain check ID, exact command, tree SHA, start/end timestamp, exit code, output digest, and log/artifact path.
- Evidence older than the configured maximum age MUST be rejected unless the tree and relevant environment are provably unchanged and policy explicitly permits reuse.
- A required check with nonzero exit code MUST block completion.
- The implementing agent MUST NOT be the only verifier for high-risk changes.
- The agent MUST NOT bypass repository verification using `--no-verify`, disabled hooks, swallowed exit codes, or equivalent mechanisms unless the user explicitly authorizes the bypass and the final independent checks still run.
- Shell pipelines used as evidence MUST preserve the real verifier exit status.
- Intermediate verification SHOULD use the narrowest contract-approved check that covers the change.
- The same expensive full suite SHOULD NOT run repeatedly on an unchanged tree.
- Scope growth MUST trigger risk reclassification.
- Fix/verify loops MUST stop after the configured maximum attempts.
- Missing canonical verification MUST be reported as BLOCKED/UNVERIFIED, never converted into confidence language.
- Dangerous or irreversible actions MUST require explicit human approval.
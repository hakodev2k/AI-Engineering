# Permission Policy Rules

## MUST
- Treat configured permission intent and runtime enforcement as separate facts.
- Run harmless canaries after host/version/mode/config changes before unattended operation.
- Test every surface used in production automation independently.
- Block autonomy on any fail-open or unknown result.
- Preserve evidence containing host version, mode, expected decision, observed decision, prompt presence, and execution state.
- Use deterministic `deny` for actions that must never occur autonomously when `ask` enforcement is uncertain.
- Keep probe actions confined to disposable local state.

## MUST NOT
- Infer that an `ask` rule works because it appears in a settings UI.
- Use a real destructive command, production deployment, credential, push, deletion, database mutation, or external message as a permission probe.
- Treat sandboxing as proof that approval semantics work.
- Enable broad auto-approval after a failed canary.
- Ignore surface-specific differences.
- retry a dangerous command to test whether a prompt appears.

## SHOULD
- Maintain a small versioned canary matrix in CI or agent bootstrap checks.
- Revalidate after upgrades and plugin/extension changes.
- Prefer fail-closed behavior for high-impact actions.
- Track canary age and refuse stale attestations for long-lived environments.
- Separate safety failures (`FAIL_OPEN`) from availability failures (`FAIL_CLOSED`).
# Integration Guide

## 1. Add the package
Copy this directory into your engineering-agent controls repository or reference it from your orchestration layer. Python 3.10+ is sufficient for the included scanner; it uses only the standard library.

## 2. Configure the policy
Start from `config/policy.json`.

Keep `nested_root_allowlist` empty initially. Run the scanner, review each nested root, then add only intentionally trusted paths. An allowlisted root is not permission to modify all metadata inside it; metadata writes remain separately approval-gated.

Recommended defaults:
- `fail_on_unknown_nested_root=true`
- `fail_on_nested_git_hooks=true`
- `fail_on_child_agent_settings=true`
- `require_parent_policy_attestation=true`

Do not add broad patterns such as `vendor/**` or `**/.git` to an allowlist. Use exact normalized relative root paths.

## 3. Establish the parent security contract
Before a task begins, normalize the parent restrictions that must survive re-rooting:
- sandbox enabled/disabled state;
- filesystem read/write boundaries;
- network allow/deny policy;
- approval policy;
- allowed/forbidden tools and commands;
- hook trust policy;
- sensitive metadata write restrictions.

Give the contract an immutable task-local ID or hash. Child-root attestations reference that ID.

## 4. Run pre-task inventory
From this package directory:

```bash
python3 scripts/nested_trust_guard.py \
  --root /path/to/workspace \
  --policy config/policy.json \
  --output /tmp/nested-trust-report.json
```

Exit codes:
- `0`: no configured violation;
- `2`: boundary/policy violation;
- `3`: invalid input/policy;
- `4`: scan failure.

The report contains paths and metadata categories, not file contents or secrets.

## 5. Wire orchestration checkpoints
### Before delegation / cwd re-root
Resolve the target child root and require a current report entry. Compare its effective security behavior to the parent contract. Automatic delegation is permitted only when child controls are provably equivalent or stricter.

### Before nested control-metadata writes
Intercept writes under nested `.git`, `.claude`, `.codex`, `.agents`. Require exact human approval for hook/config/policy changes. Approval should record task, root, exact paths, action and reason.

### Before privileged Git operations
If Git will execute outside the agent sandbox, inspect the report for active nested hooks. Do not run the privileged Git operation until those hooks are explicitly trusted for the target root.

### After topology-affecting changes
Re-run the scanner after adding/updating submodules, vendored repositories, fixtures, examples, agent settings, or generated nested repositories.

## 6. Parent/child policy comparison
The included scanner discovers boundary candidates; host-specific settings merge semantics differ, so policy comparison is deliberately explicit rather than guessed.

Represent each security field as one of:
- `same`
- `stronger`
- `weaker`
- `unknown`

Any `weaker` or `unknown` security-relevant field blocks automatic delegation. Missing child fields are **not** automatically treated as inherited unless the host documentation/runtime proves that behavior.

## 7. CI/pre-commit integration
Use the scanner as a non-mutating check when repository topology changes. Example:

```bash
python3 scripts/nested_trust_guard.py --root . --policy config/policy.json >/tmp/nested-trust.json
```

Do not make the scanner itself install hooks. Security controls should not create the persistence surface they are trying to govern.

## 8. Safe exception workflow
For a legitimate nested hook installation:
1. pre-scan;
2. capture exact hook path and proposed diff;
3. obtain human approval;
4. write only that path;
5. post-scan;
6. independent reviewer confirms no additional hook/config/policy changes.

For a legitimate nested agent configuration, additionally compare effective child controls against the parent contract.

## 9. Observability
Track:
- nested Git root count;
- nested agent-config root count;
- active nested hook count;
- unknown root count;
- blocked delegations;
- approved metadata writes;
- topology drift events;
- post-change verification failures.

Never log secret values or arbitrary config contents.

## 10. Failure handling
Scanner failure is a security uncertainty, not a pass. Retry once only when evidence indicates a transient filesystem race. Persistent unreadability, ambiguous config semantics, or unexpected topology requires human review. Never fix a failure by disabling the sandbox or globally writable metadata.

# Integration Guide

## 1. Install
Copy this package into a trusted tooling location. Keep the policy outside agent-writable paths when possible. Python 3.10+ is sufficient for the provided guard; it has no third-party dependencies.

## 2. Create the approved policy
Copy `config/hook-policy.example.json` to `config/hook-policy.json` and replace example hooks with approved identities.

Each hook needs:
- stable `id`;
- `event`;
- exact normalized `matcher`;
- expected `command`;
- `source` metadata;
- `state`: `required`, `optional`, or `forbidden`;
- `critical`: boolean.

Do not put secrets in commands or policy metadata.

## 3. Build a runtime adapter
The guard is host-neutral. Normalize the agent runtime's effective hook state to:

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": "Bash",
      "source": "enterprise-managed",
      "command": "/opt/company/agent-hooks/pretool-shell-gate.sh"
    }
  ]
}
```

Prefer an effective runtime registry/debug listing over re-parsing settings alone. If the host exposes only settings, the result is `implemented/measured` but not strong runtime verification; add a safe canary for critical hooks.

## 4. Run the gate

```bash
python scripts/hook_state_guard.py \
  --policy config/hook-policy.json \
  --runtime .agent-attestation/runtime-hooks.json \
  --report .agent-attestation/report.json
```

Exit 0 means the deterministic policy passed. Exit 2 is a policy mismatch, 3 invalid input, and 4 an operational error. Treat every non-zero result as blocking for protected workflows.

## 5. Wire lifecycle invalidation
Invalidate the attestation after:
- agent/runtime upgrade;
- organization/account/profile switch;
- plugin install/uninstall/enable/disable;
- managed, user, or project settings change;
- hook-policy change;
- process restart when runtime registration is rebuilt.

A stale attestation is not a pass.

## 6. Canary critical hooks when needed
For selected security hooks, define a documented canary mode that operates only in a disposable temp workspace. The canary should emit a unique non-secret marker to an approved local/audit sink. Verify exactly one marker. Never execute an unknown hook directly and never use real production credentials for a canary.

## 7. CI / launcher pattern
A launcher can:
1. start or query the agent runtime;
2. generate the normalized runtime snapshot;
3. execute the guard;
4. enable protected tools only if exit code is 0.

For CI, run `python -m pytest tests/test_hook_state_guard.py` if pytest is available, or adapt the test cases to your standard runner.

## 8. Operational metrics
Track:
- critical required-hook coverage;
- forbidden-active count;
- unknown-hook count;
- canary pass rate;
- attestation latency;
- hook-drift incidents per runtime version;
- time from configuration change to re-attestation.

## 9. Failure handling
On mismatch, freeze the tool classes relying on the affected hook, preserve redacted evidence, allow at most one approved restart/reload, and then re-attest from scratch. If still failing, escalate. Never resolve the incident by lowering hook criticality or weakening permissions.

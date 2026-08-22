# Consumer Admission Example

A planner creates `.agent-artifacts/outputs/implementation-plan.md` for task `TASK-1842` and registers it. A later implementation agent must not simply read that plan.

Before consuming it, the workflow runs:

```bash
python scripts/verify-artifact.py \
  --artifact .agent-artifacts/outputs/implementation-plan.md \
  --record .agent-artifacts/records/implementation-plan.json \
  --policy config/artifact-policy.json \
  --task-id TASK-1842 \
  --repository-id owner/repository \
  --require-verified
```

If the plan was edited after registration, the command returns exit code `10` with `hash-mismatch` and the implementation stage stops. If the record belongs to another task, it returns `task-mismatch`. If the record is expired, it returns `artifact-expired`.

The correct recovery is to regenerate/re-register or independently reverify according to policy. Editing only `expires_at`, copying a record from another task, or ignoring a mismatch is forbidden.
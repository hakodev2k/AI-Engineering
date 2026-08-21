# Hook — Pre Autonomy

## Trigger
Before switching an agent into unattended/auto/bypass-style execution on a host/surface that relies on permission rules or approval hooks.

## Preconditions
A fresh observation file exists for the exact host version, surface, mode, and policy revision.

## Action
Run:
```bash
python scripts/permission_canary.py observations.json
```

## Expected result
Exit `0`: all declared decisions match observations.

Exit `2`: fail-open safety mismatch; block autonomy.

Exit `3`: invalid/incomplete evidence; block autonomy.

Exit `4`: fail-closed mismatch; block unattended rollout until operational impact is reviewed.

## Failure behavior
Do not bypass the hook. Require a fresh canary after remediation or downgrade to a safer permission mode.

## Blocking
Yes. Any non-zero result blocks unattended operation.
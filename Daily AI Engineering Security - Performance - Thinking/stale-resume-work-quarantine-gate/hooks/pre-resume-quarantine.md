# Hook — Pre-Resume Quarantine

## Trigger
Immediately before persisted work is converted into an active model turn or tool-capable execution.

## Preconditions
A complete resume envelope is available or the runtime can explicitly mark missing fields.

## Action
Run the deterministic freshness checker. Permit dispatch only on `allow`. Route `quarantine` to an approval/revalidation path and `deny` to archival/error handling.

## Script/command
`python scripts/check_resume_freshness.py resume-envelope.json --max-age-seconds 300`

## Expected result
Exit `0` only for recent, nonterminal, provenance-complete work allowed by policy. Exit `1` for quarantine/deny. Exit `2` for malformed input/runtime error.

## Failure behavior
On checker error, block dispatch and preserve the candidate for operator inspection. Do not substitute `updated_at` or another fallback timestamp.

## Blocks completion
Yes. A runtime cannot claim stale-resume protection unless this gate executes before any resumed model/tool action.

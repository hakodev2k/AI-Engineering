# Hook — Pre Resume

## Trigger
Immediately before an agent resumes implementation from a persisted plan/session.

## Preconditions
A baseline checkpoint exists and Git/Python are available.

## Action
```bash
python scripts/workspace_fingerprint.py check --baseline .agent-state/workspace.json
```

## Expected result
Exit `0`: fingerprint matches. Exit `2`: drift detected; run `workflows/resume-and-revalidate.md` before any implementation tool call.

## Failure behavior
Any other non-zero exit means the check is unreliable. Retry once after resolving a deterministic environmental problem; otherwise block continuation.

## Blocking
Yes. Drift blocks blind reuse of the old plan until revalidation finishes.
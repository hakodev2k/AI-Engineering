# Hook: Pre Resume
## Trigger
Before restoring or continuing a checkpointed workflow.
## Preconditions
Resume-event JSON populated from persisted checkpoint and ledger state.
## Action
`python scripts/resume_guard.py --event <resume-event.json>`
## Expected result
Exit 0 only when replay classification, lineage, and pending-request integrity are acceptable.
## Failure behavior
Exit 3 blocks resume; exit 2 blocks invalid input.
## Blocking
Yes. Failure MUST block automated resume.
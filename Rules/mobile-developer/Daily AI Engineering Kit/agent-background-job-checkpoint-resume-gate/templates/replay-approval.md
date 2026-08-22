# Replay Approval Request

## Job
- Job ID:
- Job type:
- Environment:
- Checkpoint path:
- Last durable cursor:
- Processed count:

## Replay risk
- Side effects already committed: yes/no/unknown
- Side effects idempotent: yes/no/unknown
- Potential duplicate effect:
- Estimated affected scope:

## Evidence
- Failure summary:
- Relevant logs/tests:
- Input fingerprint verification:
- Proposed resume cursor:

## Requested action
Describe exactly which chunk or range would be replayed and why the replay cannot be proven safe automatically.

## Approval
Approval is valid only for the stated job, checkpoint, cursor, scope, and environment. Any changed input, cursor, or side-effect evidence requires a new approval.

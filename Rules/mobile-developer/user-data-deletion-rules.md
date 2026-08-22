# User Data Deletion Rules
## Purpose
Make account and user-data deletion complete, authorized, auditable, and safe across local and remote stores.
## Scope
Account deletion, local wipe, cached data, queued work, backups, analytics identifiers, and reauthentication.
## MUST
- Destructive deletion MUST verify user authorization and require confirmation proportionate to irreversibility.
- Deletion semantics MUST define local, server, derived, backup, and third-party data scope.
- Pending background/sync operations MUST NOT resurrect data after confirmed deletion.
- AI agents MUST require explicit human authority before executing destructive production deletion outside a pre-authorized runbook.
## MUST NOT
- UI removal MUST NOT be represented as completed deletion when retained copies remain under different semantics.
- Deleted-account credentials MUST NOT remain usable.
## SHOULD
- Deletion status SHOULD be observable and retryable when distributed cleanup is asynchronous.
## Exceptions
Legally required retention must be disclosed and separated from active product use.
## Verification
Test reauthentication, offline deletion request, queued sync, reinstall, server cleanup, third-party processors, and audit records.
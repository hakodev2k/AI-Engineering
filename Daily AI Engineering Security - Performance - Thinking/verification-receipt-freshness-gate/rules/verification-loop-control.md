# Rules: Verification Loop Control

- Verification evidence MUST be bound to current repository HEAD, normalized relevant paths, command, exit code and output digest.
- A successful receipt MUST be invalidated when HEAD, relevant scope or verification command changes.
- An unchanged fresh successful receipt MUST satisfy an identical verification request.
- The same verification key MUST NOT be executed more than twice without an intervening state change.
- Already-committed files MUST NOT be treated as unverified solely because they were modified earlier in the session.
- Reviewer findings MUST carry an explicit scope classification before they can block completion.
- Out-of-scope findings MUST NOT trigger autonomous scope expansion.
- Failed verification MUST block completion until fixed or explicitly waived by an authorized human.
- Receipt validation MUST fail closed when repository state or receipt content is unreadable.
- Logs SHOULD contain hashes and reason codes rather than sensitive command output.

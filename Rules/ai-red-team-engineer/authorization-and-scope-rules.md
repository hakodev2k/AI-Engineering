# Authorization and Scope

## Purpose
Keep adversarial testing within explicit authority.

## Scope
All red-team exercises, production probes, external targets, accounts, data, tools, and infrastructure.

## MUST
- Obtain explicit authorization defining targets, environments, techniques, timing, data handling, and stop conditions before execution.
- Distinguish analysis, recommendation, preparation, and execution authority.
- Maintain a current scope record during the engagement.

## MUST NOT
- Test third-party or production assets outside written authorization.
- Expand scope because a newly discovered path appears technically reachable.
- Bypass a stop instruction.

## SHOULD
Use least-privilege test identities and isolated environments where representative results remain possible.

## Exceptions
Emergency scope changes require authorized human approval and contemporaneous documentation.

## Verification
Compare execution logs, target identifiers, credentials, and test timestamps with the approved scope and change record.
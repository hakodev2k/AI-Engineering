# Rollback and Recovery Rules
## Purpose
Design recovery for mobile releases that cannot be instantly removed from user devices.
## Scope
Bad releases, incompatible server changes, remote flags, data migrations, and hotfixes.
## MUST
- Material releases MUST define recovery options before rollout, including server compatibility and remote disablement where feasible.
- Backend changes MUST remain compatible with supported installed app versions during the declared support window.
- Irreversible local-data migrations MUST have explicit risk acceptance and mitigation.
## MUST NOT
- Store rollback availability MUST NOT be assumed to restore already upgraded users immediately.
- Recovery MUST NOT depend solely on users manually reinstalling unless no safer option exists.
## SHOULD
- Critical new behavior SHOULD be remotely disableable when doing so does not create security risk.
## Exceptions
Low-risk isolated changes may use a hotfix-only recovery plan when impact is bounded.
## Verification
Run rollback tabletop scenarios, compatibility tests, flag kill-switch tests, migration failure tests, and staged rollout drills.
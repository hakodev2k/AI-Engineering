# Production Safety Rules
## Purpose
Prevent documentation from causing avoidable outages, data loss, or unsafe operational changes.
## Scope
Production procedures, migrations, administration, infrastructure, recovery, and high-impact configuration.
## MUST
- Mark production-affecting commands and distinguish analyze, recommend, prepare, and execute actions.
- Require explicit human approval in guidance before destructive data operations, irreversible migrations, infrastructure destruction, secret rotation, security weakening, breaking public contracts, or equivalent high-risk actions.
- Document backups, prechecks, blast radius, rollback, and post-change verification when relevant.
- Prefer reversible and staged procedures for risky changes.
## MUST NOT
- Present destructive commands as harmless copy-paste examples.
- Imply success without observable verification evidence.
## SHOULD
- Include dry-run or read-only validation paths where supported.
## Exceptions
Emergency runbooks may streamline steps only under an approved incident process with accountability and evidence capture.
## Verification
Operational review, command inspection, rollback rehearsal where feasible, and confirmation of approval and verification gates.
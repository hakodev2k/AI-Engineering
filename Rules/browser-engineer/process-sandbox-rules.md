# Process Sandbox Rules
## Purpose
Preserve process isolation and contain compromise of untrusted web content.
## Scope
Renderer processes, utility processes, brokers, sandbox policy, and privileged interfaces.
## MUST
- Untrusted content processes MUST operate with least privilege.
- New privileged operations MUST pass through narrowly scoped, validated interfaces.
- Sandbox policy changes MUST include a threat analysis and platform-specific verification.
## MUST NOT
- MUST NOT weaken sandbox restrictions to fix ordinary functionality without security approval.
- MUST NOT expose generic filesystem, process, device, or network authority when a narrower capability suffices.
## SHOULD
- SHOULD make denied-by-default behavior the baseline for new capabilities.
## Exceptions
Privilege expansion requires documented necessity, alternatives, blast radius, mitigation, and explicit human security approval.
## Verification
Inspect sandbox profiles, exercise denial tests, run exploit-oriented tests, and review broker/interface permissions.
# Production Incident Rules
## Purpose
Contain mobile production failures while respecting slow store distribution and heterogeneous installed versions.
## Scope
Crash spikes, broken releases, backend incompatibility, kill switches, incident response, and remediation.
## MUST
- Incident assessment MUST identify affected app versions, OS/device scope, user impact, and server dependencies using evidence.
- Mitigation MUST prefer reversible server-side or flag-based controls when they safely reduce impact faster than a store release.
- Hotfixes MUST retain essential security and regression checks.
- High-impact user-facing mitigations MUST have a named human decision owner.
## MUST NOT
- Teams MUST NOT assume users can immediately install a fixed binary.
- Security controls MUST NOT be disabled as an unapproved incident shortcut.
## SHOULD
- Post-incident review SHOULD capture detection gaps, rollout controls, compatibility failures, and prevention actions.
## Exceptions
Emergency actions may abbreviate normal process only with explicit approval, recorded risk, and follow-up review.
## Verification
Review incident timeline, telemetry, mitigation evidence, approvals, hotfix validation, and post-incident actions.
# Definition of Done
A mobile work item is complete only when applicable checks pass.

- [ ] User outcome, scope and non-goals are explicit.
- [ ] Supported platforms/OS/device assumptions are stated.
- [ ] Foreground/background, offline, denied-permission, process-death, retry and error states are handled.
- [ ] Persisted/synced data has explicit ownership, migration, idempotency and conflict semantics.
- [ ] Security/privacy and least-privilege permission checks pass.
- [ ] Deep links, push entry, navigation and authorization are verified when affected.
- [ ] Accessibility, localization-sensitive layout and device-size checks pass when UI changes.
- [ ] Performance/reliability budgets have evidence for affected critical paths.
- [ ] Automated tests cover deterministic business/state logic; targeted device/manual evidence exists where automation cannot prove behavior.
- [ ] Crash/log/analytics telemetry is privacy-safe and sufficient to verify rollout.
- [ ] Upgrade/fresh-install compatibility is verified when persisted state or configuration changes.
- [ ] Review findings are resolved; retries remained bounded.
- [ ] Release/recovery/remote-disable plan exists for material production risk.
- [ ] Required human approvals are recorded.
- [ ] Handoff includes facts, assumptions, risks, evidence and next owner.
- [ ] Failures produced root-cause learning and prevention action.
- [ ] No secrets, placeholder TODOs, silent omissions or unsupported claims remain.
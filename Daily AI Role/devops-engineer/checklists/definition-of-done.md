# Definition of Done Checklist

- [ ] Goal, target, owner, priority, deadline, dependencies, and risk are explicit.
- [ ] Source commit and artifact/version identity are traceable.
- [ ] Required build/test/security/policy gates pass or an authorized documented exception exists.
- [ ] No secrets are stored or exposed.
- [ ] Automation identity follows least privilege.
- [ ] Conflicting mutable work was serialized.
- [ ] Environment-specific configuration is understood.
- [ ] Recovery/rollback or forward-recovery path is valid for meaningful production risk.
- [ ] High-risk/destructive actions have human approval.
- [ ] Retries/polling are bounded and classified.
- [ ] Fresh verification confirms the claimed result.
- [ ] Production release includes observation evidence, not only command success.
- [ ] Residual risks are written with accountable owners.
- [ ] Temporary exceptions include expiry/restoration action.
- [ ] Handoff contains enough evidence for the next owner to continue without rediscovery.
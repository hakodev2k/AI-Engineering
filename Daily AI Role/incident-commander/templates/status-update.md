# Incident Status Update Template

## Internal operational update
**Incident:** `{incident-id} — {title}`  
**Severity / status:** `{severity} / {status}`  
**Impact:** `{verified impact statement}`

**Changed since last update**
- `{new verified fact or state change}`

**Current response**
- `{workstream/action}` — owner: `{owner}` — state: `{state}`

**Known risk / blocker**
- `{risk or blocker, or "None newly identified"}`

**Next checkpoint:** `{timestamp with timezone}`

---

## Executive/business update
**Current impact:** `{short user/business impact}`  
**Response status:** `{contained / mitigating / monitoring / recovered-pending-verification}`

- What changed: `{material change since prior update}`
- What we are doing: `{plain-language response}`
- Key risk/decision needed: `{risk or approval request, if any}`
- Next update: `{timestamp}`

Do not include unsupported root cause or recovery ETA.

---

## Support / Customer Success handoff
- Customer-visible symptom: `{symptom}`
- Affected scope: `{verified scope}`
- Workaround: `{verified safe workaround or "none confirmed"}`
- Current status: `{status}`
- Escalate when: `{condition}`
- Approved wording/reference: `{reference}`
- Next update: `{timestamp}`

---

## Customer/public draft
> Requires the organization's designated approval when policy requires it.

`We are investigating {verified symptom/impact}. Our teams are {high-level response}. {Verified workaround/action for users, if any}. We will provide another update by {time}, or sooner if there is a material change.`

### Final checks before sending
- [ ] Impact and scope match authoritative state.
- [ ] Severity/status are current.
- [ ] No hypothesis is written as confirmed root cause.
- [ ] No unsupported ETA or promise appears.
- [ ] No secrets, personal data, confidential architecture, or sensitive security detail appears.
- [ ] Required human approval has been obtained.
- [ ] Timestamp/timezone and next-update cadence are explicit.
# Operating Rules
1. MUST begin from an operational decision, user journey or failure hypothesis.
2. MUST inspect existing telemetry before adding a new signal.
3. MUST define stable semantics, owner and scope for every production signal.
4. MUST NOT put secrets, credentials or unnecessary sensitive payloads in telemetry.
5. MUST review high-cardinality dimensions before rollout.
6. MUST quantify expected volume, retention and cost impact for material changes.
7. MUST include correlation context needed to move between metrics, traces and logs.
8. MUST distinguish application failure, telemetry failure and missing data.
9. MUST NOT create alerts with no clear owner or actionable response.
10. SHOULD alert on user impact or SLO risk rather than every internal symptom.
11. MUST verify signals under success, failure and no-data conditions.
12. MUST use bounded retries; after two failed correction cycles, escalate.
13. MUST require human approval for destructive telemetry deletion, critical-alert disablement and sensitive-data collection.
14. MUST record assumptions and uncertainty when evidence is incomplete.
15. SHOULD prefer reversible rollout and scoped canaries for platform-wide changes.
16. MUST preserve vendor-neutral semantic contracts in core documentation.
17. MUST consolidate subagent findings; subagents advise but do not override accountable owners.
18. MUST close failures through Failure -> Root Cause -> Lesson -> Process Improvement -> Future Prevention.

# Rules — Orchestration Control-Event Integrity

1. Runtime/UI/scheduler-generated control events **MUST** carry explicit provenance and **MUST NOT** be represented as user-authored intent.
2. Every control event that changes or queries a run/subagent lifecycle **MUST** include a causal identifier bound to an existing operation.
3. A completion event **MUST** include a result reference or an explicit no-result failure status before the parent may treat work as complete.
4. A terminal lifecycle state **MUST NOT** transition back to pending/running without a new causal operation ID.
5. Status and wait intents **MUST** route only to collaboration/lifecycle capabilities; they **MUST NOT** be implemented by synthetic shell placeholder commands.
6. Auto-continuation events **MUST** identify the lifecycle transition that caused them and **MUST NOT** erase or supersede a pending result/interruption fact.
7. Synthetic messages **MUST** remain distinguishable from user messages in persistence, replay, telemetry, and model-facing summaries.
8. The runtime **MUST** validate control-event invariants before model re-entry when a failed invariant could change task state or user intent.
9. Unknown provenance or an unknown causal target **MUST** fail closed for autonomous continuation.
10. The agent **MUST NOT** claim a subagent/tool result was observed unless a validated result reference exists.
11. Investigation **MUST** separate Facts, Assumptions, Evidence, Hypotheses, Decision, Risks, and Verification status; hidden chain-of-thought **MUST NOT** be requested.
12. Repair loops **MUST** be bounded to at most two iterations after the initial diagnosis.
13. Consequential actions based on synthetic or unverified user intent **MUST** require fresh explicit human approval/user intent.
14. The agent/runtime implementer **MUST NOT** be the sole verifier of control-event fixes.
15. Implementations **SHOULD** preserve compact typed control state outside natural-language transcript text and generate model-facing summaries only from validated state.

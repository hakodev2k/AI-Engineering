# Session Context Rules

## Scope
Agent runtimes that persist session/event history and reconstruct model context from it.

## Enforceable rules
- Persistence **MUST NOT** imply inclusion in every model turn.
- Protected event classes **MUST** be retained unless an independently verified replacement preserves their semantics.
- Ephemeral events **MUST** have an explicit inclusion lifetime; they **MUST NOT** remain replayable indefinitely by default.
- Superseding event classes **MUST** define a stable key and only the latest required value **SHOULD** enter the replay working set.
- Exact duplicate transient metadata **MUST NOT** be injected repeatedly when one canonical record is sufficient.
- Context optimization **MUST** start with a measured baseline by event class, bytes/tokens, duplicate ratio, and quality fixtures.
- Token savings **MUST NOT** be accepted if protected-state retention or task quality falls below configured thresholds.
- Compaction **MUST** be evaluated against the reconstructed next-turn prompt, not only persisted file size or cumulative usage counters.
- Stable bootstrap material **SHOULD** be separated from dynamic session metadata and loaded according to relevance/budget rather than blindly duplicated.
- Tool/hook/subagent side-events **SHOULD** carry provenance and lifecycle metadata so they can be expired or superseded deterministically.
- Retry loops **MUST** be bounded to two optimization iterations before escalation.
- A failed quality or state-retention check **MUST** restore the previous inclusion policy; never hide failure by lowering quality, safety, or required-context thresholds.

## Verification
Pass only when duplicate/replay metrics improve and quality fixtures plus protected-state retention remain at or above policy thresholds.

## Stop conditions
Stop optimization if the runtime cannot distinguish protected from transient state, if baseline data is missing, or after two failed optimization attempts. Escalate rather than deleting uncertain context.

# Core Skills

## Skill 1 — Correlation Baseline

**Purpose:** Establish a trustworthy tool-call identity model before execution.

**Trigger:** Start of an agent turn that may call tools, spawn subagents, retry, or resume.

**Inputs:** session ID, generation ID, agent ID, tool call metadata, side-effect classification.

**Preconditions:** Host can observe tool dispatch and result events.

**Required context:** Active generation, current agent identity, retry/fallback state.

**Tools:** host event stream, `scripts/correlation_guard.py`.

**Procedure:**
1. Assign a monotonic generation number to every model turn/retry boundary.
2. Build composite identity `(session, generation, agent, tool_call_id)`.
3. Record tool name, argument digest, side-effect flag, dispatch timestamp, and initial state.
4. Reject duplicate composite identities before execution.
5. Persist the ledger outside model-generated text.

**Decisions:** If provider IDs are missing, generate a host ID and retain provider ID as metadata. If generation identity is unknown after resume, stop and reconstruct before continuing.

**Constraints:** Never infer identity from tool name/arguments alone. Never overwrite earlier invocation records.

**Expected output:** A complete invocation ledger for the active generation.

**Metrics:** duplicate invocation IDs blocked, missing identity rate.

**Verification:** Guard validates the ledger without orphan/duplicate identity errors.

**Failure handling:** Block tool execution when identity cannot be made unique.

**Stop conditions:** All active calls have valid composite identities.

## Skill 2 — Exactly-Once Result Reconciliation

**Purpose:** Ensure each observation is accepted once and only for its originating invocation.

**Trigger:** Tool result arrival, stream replay, retry, reconnect, or resumed session.

**Inputs:** result event and current correlation ledger.

**Preconditions:** Invocation ledger exists.

**Required context:** Active generation and parent invocation identity.

**Tools:** correlation guard, result payload hashing.

**Procedure:**
1. Match result to exact composite identity.
2. If no invocation exists, mark `ORPHAN_RESULT` and block continuation.
3. If generation is stale, quarantine result.
4. Hash payload deterministically.
5. If the same invocation already has the same payload hash, classify as harmless duplicate and ignore it.
6. If the same invocation has a different payload hash, classify `CONFLICTING_DUPLICATE_RESULT` and fail closed.
7. Mark the invocation terminal only after acceptance.
8. Run the continuation gate before returning control to the model.

**Decisions:** Never choose “latest result wins” for conflicting duplicates.

**Constraints:** Result order alone is not identity. Model prose cannot override ledger state.

**Expected output:** Accepted, ignored, quarantined, or blocked result with reason code.

**Metrics:** orphaned-result acceptance rate, duplicate conflict rate, stale result acceptance rate.

**Verification:** Every accepted result maps to one unique active invocation.

**Failure handling:** Preserve events, block model continuation, reconcile at most twice.

**Stop conditions:** No unresolved correlation violations remain.

## Skill 3 — Retry/Fallback Generation Boundary

**Purpose:** Prevent a retried model turn from assuming earlier executed actions never happened.

**Trigger:** provider retry, model fallback, turn retraction, transport reconnect, or subagent resume.

**Inputs:** previous generation ledger, live execution state, retry reason.

**Preconditions:** Retry/fallback is observable by host.

**Required context:** Side-effectful and background calls from previous generation.

**Tools:** orchestration state, correlation guard.

**Procedure:**
1. Close the old generation for new dispatches.
2. Enumerate nonterminal old-generation invocations.
3. Cancel safely cancellable calls or preserve them as externally live.
4. Quarantine late old-generation results from automatic model injection.
5. For side-effectful completed actions, expose an execution fact to the new generation rather than re-dispatching.
6. Require idempotency proof or human approval before replaying uncertain side effects.
7. Start the new generation with a fresh namespace.

**Decisions:** A retracted transcript does not imply a retracted real-world action.

**Constraints:** Do not silently kill or replay destructive work.

**Expected output:** Explicit old/new generation boundary and reconciliation report.

**Metrics:** duplicate side effects across retries; orphaned background tasks after fallback.

**Verification:** No new call inherits an old composite identity; stale results cannot pass the gate.

**Failure handling:** Escalate ambiguous side effects to a human.

**Stop conditions:** New generation starts only after old execution state is classified.
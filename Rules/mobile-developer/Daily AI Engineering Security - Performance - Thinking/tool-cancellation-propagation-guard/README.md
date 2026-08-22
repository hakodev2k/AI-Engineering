# Tool Cancellation Propagation Guard

## Category
Performance

## Problem
Agent cancellation frequently stops orchestration before it stops the actual work. Tools, streams, reconnect paths, nested agents, or subprocess descendants may continue running after a user presses stop or a host deadline expires.

## Evidence
See `evidence/research.md`. Current signals span OpenAI Agents JS, GitHub Copilot SDK, Vercel AI SDK, and Codex automation lifecycle requests.

## Existing approach
Most frameworks expose a top-level cancellation token/signal plus tool timeouts. Some propagate cancellation into tool callbacks, while others have had gaps in specific execution paths.

## Existing limitations
A signal at the top-level API does not prove propagation through every adapter. Resume/reconnect and nested paths are especially easy to miss. Direct-child termination does not guarantee process-tree cleanup.

## Proposed improvement
Treat cancellation as an end-to-end invariant. Track one cancellation identity across runner, tool, stream, nested agent, transport, and subprocess layers; measure cancel-to-quiescence; reject clean completion when owned work remains active.

## Architecture
```text
cancel source
  -> runner
  -> dispatcher/adapter
  -> tool/stream/nested agent
  -> owned I/O or subprocess tree
       |
       +-> structured lifecycle events
              -> cancellation_audit.py
              -> quiescence gate
              -> independent verification
```

## Package tree
```text
README.md
evidence/research.md
rules/cancellation-contract.md
skills/cancellation-path-audit.md
subagents/lifecycle-verifier.md
workflows/diagnose-and-fix.md
workflows/regression-verification.md
hooks/post-cancel-quiescence-check.md
scripts/cancellation_audit.py
```

## Installation
Requires Python 3.9+ only for the deterministic audit script. Integrate the Markdown rules/workflows into the agent or engineering procedure used by your platform.

## Configuration
Choose a cancellation grace period based on expected I/O shutdown behavior. The hook example uses 5000 ms. Use a longer value only with measured justification.

## Usage
1. Emit lifecycle JSONL events using the schema documented in `scripts/cancellation_audit.py`.
2. Run `workflows/diagnose-and-fix.md` for a reproduced lifecycle failure.
3. Enforce `rules/cancellation-contract.md` at adapter boundaries.
4. Run the post-cancel hook.
5. Require `subagents/lifecycle-verifier.md` to execute `workflows/regression-verification.md` before acceptance.

Example:
`python scripts/cancellation_audit.py run-events.jsonl --run-id r-123 --grace-ms 5000`

## Workflow
Observe → measure baseline → audit propagation → form one hypothesis → implement → measure again → independently verify. Implementation retries are bounded to two per hypothesis.

## Metrics
- p50/p95 cancel-to-quiescence latency
- active resources at +1s/+5s
- late state/external writes
- unresolved streams/promises
- leaked descendant processes
- cancellation conformance coverage

## Verification states
- **Implemented**: propagation/cleanup code exists and required events are emitted.
- **Measured**: before/after lifecycle metrics are captured using equivalent fixtures.
- **Verified**: independent lifecycle verifier passes every required cancellation checkpoint with no unexplained post-cancel activity.

## Safety
Never terminate processes whose ownership cannot be proven. Cancellation must not be implemented by weakening authorization, skipping transactional safeguards, or treating unknown resources as owned.

## Failure handling
Detection comes from the audit hook or unresolved fixture. Retry instrumentation once; retry a code hypothesis at most twice. If ownership remains ambiguous or an external SDK blocks propagation, mark the path `blocked` and preserve evidence rather than forcing cleanup.

## Definition of Done
Evidence documented; baseline captured; affected boundary identified; implementation completed; normal-run tests pass; cancellation fixtures pass; cancel-to-quiescence meets SLO; no post-cancel mutation/leak remains; independent verification passes; no blocking lifecycle path is untested.

## Customization
Extend lifecycle event kinds only when they are deterministic and documented. Add platform-specific process-tree tests for Windows/Linux/macOS rather than weakening the common contract.

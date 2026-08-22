# Subagent: MCP Protocol Lifecycle Verifier

## Mission
Independently verify that cancellation, timeout, and transport-loss handling produces bounded request lifecycles and safe retry decisions.

## Responsibility
Review lifecycle instrumentation and execute deterministic scenarios. This verifier does not modify the implementation it is approving.

## Inputs
- `config/cancellation-policy.json`
- `rules/cancellation-contract.md`
- Request traces and session logs
- Output from `tests/test_cancellation_guard.py`
- Side-effect classification for tested tools

## Required context
Transport type, client/server versions, timeout settings, progress behavior, retry policy, and remote idempotency/status capabilities.

## Allowed tools
Read-only logs, MCP Inspector, local delayed/mock MCP server, deterministic test runner, and protocol traces with sensitive payloads redacted.

## Forbidden actions
- MUST NOT automatically replay an unknown side-effecting request.
- MUST NOT classify cancellation as successful solely because local work stopped.
- MUST NOT remove timeouts to make tests pass.
- MUST NOT be the only verifier of its own implementation change.

## Expected output
A verification record covering normal completion, explicit cancel, idle timeout, absolute timeout, missing terminal response, transport loss, read-only retry, side-effecting retry quarantine, and session recovery.

## Completion criteria
1. All scenarios produce a bounded terminal or `unknown` state.
2. Cancel-to-terminal latency is measured.
3. User cancellation and timeout are distinguishable in local telemetry.
4. Side-effecting unknown requests are blocked from automatic retry.
5. Reconciliation stops after the configured maximum attempts.
6. A single stuck request does not force destructive global recovery unless session health is proven bad.

## Handoff target
MCP client/server owner or platform runtime owner. Unsafe retry behavior blocks release; ambiguous protocol evidence returns to instrumentation owners.

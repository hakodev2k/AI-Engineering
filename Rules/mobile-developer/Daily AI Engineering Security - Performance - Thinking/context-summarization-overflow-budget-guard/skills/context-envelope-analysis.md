# Skill: Context Envelope Analysis

## Purpose
Measure the real token budget of a summarization call before it is sent.

## Trigger
Projected context utilization reaches the configured trigger or an overflow has occurred.

## Inputs
Messages, required IDs, model context limit, summary prompt estimate, output reserve, safety margin, metadata policy.

## Preconditions
Message IDs are stable; tool-call/result relationships can be identified; the target model context limit is known.

## Allowed tools
Token counters, JSON serializers, local scripts, read-only traces.

## Constraints
Do not remove required facts, security policy, approval state, or tool results needed for verification.

## Procedure
1. Serialize the exact envelope shape used by the summarizer.
2. Count/estimate tokens for prompt, messages, metadata, and structured tool fields.
3. Deduct output reserve and safety margin from context capacity.
4. If over budget, strip configured non-essential metadata.
5. Recount; if still over, trim oldest non-required complete conversational units while preserving tool pairs.
6. Recount after each trim; maximum two trim attempts by default.
7. Block if required context alone cannot fit.
8. Record before/after budget and retained required IDs.

## Decision points
Allow when projected total fits. Trim when removable context exists. Block when required state cannot fit or retries are exhausted.

## Expected output
Projected tokens, utilization, stripped keys, removed IDs, retained required IDs, and decision.

## Metrics
Tokens/task, summarization input tokens, overflow rate, compression ratio, required-context retention, regression rate, latency/cost.

## Verification
Required IDs retained at 100%; tool pairs valid; projected envelope below configured usable capacity.

## Failure handling
Never retry identical payload. Escalate to larger-context model or external memory only through explicit policy.

## Stop conditions
Budget fits, required context cannot fit, or trim-attempt budget is exhausted.

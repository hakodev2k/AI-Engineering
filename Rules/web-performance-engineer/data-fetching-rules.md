# Data Fetching Rules

## Purpose
Prevent network waterfalls, overfetching, and request behavior from delaying usable web experiences.

## Scope
Applies to browser API calls, GraphQL or REST requests, prefetching, retries, request cancellation, and client data dependencies.

## MUST
- Map critical user journeys to the minimum data dependencies required for first useful interaction.
- Bound retries, timeouts, and concurrency for client requests.
- Cancel or ignore obsolete requests when navigation or user intent changes.
- Measure payload size and dependency waterfalls before changing fetch strategy.

## MUST NOT
- Serialize independent requests without a correctness reason.
- Prefetch sensitive or expensive data solely because a user might need it.
- Add automatic retries that can amplify overload or duplicate non-idempotent actions.

## SHOULD
- Parallelize independent critical requests and defer non-critical data.
- Reuse safely cacheable data when freshness requirements permit.

## Exceptions
Exceptions require data-consistency rationale, measured impact, alternatives considered, and risk review.

## Verification
Inspect browser waterfalls, request traces, payload sizes, retry behavior, cancellation tests, and RUM route timing.
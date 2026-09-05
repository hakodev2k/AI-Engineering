# Hook: Pre Change

## Trigger
Before edits that may affect shutdown, cancellation, workers, queue consumers, readiness, or termination configuration.

## Preconditions
Repository revision and service identity are known.

## Action
1. Record repository revision.
2. Enumerate work entry points.
3. Capture current timeout/grace settings.
4. Record acknowledgement/checkpoint behavior.
5. Produce baseline snapshot.
6. Do not mutate production to obtain evidence.

## Expected result
Comparable baseline lifecycle evidence.

## Failure behavior
Missing termination or acknowledgement evidence blocks a safety claim. Transient read/tool failures retry at most twice.

## Blocking
Yes.

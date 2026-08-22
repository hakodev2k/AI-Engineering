# Temporal Boundary Test Design

## Purpose
Turn temporal requirements into deterministic tests that expose boundary and time-zone defects.

## Inputs
Temporal inventory, business zone, affected entry points, current test framework.

## Procedure
1. Replace direct wall-clock dependency with the repository's clock abstraction; if none exists, prefer the platform's standard injectable time provider when available.
2. Build cases for one tick/unit before, exactly at, and one tick/unit after each business boundary.
3. Add UTC/local-date crossover cases.
4. For DST-observing zones, test spring-forward invalid local times and fall-back ambiguous local times. Never assume every zone observes DST.
5. Add leap-day and month/year rollover where date arithmetic is used.
6. For ranges, explicitly test lower/upper inclusivity and adjacent ranges.
7. For recurring schedules, verify the intended wall-clock behavior across offset changes.
8. For serialization, round-trip offsets and UTC markers.
9. Run tests twice with different machine `TZ` values when the stack permits it; results must be invariant unless machine-local time is explicitly the requirement.

## Expected output
Focused tests named by business boundary and expected semantics, not implementation details.

## Verification
Tests fail for the demonstrated defect or protect the stated invariant, then pass after the implementation change.

## Failure handling
If the runtime cannot model a target zone, report an environment failure rather than substituting another zone silently.

## Stop conditions
Stop if expected behavior for ambiguous local time cannot be established from requirements/evidence.
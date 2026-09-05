# Skill: Drain Design

## Purpose
Design a bounded shutdown sequence that rejects new work, drains or checkpoints in-flight work, and terminates predictably.

## Inputs
Discovery evidence, acceptance criteria, drain policy.

## Process
1. Define shutdown trigger and exact ordering.
2. Remove readiness or external admission before beginning drain.
3. Stop queue pulls/scheduled admissions before waiting for existing work.
4. Propagate cancellation to operations that should abort rather than finish.
5. Set drain timeout to at least maximum handler duration plus policy margin.
6. Set platform termination grace beyond the drain timeout plus policy margin.
7. Define safe ack/checkpoint behavior for interrupted non-HTTP work.
8. Define bounded force termination after the grace window.
9. Design lifecycle tests that initiate shutdown while work is active.
10. Mark production lifecycle/configuration changes as approval-required.
11. Limit implementation retry cycles to two.

## Expected output
Ordered lifecycle plan, timeout budget, tests, recovery path, approval points.

## Verification
Every timeout derives from a measurable work budget rather than an arbitrary constant.

## Stop conditions
No safe admission stop, no checkpoint/ack model, unbounded work with no cancellation, or production change without approval.

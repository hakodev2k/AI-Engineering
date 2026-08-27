# Skill — Hook Trust Analysis
## Purpose
Diagnose whether hook execution is protected by an authentic, lifecycle-complete trust boundary.
## Trigger
New hook integration, persistent hook change, resume/fork behavior change, or report that a hook ran without expected review.
## Inputs
Hook identity/hash/scope, lifecycle event, authoritative cwd, approval provenance, initiator, managed state, current and approved hashes.
## Preconditions
A documented set of trusted roots and a policy defining valid human approval surfaces.
## Required context
Only observable event metadata and source/configuration relevant to hook execution.
## Allowed tools
Read-only source inspection, event-log inspection, deterministic guard and tests.
## Constraints
Never execute untrusted hooks to “see what happens” outside an isolated fixture. Never accept model self-report as approval evidence.
## Procedure
1. Record Facts and Evidence for every execution path.
2. Identify the actual lifecycle dispatch boundary.
3. Compare session cwd against authoritative trusted roots.
4. Validate approval input origin and hash binding.
5. Test start, end, resume/fork and server-initiated paths.
6. Run the guard and regression suite.
7. Obtain independent security review before release.
## Decision points
Any provenance ambiguity, cwd mismatch, stale hash, or nonhuman approval blocks execution.
## Expected output
Pass/block decision plus exact violation codes and affected paths.
## Metrics
Protected execution-path coverage, stale-hash block rate, nonhuman approval block rate, false-positive count.
## Verification
An independent reviewer reproduces at least one blocked exploit fixture and one valid human-approved case.
## Failure handling
Maximum two implementation retries; disable hook execution for ambiguous paths afterward.
## Stop conditions
Stop immediately on persistent trust established by model-controlled input or any untrusted-folder hook execution.

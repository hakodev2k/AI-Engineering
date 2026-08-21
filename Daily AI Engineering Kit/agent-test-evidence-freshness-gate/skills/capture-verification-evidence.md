# Capture Verification Evidence

## Purpose
Create a reproducible evidence record for a build, test, analysis, database, migration, release, or production verification command.

## When to use
Use immediately after a verification command finishes and before another edit, rebase, dependency change, configuration change, or environment mutation can invalidate the result.

## Inputs
- Exact source revision.
- Exact base revision.
- Verification category and command.
- Relevant input files/configuration.
- Environment identity when required.
- Exit/result status and artifact references.

## Preconditions
- Repository state used by the command is known.
- No unrecorded source mutation occurred between execution and evidence capture.
- Required command output is available.

## Allowed tools
Git read operations, build/test tools, filesystem hashing, CI artifact metadata, environment inspection that does not mutate production.

## Process
1. Capture `git rev-parse HEAD` and the intended base revision.
2. Identify input files and values that influence the command: lockfiles, build/test config, generated inputs, feature flags, runtime version, target framework, test selection.
3. Run `scripts/fingerprint-inputs.py` with those inputs.
4. Execute the verification command once under the intended environment.
5. Classify result strictly as `passed`, `failed`, or `unknown`.
6. For integration/E2E/performance, calculate or obtain the environment fingerprint required by policy.
7. Create an evidence JSON matching `schemas/evidence-record.schema.json`.
8. Preserve log/report/artifact paths rather than copying secrets into the record.
9. Immediately run `scripts/evaluate-freshness.py` against the current revision and fingerprints.
10. If stale, do not edit timestamps; find the mismatched input and recapture by rerunning.

## Expected output
One evidence JSON and one freshness evaluation bound to the exact current state.

## Verification
- Evidence status is `passed`.
- Freshness evaluator exits 0.
- Revision, base, input fingerprint, environment fingerprint, and observed time are correct.

## Failure handling
- Transient tool/CI metadata failure: retry at most once and preserve the first error.
- Test/build failure: stop; fix or escalate, then rerun from a fresh state.
- Unknown result after timeout/disconnect: preserve as `unknown`; never infer pass.

## Stop conditions
Stop if repository revision changes, required inputs cannot be identified, environment identity is unknown for a required category, or dangerous action would be needed to obtain evidence.
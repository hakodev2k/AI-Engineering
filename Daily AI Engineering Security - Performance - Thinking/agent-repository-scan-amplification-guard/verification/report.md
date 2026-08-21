# Verification Report

## Implemented
- Current evidence and problem analysis documented.
- Scan policy defines duplicate, rate, concurrency, latency, full-root-reason and denied-path controls.
- `scripts/scan_guard.py` implements deterministic JSONL analysis with meaningful exit codes.
- Skills, rules, subagents, workflows and hooks define bounded diagnosis/optimization/verification procedures.
- Example event trace and unit tests are included.

## Measured
This reusable package does not claim a production performance improvement without target-host measurements. The script itself reports event count, duplicate-equivalent count/ratio, total/average scan time, maximum concurrency and slow-scan warnings. A target integration must capture baseline and candidate traces on the same scenarios.

## Verified
The included unit-test design covers normal traces and violations for duplicate-equivalent scans, scan rate, concurrency, block latency, slow warnings, unapproved full-root reasons, denied dependency paths and malformed timestamps. The package must be executed in the target repository/host to produce runtime verification evidence.

## Production verification checklist
- [ ] Baseline trace captured before optimization.
- [ ] Candidate trace captured on identical scenarios.
- [ ] `python -m unittest tests/test_scan_guard.py` passes.
- [ ] Candidate guard returns exit 0.
- [ ] Duplicate-equivalent scan ratio decreases or stays within policy.
- [ ] Total scan time and p95 pre-tool scan overhead do not regress.
- [ ] Maximum concurrent scanners stays within policy.
- [ ] Add/delete/rename/checkout/ignore-change discovery fixtures pass.
- [ ] Inactive project scenario does not consume unapproved scan budget.
- [ ] Security/sandbox boundaries were not weakened.

## Definition of verified improvement
A rollout may be labeled **Verified** only when the same representative workload shows lower scan amplification or latency, the deterministic guard passes, and repository-discovery correctness remains unchanged. If only the code exists, label **Implemented**. If metrics were collected but correctness or independent replay is incomplete, label **Measured**, not Verified.
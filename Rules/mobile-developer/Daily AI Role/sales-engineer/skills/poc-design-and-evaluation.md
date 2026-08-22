# Skill: POC Design and Evaluation

**Purpose:** Reduce a decision-critical technical uncertainty with bounded evidence.

**Inputs:** Hypothesis, baseline, evaluation criteria, environment, owners.

**Procedure:**
1. State one primary hypothesis and secondary checks.
2. Define pass/fail thresholds before testing.
3. Freeze scope, test data, dependencies, access, and cleanup plan.
4. Execute smallest experiment that can answer the question.
5. Capture raw evidence and deviations.
6. Retry at most twice only for understood transient/setup failures.
7. Conclude pass, fail, inconclusive, or blocked; never move thresholds after seeing results without recording a new experiment.

**Output:** POC plan, evidence, result, risk, next decision.

**Approval:** Required for production access, sensitive data, material spend, or risky changes.
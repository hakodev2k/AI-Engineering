# Skill: PR Risk Analysis

## Purpose
Identify hidden risks in code changes before merge.

## Use When
A pull request contains feature work, refactoring, dependency changes, migrations, or AI-generated code.

## Process
1. Inspect repository structure and changed files.
2. Identify affected modules and public contracts.
3. Collect evidence from tests, configs, logs, and implementation.
4. Classify risks: correctness, security, performance, data, compatibility.
5. Create findings with evidence.
6. Suggest verification steps.
7. Stop when evidence is insufficient.

## Output
Finding, evidence, confidence, affected component, risk, recommendation, verification status.

## Failure Handling
Do not guess. Mark unknown areas and request additional evidence.

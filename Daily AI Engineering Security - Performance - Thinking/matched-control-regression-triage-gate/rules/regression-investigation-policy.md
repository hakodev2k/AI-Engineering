# Regression Investigation Policy

- A regression investigation MUST record a failing case before proposing repair.
- Before repair, the investigator MUST record either a matched passing control or evidence of a bounded unsuccessful control search.
- A passing control SHOULD minimize differing dimensions relative to the failing case.
- The investigator MUST enumerate observed differences between control and failing cases.
- Each open hypothesis MUST cite evidence and MUST define an observable falsification test.
- A hypothesis MUST NOT be upgraded to verified solely because a patch appears to work once.
- An experiment MUST record its hypothesis, action/test, outcome, and new evidence.
- The same experiment signature MUST NOT be repeated unless new evidence changes its premise.
- Autonomous experiment retries MUST be bounded; default maximum is three.
- Repair MUST NOT begin while the control-search or hypothesis contract is incomplete.
- Completion MUST include verification evidence for the repaired failing case and regression evidence that the matched control remains passing.
- Independent review SHOULD verify high-impact conclusions and MUST verify changes that affect production or security boundaries.
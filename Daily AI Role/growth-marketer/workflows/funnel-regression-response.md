# Funnel Regression Response
Trigger: material KPI or conversion regression.
Goal: restore trustworthy measurement and business/user performance quickly without masking root cause.
Inputs: alert, affected metric, recent changes, segments, event health.
Stages: verify signal; scope impact; classify measurement vs product/channel/lifecycle cause; freeze risky scaling; parallelize instrumentation review and journey diagnosis; identify reversible mitigation; verify recovery; run root-cause review.
Priority: security/privacy or widespread revenue/user harm first, then dependency/deadline, then optimization.
Checkpoints: signal-valid, mitigation-approved, recovery-confirmed.
Retries: two bounded verification/mitigation attempts before escalation.
Human gates: budget shifts, production tracking changes, customer-wide sends, pricing/offers.
Outputs: incident-style growth note, evidence, mitigation, owner, prevention action.
DoD: metric source trustworthy, impact bounded, recovery or accepted risk documented, prevention task owned.

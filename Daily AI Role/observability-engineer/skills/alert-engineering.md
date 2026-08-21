# Skill: Alert Engineering
Trigger: new alert, noisy alert, missed incident or changing SLO.
Inputs: SLO/SLI, incident history, signal behavior, ownership and response path.
Procedure: define triggering user impact; choose stable signal; set window/threshold with historical evidence; define no-data behavior; deduplicate symptoms; attach owner, severity and response guidance; test fire and recovery; review false-positive cost.
Decision: page only when timely human action can improve outcome; otherwise use ticket/dashboard/report.
Output: actionable alert specification and test evidence.

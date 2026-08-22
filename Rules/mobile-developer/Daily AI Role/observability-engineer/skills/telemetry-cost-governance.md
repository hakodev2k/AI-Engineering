# Skill: Telemetry Cost Governance
Trigger: new high-volume signals, cost anomaly, retention change or cardinality growth.
Inputs: event rate, payload size, dimension distribution, sampling, retention, query usage and criticality.
Procedure: quantify baseline; identify low-value volume; model alternatives such as aggregation/filtering/sampling/tiered retention; assess investigation loss; consult owners; choose reversible change; verify post-change coverage and cost.
Constraint: MUST NOT optimize cost by silently removing critical incident evidence.
Output: recommendation with savings estimate, risk, rollback and approval needs.

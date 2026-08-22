#!/usr/bin/env python3
import os,sys
REQUIRED=['README.md','checklists/definition-of-done.md','config/role-config.yaml','examples/observability-change.example.json','hooks/lifecycle-hooks.md','knowledge/observability-reasoning-principles.md','knowledge/telemetry-quality-and-cost.md','metrics/observability-quality.md','rules/operating-rules.md','schemas/observability-change.schema.json','scripts/validate-observability-change.py','skills/telemetry-contract-design.md','skills/instrumentation-review.md','skills/dashboard-design.md','skills/alert-engineering.md','skills/telemetry-cost-governance.md','skills/incident-evidence-analysis.md','subagents/cardinality-cost-reviewer.md','subagents/privacy-security-reviewer.md','subagents/signal-quality-reviewer.md','subagents/alert-actionability-reviewer.md','templates/telemetry-contract.md','templates/alert-review.md','templates/failure-learning-record.md','templates/handoff.md','workflows/new-service-observability.md','workflows/telemetry-gap-remediation.md','workflows/alert-quality-improvement.md','workflows/incident-observability-support.md']
def main():
    root=sys.argv[1] if len(sys.argv)>1 else '.'
    missing=[p for p in REQUIRED if not os.path.isfile(os.path.join(root,p))]
    if missing:
        print('ERROR missing files:\n'+'\n'.join(missing),file=sys.stderr); return 1
    for p in ['scripts/validate-observability-change.py','scripts/validate-package.py']:
        if os.name != 'nt' and not os.access(os.path.join(root,p),os.X_OK):
            print('ERROR not executable: '+p,file=sys.stderr); return 1
    print(f'OK: {len(REQUIRED)+1} required artifacts present; POSIX script permissions valid when applicable'); return 0
if __name__=='__main__': sys.exit(main())

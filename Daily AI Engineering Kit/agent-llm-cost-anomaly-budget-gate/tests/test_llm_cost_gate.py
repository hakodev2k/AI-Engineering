import importlib.util
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SPEC=importlib.util.spec_from_file_location('gate',ROOT/'scripts'/'llm_cost_gate.py')
gate=importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(gate)

POLICY={
 'soft_budget':2.0,'hard_budget':3.0,'per_request_max_cost':1.0,'per_user_daily_max_cost':2.0,
 'anomaly':{'lookback_points':8,'minimum_points':4,'z_score_threshold':3.0,'growth_ratio_threshold':2.5,'minimum_cost_delta':0.2},
 'approval':{'required_for_hard_budget_override':True}
}

def event(i,c,user='u'):
    return {'timestamp':'2026-08-21T00:00:00Z','provider':'p','model':'m','request_id':f'r{i}','user_id':user,'input_tokens':1,'output_tokens':1,'cost_usd':c}

def test_pass_for_small_stable_usage():
    result=gate.evaluate([event(i,0.1) for i in range(5)],POLICY)
    assert result['status']=='pass'
    assert result['findings']==[]

def test_hard_budget_requires_approval():
    result=gate.evaluate([event(1,1.6,'a'),event(2,1.6,'b')],POLICY)
    assert result['status']=='needs-approval'
    assert result['approval_required'] is True
    assert any(f['code']=='HARD_BUDGET_EXCEEDED' for f in result['findings'])

def test_request_spike_warns():
    result=gate.evaluate([event(1,0.1),event(2,1.2,'b')],POLICY)
    assert result['status']=='warn'
    assert any(f['code']=='REQUEST_COST_SPIKE' for f in result['findings'])

def test_statistical_anomaly_detected():
    events=[event(i,c,str(i)) for i,c in enumerate([0.1,0.11,0.09,0.1,0.12,0.1,0.11,0.1,0.8],1)]
    result=gate.evaluate(events,POLICY)
    assert any(f['code']=='COST_ANOMALY' for f in result['findings'])

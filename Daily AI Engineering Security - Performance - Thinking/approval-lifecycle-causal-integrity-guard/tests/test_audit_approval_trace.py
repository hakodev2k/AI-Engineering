import importlib.util
from pathlib import Path

P=Path(__file__).parents[1]/"scripts"/"audit_approval_trace.py"
spec=importlib.util.spec_from_file_location("audit",P); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)

def row(i,state,t,**kw): return (i,{"call_id":"c1","state":state,"ts_ms":t,**kw})

def test_valid_delayed_approval_is_not_execution_latency():
    r=m.audit([row(1,"requested",0),row(2,"awaiting_approval",10),row(3,"approved",5010),row(4,"executing",5020),row(5,"completed",5120)])
    assert r["blocking_violations"]==0
    assert r["intervals"]["c1"]=={"approval_wait_ms":5000,"execution_ms":100}

def test_rejected_call_cannot_execute():
    r=m.audit([row(1,"requested",0),row(2,"awaiting_approval",1),row(3,"rejected",2),row(4,"executing",3)])
    assert r["blocking_violations"]>0
    assert r["metrics"]["rejected_then_executed_count"]==1

def test_interrupt_must_not_be_flattened_to_error():
    r=m.audit([row(1,"requested",0),row(2,"failed",1,message="GraphInterrupt approval pause")])
    assert r["metrics"]["interrupt_as_error_count"]==1

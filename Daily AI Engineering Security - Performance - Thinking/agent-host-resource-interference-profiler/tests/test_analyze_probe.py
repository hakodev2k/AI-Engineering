import importlib.util
from pathlib import Path
P=Path(__file__).parents[1]/"scripts"/"analyze_probe.py"
spec=importlib.util.spec_from_file_location("probe",P); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)

def test_percentile_and_metrics():
    d={"gap_ms":[0,1,2,3,100],"process":{"count":2}}
    x=m.metrics(d)
    assert x["max_ms"]==100
    assert x["stall_gt_64"]==1
    assert x["process"]["count"]==2

def test_ratio_zero_baseline():
    assert m.ratio(0,0)==1.0
    assert m.ratio(0,1)==float('inf')

def test_affected_p95_regression_is_detectable():
    b=m.metrics({"gap_ms":[1]*100})
    a=m.metrics({"gap_ms":[1]*94+[20]*6})
    assert m.ratio(b["p95_ms"],a["p95_ms"])>1.5

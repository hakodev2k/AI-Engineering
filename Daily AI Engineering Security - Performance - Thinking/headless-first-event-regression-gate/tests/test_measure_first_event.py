import importlib.util, pathlib, sys
P=pathlib.Path(__file__).parents[1]/"scripts"/"measure_first_event.py"
spec=importlib.util.spec_from_file_location("mfe",P); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)

def test_summary_success():
    s=m.summarize([{"ok":True,"first_byte_ms":10.0,"total_ms":20.0},{"ok":True,"first_byte_ms":20.0,"total_ms":30.0}])
    assert s["successful"]==2 and s["first_byte"]["median_ms"]==15.0 and s["failure_rate"]==0

def test_run_once_observes_first_byte():
    r=m.run_once([sys.executable,"-c","import time; time.sleep(.02); print('x', flush=True)"],2,None)
    assert r["ok"] and r["first_byte_ms"] is not None and r["total_ms"]>=r["first_byte_ms"]

def test_timeout_fails():
    r=m.run_once([sys.executable,"-c","import time; time.sleep(1)"],.05,None)
    assert not r["ok"] and r["timed_out"]

def test_large_output_is_drained():
    r=m.run_once([sys.executable,"-c","import sys; sys.stdout.write('x'*200000); sys.stderr.write('e'*200000)"],3,None)
    assert r["ok"] and r["first_byte_ms"] is not None

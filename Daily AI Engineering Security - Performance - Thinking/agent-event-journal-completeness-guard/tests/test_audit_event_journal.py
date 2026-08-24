import importlib.util, pathlib
P=pathlib.Path(__file__).parents[1]/"scripts"/"audit_event_journal.py"
spec=importlib.util.spec_from_file_location("aej",P); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
def R(*xs): return list(enumerate(xs,1))

def test_valid_closed_journal():
    j=R({"seq":1,"event_id":"a","kind":"assistant_text"},{"seq":2,"event_id":"b","kind":"tool_use","tool_use_id":"t"},{"seq":3,"event_id":"c","kind":"tool_result","tool_use_id":"t"},{"seq":4,"event_id":"d","kind":"completion"})
    assert m.audit(j)["pass"]

def test_orphan_tool_use_fails():
    j=R({"seq":1,"event_id":"b","kind":"tool_use","tool_use_id":"t"},{"seq":2,"event_id":"d","kind":"completion"})
    codes={v["code"] for v in m.audit(j)["violations"]}; assert "orphan_tool_use" in codes

def test_orphan_result_fails():
    j=R({"seq":1,"event_id":"c","kind":"tool_result","tool_use_id":"t"},{"seq":2,"event_id":"d","kind":"completion"})
    assert "orphan_tool_result" in {v["code"] for v in m.audit(j)["violations"]}

def test_mirror_detects_lost_assistant_event():
    mirror=R({"seq":1,"event_id":"a","kind":"assistant_text"},{"seq":2,"event_id":"d","kind":"completion"})
    journal=R({"seq":2,"event_id":"d","kind":"completion"})
    report=m.audit(journal,mirror); assert not report["pass"] and any(v["code"]=="missing_durable_events" and "a" in v["event_ids"] for v in report["violations"])

def test_duplicate_event_and_nonmonotonic_seq_fail():
    j=R({"seq":2,"event_id":"x","kind":"assistant_text"},{"seq":1,"event_id":"x","kind":"completion"})
    codes={v["code"] for v in m.audit(j)["violations"]}; assert {"duplicate_event_id","non_monotonic_seq"} <= codes

#!/usr/bin/env python3
import importlib.util, pathlib, unittest

MODULE=pathlib.Path(__file__).parents[1]/"scripts"/"cache_stability_profiler.py"
spec=importlib.util.spec_from_file_location("profiler",MODULE)
p=importlib.util.module_from_spec(spec); spec.loader.exec_module(p)

class ProfilerTests(unittest.TestCase):
    def test_digest_stable_for_identical_structure(self):
        a={"x":[1,2],"y":"z"}
        self.assertEqual(p.digest(a),p.digest(a.copy()))

    def test_order_change_is_detected(self):
        a={"a":1,"b":2}; b={"b":2,"a":1}
        self.assertNotEqual(p.digest(a),p.digest(b))
        self.assertEqual(p.first_diff(a,b,"$.tools"),"$.tools.<key-order>")

    def test_value_change_reports_path(self):
        a={"items":[{"name":"a"}]}; b={"items":[{"name":"b"}]}
        self.assertEqual(p.first_diff(a,b),"$.items[0].name")

    def test_redacted_sensitive_field_is_allowed(self):
        self.assertFalse(p.has_secret({"access_token":"<redacted>"}))

    def test_length_change_reports_path(self):
        self.assertEqual(p.first_diff([1],[1,2],"$.tools"),"$.tools.<length>")

if __name__=="__main__": unittest.main()

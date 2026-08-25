import importlib.util,pathlib,unittest,json
P=pathlib.Path(__file__).parents[1]/"scripts"/"analyze_regression.py"
spec=importlib.util.spec_from_file_location("analyzer",P); analyzer=importlib.util.module_from_spec(spec); spec.loader.exec_module(analyzer)
POLICY={"min_samples_per_scenario":3,"ratio_thresholds":{"cpu_percent":2.0,"input_stall_ms":3.0},"absolute_thresholds":{"input_stall_ms":50.0}}

def rows(cpu,stall):
    return [{"scenario":"x","cpu_percent":cpu,"read_mb_s":1,"write_mb_s":1,"working_set_mb":100,"handles":100,"threads":10,"input_stall_ms":stall} for _ in range(4)]

class RegressionTests(unittest.TestCase):
    def test_detects_regression(self):
        r=analyzer.analyze(rows(5,5),rows(15,60),POLICY)
        self.assertEqual(r["status"],"regression")
        self.assertTrue(any(x["metric"]=="cpu_percent" for x in r["regressions"]))
        self.assertTrue(any(x["metric"]=="input_stall_ms" for x in r["regressions"]))
    def test_pass(self):
        self.assertEqual(analyzer.analyze(rows(5,5),rows(6,6),POLICY)["status"],"pass")
    def test_insufficient(self):
        self.assertEqual(analyzer.analyze(rows(5,5)[:1],rows(6,6),POLICY)["status"],"invalid")
    def test_zero_baseline_serializes_and_flags(self):
        r=analyzer.analyze(rows(0,0),rows(1,1),POLICY)
        self.assertEqual(r["status"],"regression")
        self.assertEqual(r["p95_ratios"]["cpu_percent"],"infinite")
        json.dumps(r,allow_nan=False)

if __name__=="__main__": unittest.main()

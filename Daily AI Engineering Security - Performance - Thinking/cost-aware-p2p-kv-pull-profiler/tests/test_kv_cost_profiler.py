import unittest
from scripts.kv_cost_profiler import analyze

def rows():
    out=[]
    for t,pull,recomp in [(2000,40,100),(8000,60,300),(16000,90,650)]:
        for _ in range(3):
            out.append({"mode":"pull","prefix_tokens":t,"dest_load":16.0,"topology":"rdma","model":"m","hardware":"h200","latency_ms":pull,"success":True})
            out.append({"mode":"recompute","prefix_tokens":t,"dest_load":16.0,"topology":"rdma","model":"m","hardware":"h200","latency_ms":recomp,"success":True})
    return out

class Tests(unittest.TestCase):
    def test_measured_segment(self):
        r=analyze(rows(),3)[0]
        self.assertEqual(r["status"],"measured")
        self.assertIsNotNone(r["crossover_prefix_tokens"])
        self.assertLess(r["pull_p95_ms"],r["recompute_p95_ms"])
    def test_insufficient(self):
        r=analyze(rows()[:2],3)[0]
        self.assertEqual(r["status"],"insufficient_evidence")
    def test_failed_pull_rate(self):
        data=rows(); data.append({"mode":"pull","prefix_tokens":8000,"dest_load":16.0,"topology":"rdma","model":"m","hardware":"h200","latency_ms":500,"success":False})
        r=analyze(data,3)[0]
        self.assertGreater(r["failed_pull_rate"],0)

if __name__=="__main__": unittest.main()

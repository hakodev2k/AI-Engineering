import unittest
from scripts.image_context_budget import evaluate

POLICY={"max_descendants":2,"max_inherited_image_bytes_per_child":100,"max_task_family_rollout_bytes":500,"max_input_tokens_per_turn":1000,"max_image_payload_bytes_per_turn":100,"max_p95_latency_ms":1000,"minimum_cached_fraction_warning":0.9}

def row(t,p=None,input_tokens=100,cached=50,image=10,inherited=10,rollout=100,latency=100):
    return {"thread_id":t,"parent_thread_id":p,"input_tokens":input_tokens,"cached_input_tokens":cached,"image_payload_bytes":image,"inherited_image_bytes":inherited,"rollout_bytes":rollout,"latency_ms":latency}

class Tests(unittest.TestCase):
    def test_healthy_family_allowed(self):
        r=evaluate([row("root"),row("child","root")],POLICY)
        self.assertTrue(r["ok"])
    def test_inherited_image_budget_blocks(self):
        r=evaluate([row("root"),row("child","root",inherited=101)],POLICY)
        self.assertFalse(r["ok"]); self.assertIn("max_inherited_image_bytes>max_inherited_image_bytes_per_child",r["violations"])
    def test_rollout_budget_blocks(self):
        r=evaluate([row("root",rollout=400),row("child","root",rollout=200)],POLICY)
        self.assertFalse(r["ok"])
    def test_high_cached_fraction_is_only_warning(self):
        r=evaluate([row("root",input_tokens=1100,cached=1050)],POLICY)
        self.assertFalse(r["ok"]); self.assertTrue(r["warnings"])

if __name__=="__main__": unittest.main()

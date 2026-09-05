import importlib.util, unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1]
S=importlib.util.spec_from_file_location("gate",R/"scripts/shutdown_drain_gate.py"); G=importlib.util.module_from_spec(S); S.loader.exec_module(G)
P={"minimum_drain_margin_seconds":5,"minimum_termination_margin_seconds":5,"require_readiness_removed_before_drain":True,"require_stop_accepting_new_work":True,"require_cancellation_propagation":True,"require_safe_checkpoint_or_ack_for_non_http_work":True,"require_bounded_force_termination":True}
def snap(**kw):
    s={"service":"svc","stop_accepting_new_work":True,"readiness_removed_before_drain":True,"cancellation_propagated":True,"drain_timeout_seconds":35,"max_handler_seconds":30,"termination_grace_period_seconds":40,"force_termination_after_timeout":True,"work_sources":["http","queue"],"checkpoint_or_ack_safe":True}; s.update(kw); return s
class T(unittest.TestCase):
    def test_safe_snapshot_passes(self): self.assertEqual("pass",G.evaluate(G.validate(snap()),P)["status"])
    def test_admission_leak_blocks(self): self.assertEqual("fail",G.evaluate(G.validate(snap(stop_accepting_new_work=False)),P)["status"])
    def test_short_drain_blocks(self): self.assertEqual("fail",G.evaluate(G.validate(snap(drain_timeout_seconds=20)),P)["status"])
    def test_short_platform_grace_blocks(self): self.assertEqual("fail",G.evaluate(G.validate(snap(termination_grace_period_seconds=39)),P)["status"])
    def test_queue_requires_safe_ack(self): self.assertEqual("fail",G.evaluate(G.validate(snap(checkpoint_or_ack_safe=False)),P)["status"])
    def test_http_only_does_not_require_checkpoint(self): self.assertEqual("pass",G.evaluate(G.validate(snap(work_sources=["http"],checkpoint_or_ack_safe=False)),P)["status"])
    def test_unknown_source_rejected(self):
        with self.assertRaises(ValueError): G.validate(snap(work_sources=["socket"]))
if __name__=="__main__": unittest.main()

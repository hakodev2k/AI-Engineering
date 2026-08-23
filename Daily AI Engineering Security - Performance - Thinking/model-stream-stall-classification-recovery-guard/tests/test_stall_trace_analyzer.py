import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).parents[1]/'scripts'/'stall_trace_analyzer.py'
spec=importlib.util.spec_from_file_location('sta',P); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)

class TestAnalyzer(unittest.TestCase):
    def test_fixed_boundary_abort(self):
        e=[{'timestamp':0,'kind':'request_start'},{'timestamp':1,'kind':'tool_result'},{'timestamp':600001,'kind':'watchdog_abort'}]
        self.assertEqual(m.analyze(e,600000)['classification'],'fixed_boundary_abort')
    def test_transport_dead(self):
        e=[{'timestamp':0,'kind':'request_start'},{'timestamp':1000,'kind':'transport_error'}]
        self.assertEqual(m.analyze(e,600000)['classification'],'transport_dead')
    def test_active_retry(self):
        e=[{'timestamp':0,'kind':'request_start'},{'timestamp':100,'kind':'retry_start'},{'timestamp':700000,'kind':'watchdog_abort'}]
        self.assertEqual(m.analyze(e,600000)['classification'],'retry_active')
    def test_healthy_chunks(self):
        e=[{'timestamp':0,'kind':'request_start'},{'timestamp':500000,'kind':'stream_chunk'},{'timestamp':550000,'kind':'request_end'}]
        self.assertEqual(m.analyze(e,600000)['classification'],'slow_or_healthy')
    def test_empty_rejected(self):
        with self.assertRaises(ValueError): m.analyze([],600000)

if __name__=='__main__': unittest.main()
import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).parents[1]/"scripts"/"readonly_guard.py"
spec=importlib.util.spec_from_file_location("guard",P); guard=importlib.util.module_from_spec(spec); spec.loader.exec_module(guard)
class TestGuard(unittest.TestCase):
    def test_documentdb_write_stages(self):
        for stage in ("$out","$merge"):
            self.assertEqual("write",guard.classify("documentdb",{"pipeline":[{stage:"x"}]})[0])
    def test_documentdb_read(self): self.assertEqual("read",guard.classify("documentdb",{"pipeline":[{"$match":{"x":1}}]})[0])
    def test_sql_admin_side_effect(self): self.assertEqual("write",guard.classify("sql",{"query":"SELECT pg_terminate_backend(42)"})[0])
    def test_sql_read(self): self.assertEqual("read",guard.classify("sql",{"query":"SELECT id FROM users"})[0])
    def test_cypher_call_blocked(self): self.assertEqual("write",guard.classify("cypher",{"query":"CALL apoc.periodic.iterate('MATCH (n) RETURN n','SET n.x=1',{})"})[0])
    def test_unknown_fails_closed(self): self.assertEqual("unknown",guard.classify("sql",{"query":"PRAGMA something"})[0])
if __name__=="__main__": unittest.main()

import importlib.util
import pathlib
import unittest

SCRIPT=pathlib.Path(__file__).parents[1]/"scripts"/"check_cache_entry.py"
spec=importlib.util.spec_from_file_location("gate",SCRIPT)
gate=importlib.util.module_from_spec(spec); spec.loader.exec_module(gate)
POLICY={"trusted_server_ids":["trusted"],"public_endpoints":["server/version"],"forbidden_shared_fields":["instructions","tools","prompts","resources","secrets","user_data"],"allow_authenticated_shared_cache":False}

class Tests(unittest.TestCase):
    def test_allows_narrow_public_entry(self):
        e={"cache_scope":"public","cache_kind":"shared","endpoint":"server/version","server_id":"trusted","protocol_version":"2026-07-28","principal":None,"content_fields":["version"],"cache_key_parts":["server_id","protocol_version"]}
        self.assertEqual([],gate.validate(POLICY,e))
    def test_blocks_public_tools(self):
        e={"cache_scope":"public","cache_kind":"shared","endpoint":"tools/list","server_id":"trusted","protocol_version":"2026-07-28","principal":None,"content_fields":["tools"],"cache_key_parts":["server_id","protocol_version"]}
        errs=gate.validate(POLICY,e); self.assertTrue(any("not allowlisted" in x for x in errs)); self.assertTrue(any("forbidden" in x for x in errs))
    def test_blocks_untrusted_server(self):
        e={"cache_scope":"public","cache_kind":"shared","endpoint":"server/version","server_id":"evil","protocol_version":"2026-07-28","principal":None,"content_fields":["version"],"cache_key_parts":["server_id","protocol_version"]}
        self.assertTrue(any("trusted server" in x for x in gate.validate(POLICY,e)))
    def test_private_key_requires_principal_dimension(self):
        e={"cache_scope":"private","cache_kind":"private","endpoint":"resources/read","server_id":"trusted","protocol_version":"2026-07-28","principal":"user-a","content_fields":["resources"],"cache_key_parts":["server_id","protocol_version"]}
        self.assertTrue(any("principal" in x for x in gate.validate(POLICY,e)))
    def test_invalid_scope_fails_closed(self):
        e={"cache_scope":"","cache_kind":"shared","endpoint":"server/version","server_id":"trusted","protocol_version":"2026-07-28","principal":None,"content_fields":["version"],"cache_key_parts":["server_id","protocol_version"]}
        self.assertTrue(any("invalid cache_scope" in x for x in gate.validate(POLICY,e)))

if __name__=="__main__": unittest.main()

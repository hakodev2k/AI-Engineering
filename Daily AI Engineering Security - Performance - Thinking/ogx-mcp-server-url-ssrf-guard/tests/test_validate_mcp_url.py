import importlib.util, pathlib, unittest
from unittest.mock import patch
P=pathlib.Path(__file__).parents[1]/'scripts'/'validate_mcp_url.py'
s=importlib.util.spec_from_file_location('v',P); v=importlib.util.module_from_spec(s); s.loader.exec_module(v)
class T(unittest.TestCase):
 def test_http_denied(self): self.assertFalse(v.validate('http://example.com')[0])
 def test_userinfo_denied(self): self.assertFalse(v.validate('https://u:p@example.com')[0])
 @patch('socket.getaddrinfo',return_value=[(2,1,6,'',('127.0.0.1',443))])
 def test_loopback_denied(self,_): self.assertFalse(v.validate('https://x.test')[0])
 @patch('socket.getaddrinfo',return_value=[(2,1,6,'',('10.0.0.3',443))])
 def test_private_denied(self,_): self.assertFalse(v.validate('https://x.test')[0])
 @patch('socket.getaddrinfo',return_value=[(2,1,6,'',('93.184.216.34',443))])
 def test_public_allowed(self,_): self.assertTrue(v.validate('https://example.com')[0])
if __name__=='__main__': unittest.main()

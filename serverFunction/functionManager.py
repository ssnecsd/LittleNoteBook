from serverFunction.login import login
from serverFunction.testSpider import testSpider


class FunctionManager(object):
    def __init__(self,file_name,request_params):
        self.file_name=file_name
        self.request_params=request_params

    def _f_manager(self,):
        # 将url从get请求的参数处分开
        file_name = self.file_name.split("?", 1)[0]
        if '/testSpider' == file_name:
            response_body=testSpider(self.request_params)
        elif '/login' == file_name:
            response_body=login(self.request_params)
        elif '' == file_name:
            response_body=0
        else:
            response_body=0
        return response_body

    def response_maker(self):
        response_body= self._f_manager()
        # 正常时
        if not 0 == response_body:
            response_start_line = "HTTP/1.1 200 OK\r\n"
            response_headers = "Server: My server\r\n"
        # 异常时
        else:
            response_start_line = "HTTP/1.1 404 Not Found\r\n"
            response_headers = "Server: My server\r\n"
            response_body = "the name is not define"
        # 返回response
        response = response_start_line + response_headers + "\r\n" + response_body
        return response









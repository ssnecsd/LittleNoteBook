from serverFunction.functions.login import login
from serverFunction.functions.testSpider import testSpider
from serverFunction.functions.get_article_group import get_article_group
from serverFunction.functions.get_article_info import get_article_info
from serverFunction.functions.get_articles_by_group import get_articles_by_group
from serverFunction.functions.get_recent_articles import get_recent_articles
from serverFunction.functions.load_article import load_article
from serverFunction.functions.search_article_by_date import search_article_by_date
from serverFunction.functions.search_article_by_key import search_article_by_key
from serverFunction.functions.sign_in import sign_in



class FunctionManager(object):
    def __init__(self,file_name,request_params):
        self.file_name=file_name
        self.request_params=request_params

    def _f_manager(self,):
        # 将url从get请求的参数处分开
        file_name = self.file_name.split("?", 1)[0]

        if '/get_article_group' == file_name:
            response_body = get_article_group(self.request_params)

        elif '/get_article_info' == file_name:
            response_body = get_article_info(self.request_params)

        elif '/get_articles_by_group' == file_name:
            response_body = get_articles_by_group(self.request_params)

        elif '/get_recent_articles' == file_name:
            response_body  = get_recent_articles(self.request_params)

        elif '/load_article' == file_name:
            response_body = load_article(self.request_params)

        elif '/login' == file_name:
            response_body = login(self.request_params)

        elif '/search_article_by_date' == file_name:
            response_body = search_article_by_date(self.request_params)

        elif '/search_article_by_key' == file_name:
            response_body = search_article_by_key(self.request_params)

        elif '/sign_in' == file_name:
            response_body = sign_in(self.request_params)

        elif '/testSpider' == file_name:
            response_body = testSpider(self.request_params)

        else:
            response_body = 0
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









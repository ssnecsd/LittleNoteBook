from serverFunction.functions.excerpt.get_recent_excerpt import get_recent_excerpt
from serverFunction.functions.login import login
from serverFunction.functions.testSpider import testSpider
from serverFunction.functions.article.get_article_group import get_article_group
from serverFunction.functions.article.get_article_info import get_article_info
from serverFunction.functions.article.get_articles_by_group import get_articles_by_group
from serverFunction.functions.article.get_recent_articles import get_recent_articles
from serverFunction.functions.article.load_article import load_article
from serverFunction.functions.article.search_article_by_date import search_article_by_date
from serverFunction.functions.article.search_article_by_key import search_article_by_key
from serverFunction.functions.sign_in import sign_in
from serverFunction.functions.article.delete_article_group import delete_article_group
from serverFunction.functions.article.initial_article_group_list import initial_article_group_list
from serverFunction.functions.article.new_article_group import new_article_group
from serverFunction.functions.article.reset_article_group import reset_article_group
from serverFunction.functions.article.save_article import save_article
from serverFunction.functions.article.delete_article import delete_article
from serverFunction.functions.article.move_article import move_article

from serverFunction.functions.excerpt.delete_excerpt_group import delete_excerpt_group
from serverFunction.functions.excerpt.delete_excerpt import delete_excerpt
from serverFunction.functions.excerpt.get_excerpt_by_group import get_excerpt_by_group
from serverFunction.functions.excerpt.new_excerpt_group import new_excerpt_group
from serverFunction.functions.excerpt.reset_excerpt_group import reset_excerpt_group
from serverFunction.functions.excerpt.save_excerpt import save_excerpt
from serverFunction.functions.excerpt.initial_excerpt_group_list import initial_excerpt_group_list


class FunctionManager(object):
    def __init__(self, file_name, request_params):
        self.file_name = file_name
        self.request_params = request_params

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
            response_body = get_recent_articles(self.request_params)

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

        elif '/delete_article_group' == file_name:
            response_body = delete_article_group(self.request_params)

        elif '/initial_article_group_list' == file_name:
            response_body = initial_article_group_list(self.request_params)

        elif '/new_article_group' == file_name:
            response_body = new_article_group(self.request_params)

        elif '/reset_article_group' == file_name:
            response_body = reset_article_group(self.request_params)

        elif '/save_article' == file_name:
            response_body = save_article(self.request_params)

        elif '/delete_article' == file_name:
            response_body = delete_article(self.request_params)

        elif '/move_article' == file_name:
            response_body = move_article(self.request_params)

        elif '/delete_excerpt' == file_name:
            response_body = delete_excerpt(self.request_params)

        elif '/delete_excerpt_group' == file_name:
            response_body = delete_excerpt_group(self.request_params)

        elif '/get_excerpt_by_group' == file_name:
            response_body = get_excerpt_by_group(self.request_params)

        elif '/initial_excerpt_group_list' == file_name:
            response_body = initial_excerpt_group_list(self.request_params)

        elif '/new_excerpt_group' == file_name:
            response_body = new_excerpt_group(self.request_params)

        elif '/reset_excerpt_group' == file_name:
            response_body = reset_excerpt_group(self.request_params)

        elif '/save_excerpt' == file_name:
            response_body = save_excerpt(self.request_params)

        elif '/get_recent_excerpt' == file_name:
            response_body = get_recent_excerpt(self.request_params)



        else:
            response_body = 0
        return response_body

    def response_maker(self):
        response_body = self._f_manager()
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









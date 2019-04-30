import json
import datetime
from serverFunction.dbHelper import db_excute_select


# 重写构造json类
class CJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, datetime.date):
            return obj.strftime("%Y-%m-%d")
        else:
            return json.JSONEncoder.default(self, obj)


def search_article_by_key(request_params):
    user_id=request_params['user_id']
    article_key =request_params['article_key']
    article_key = '%'+article_key+'%'

    #对文章进行模糊搜索
    sql = "SELECT * FROM userdb.article_info where user_id='%s' and title LIKE  '%s' "% (user_id,article_key)
    title_list = db_excute_select(sql)

    #打包返回
    article_dic = []
    for title in title_list:
        articleDict = {'title':title[1],
                       'article_id':title[0],
                       'image_url':title[2],
                        'create_time':title[4]}
        article_dic.append(articleDict)
    response = {
    'article_dic': article_dic,
    }
    response_body = json.dumps(response, cls=CJsonEncoder)
    return response_body

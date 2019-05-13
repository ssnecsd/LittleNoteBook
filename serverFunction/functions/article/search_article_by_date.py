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


def search_article_by_date(request_params):
    user_id = request_params['user_id']
    article_date=request_params['article_date']
    #转化date
    article_date_begin = article_date+' 00:00:00'
    article_date_end = article_date+' 23:59:59'
    sql = "SELECT * FROM userdb.article_info where user_id='%s' and(create_time>='%s'" \
          "and create_time<='%s')" %(user_id,article_date_begin,article_date_end)


    info = db_excute_select(sql)
    article_dic = []
    for article_info in info:
        articleDic = {'title':article_info[1],
                       'article_id':article_info[0],
                       'image_url':article_info[2],
                        'create_time':article_info[4]}
        article_dic.append(articleDic)

    response = {
        'article_dic': article_dic,
    }
    response_body = json.dumps(response, cls=CJsonEncoder)
    return response_body
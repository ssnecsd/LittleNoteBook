import datetime
import json

from serverFunction.dbHelper import db_excute

# 重写构造json类
class CJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, datetime.date):
            return obj.strftime("%Y-%m-%d")
        else:
            return json.JSONEncoder.default(self, obj)

def get_recent_articles(request_params):
    user_id=request_params['user_id']
    recent_article_list=[]

    sql = "SELECT * FROM userdb.article_info where user_id='%s'" % user_id
    res = db_excute(sql)
    for item in res:
        article_dic={}
        article_dic['title']=item[1]
        article_dic['image_url']=item[2]
        article_dic['article_id'] = item[0]
        article_dic['last_modify'] = item[5]
        recent_article_list.append(article_dic)

    response = {
        'recent_article_list': recent_article_list,
    }
    response_body = json.dumps(response, cls=CJsonEncoder)
    return response_body

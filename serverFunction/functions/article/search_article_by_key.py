import json
import datetime
import time

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
    # 返回时间按降序排列
    sql = "SELECT * FROM article_info where user_id='%s' and title LIKE  '%s' order by create_time DESC "\
          % (user_id, article_key)
    title_list = db_excute_select(sql)

    #打包返回
    article_dic = []
    for title in title_list:
        # 将时间转为时间戳格式
        timearry = time.strptime(title[5].strftime("%Y-%m-%d %H:%M:%S"), "%Y-%m-%d %H:%M:%S")
        # 时间只需要精确到天
        create_time = time.strftime("%Y-%m-%d", timearry)
        articleDict = {'title': title[1],
                       'article_id': title[0],
                       'image_url': title[2],
                        'create_time': create_time}
        article_dic.append(articleDict)
    response = {
    'article_list': article_dic,
    }
    response_body = json.dumps(response, cls=CJsonEncoder)
    return response_body

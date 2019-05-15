
import datetime
import json
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


def get_recent_articles(request_params):
    user_id = request_params['user_id']
    recent_article_list = []

    # 按时间降序排列
    sql = "SELECT * FROM article_info where user_id='%s' order by last_modify desc " % user_id
    res = db_excute_select(sql)
    for item in res:
        # 将时间转为时间戳格式
        timearry = time.strptime(item[5].strftime("%Y-%m-%d %H:%M:%S"), "%Y-%m-%d %H:%M:%S")
        time_stamp = time.mktime(timearry)
        # 取近一年的记录
        if (time_stamp + float(60 * 60 * 24 * 365)) > time.time():

            # 时间只需要精确到天
            last_modify = time.strftime("%Y-%m-%d", timearry)
            article_dic = {}
            article_dic['title'] = item[1]
            article_dic['image_url'] = item[2]
            article_dic['article_id'] = item[0]
            article_dic['last_modify'] = last_modify
            recent_article_list.append(article_dic)

    response = {
        'recent_article_list': recent_article_list,
    }
    response_body = json.dumps(response, cls=CJsonEncoder)
    return response_body

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

def get_articles_by_group(request_params):
    user_id = request_params['user_id']
    group_name = request_params['group_name']
    article_list = []

    # 获取分组的颜色
    sql = "SELECT * FROM article_group where user_id='%s' and group_name='%s'" % (user_id, group_name)
    result = db_excute_select(sql)
    group_color = result[0][2]

    # 按时间降序排列
    sql = "SELECT * FROM article_info where user_id='%s' and group_name='%s' order by create_time DESC "\
          % (user_id, group_name)
    res = db_excute_select(sql)
    for item in res:
        # 将时间转为时间戳格式
        timearry = time.strptime(item[4].strftime("%Y-%m-%d %H:%M:%S"), "%Y-%m-%d %H:%M:%S")
        # 时间只需要精确到天
        create_time = time.strftime("%Y-%m-%d", timearry)
        article_dic ={}
        article_dic['title'] = item[1]
        article_dic['image_url'] = item[2]
        article_dic['article_id'] = item[0]
        article_dic['create_time'] = create_time
        article_dic['group_color'] = group_color
        article_list.append(article_dic)
    response = {
        'article_list': article_list,
    }
    response_body = json.dumps(response, cls=CJsonEncoder)
    return response_body

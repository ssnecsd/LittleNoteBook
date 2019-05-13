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


def get_recent_excerpt(request_params):
    user_id = request_params['user_id']
    recent_excerpt_list = []

    sql = "SELECT * FROM excerpt_info where user_id='%s'" % user_id
    res = db_excute_select(sql)
    for item in res:
        # 将时间转为时间戳格式
        timearry = time.strptime(item[3].strftime("%Y-%m-%d %H:%M:%S"), "%Y-%m-%d %H:%M:%S")
        time_stamp = time.mktime(timearry)
        # 取近十天的记录
        if (time_stamp + float(60*60*24*10)) >time.time():
            excerpt_dic = {}
            path = item[5]
            with open(path + '.txt', 'r') as f:
                excerpt_content = json.loads(f.read())
                f.close()

            # 时间只需要精确到天
            create_time = time.strftime("%Y-%m-%d", timearry)
            excerpt_dic['title'] = item[1]
            excerpt_dic['excerpt_id'] = item[0]
            excerpt_dic['create_time'] = create_time
            excerpt_dic['excerpt_content'] = excerpt_content
            excerpt_dic['article_id'] = item[2]
        recent_excerpt_list.append(excerpt_dic)

    response = {
        'recent_excerpt_list': recent_excerpt_list,
    }
    response_body = json.dumps(response, cls=CJsonEncoder)
    return response_body


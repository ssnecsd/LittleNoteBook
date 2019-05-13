# 按分组获取摘抄
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


def get_excerpt_by_group(request_params):
    user_id = request_params['user_id']
    group_name = request_params['group_name']
    excerpt_list = []

    # 从分组表里面拿东西
    sql = "SELECT * FROM excerpt_group where user_id='%s' and group_name='%s'" % (user_id, group_name)
    result = db_excute_select(sql)
    group_color = result[0][2]

    # 从摘抄表里面拿东西
    sql = "SELECT * FROM excerpt_info where user_id='%s' and group_name='%s'" % (user_id, group_name)
    res = db_excute_select(sql)

    for item in res:
        # 从文件系统中读取摘抄内容
        path = item[5]
        # 将时间转为时间戳格式
        timearry = time.strptime(item[3].strftime("%Y-%m-%d %H:%M:%S"), "%Y-%m-%d %H:%M:%S")
        create_time = time.strftime("%Y-%m-%d", timearry)
        with open(path + '.txt', 'r') as f:
            excerpt_content = json.loads(f.read())
            f.close()
        excerpt_dic = {'title': item[1],
                       'create_time': create_time,
                       'excerpt_content': excerpt_content,
                       'group_color': group_color,
                       'article_id': item[2],
                       'group_name':group_name
                       }
        excerpt_list.append(excerpt_dic)

    response = {
        'excerpt_list': excerpt_list,
    }
    response_body = json.dumps(response, cls=CJsonEncoder)
    return response_body

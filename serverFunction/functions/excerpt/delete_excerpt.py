# 删除摘抄
import json
import os
import datetime
from serverFunction.dbHelper import db_excute_insert, db_excute_select


# 重写构造json类
class CJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, datetime.date):
            return obj.strftime("%Y-%m-%d")
        else:
            return json.JSONEncoder.default(self, obj)


def delete_excerpt(request_params):
    user_id = request_params['user_id']
    article_id = request_params['article_id']
    excerpt_id = request_params['excerpt_id']
    status_code = 1

    # 找到摘抄的路径并删除
    sql = "SELECT * FROM excerpt_info where user_id='%s' and article_id='%s' and excerpt_id='%s'" \
          % (user_id, article_id, excerpt_id)
    res = db_excute_select(sql)
    path = res[0][5]
    os.remove(path + '.txt')

    # 分组对应的摘抄数减1
    sql = "update excerpt_group set excerpt_count = excerpt_count - 1 where group_name ='%s' and user_id = '%s'" % \
          (res[0][6], user_id)
    if not db_excute_insert(sql):
        status_code = 0

    # 删除数据库中的记录
    sql = "DELETE FROM excerpt_info where user_id='%s' and article_id='%s' and excerpt_id='%s'" \
          % (user_id, article_id, excerpt_id)
    # 删除分组失败
    if not db_excute_insert(sql):
        status_code = 0

        # 构造一个用户所有摘抄信息的list
    sql = "SELECT * FROM excerpt_info where user_id='%s'" \
          % user_id
    result = db_excute_select(sql)
    excerpt_list = []
    for item in result:
        excerpt_dict = {'title': item[1], 'excerpt_id': item[0], 'create_time': item[3]}
        excerpt_list.append(excerpt_dict)

    response = {
        'state_code': status_code,
        'excerpt_list': excerpt_list
    }
    response_body = json.dumps(response, cls=CJsonEncoder)
    return response_body

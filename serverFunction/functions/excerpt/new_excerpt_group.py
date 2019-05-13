#新建摘抄分组
import json

from serverFunction.dbHelper import db_excute_insert


def new_excerpt_group(request_params):
    user_id = request_params['user_id']
    group_name = request_params['group_name']
    group_color = request_params['group_color']
    group_count = 0
    status_code = 1

    sql = "insert into excerpt_group values('%s','%s','%s','%d')" % \
          (group_name, user_id, group_color, group_count)
    # 新建分组失败
    if not db_excute_insert(sql):
        status_code = 0

    response = {
        'state_code': status_code,
    }
    response_body = json.dumps(response)
    return response_body

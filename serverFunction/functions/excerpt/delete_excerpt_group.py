#删除摘抄分组
import json

from serverFunction.dbHelper import db_excute_insert


def delete_excerpt_group(request_params):
    user_id = request_params['user_id']
    group_name = request_params['group_name']
    status_code = 1
    sql = "DELETE FROM excerpt_group where user_id='%s' and group_name='%s'" % (user_id, group_name)
    # 删除分组失败
    if not db_excute_insert(sql):
        status_code = 0

    response = {
        'state_code': status_code,
    }
    response_body = json.dumps(response)
    return response_body

#显示摘抄分组

import json
from serverFunction.dbHelper import db_excute_select


def initial_excerpt_group_list(request_params):
    user_id = request_params['user_id']
    group_lists = []
    sql = "SELECT * FROM excerpt_group where user_id='%s'" % user_id
    res = db_excute_select(sql)

    for item in res:
        group_dict = {
            'group_name': item[0],
            'group_color': item[2],
            'excerpt_count': item[3]
        }
        group_lists.append(group_dict)

    response = {
        'excerpt_group_list': group_lists,
    }
    response_body = json.dumps(response)
    return response_body

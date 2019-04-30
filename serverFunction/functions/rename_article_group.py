import json

from serverFunction.dbHelper import db_excute_insert


def rename_article_group(request_params):
    user_id = request_params['user_id']
    group_name = request_params['group_name']
    group_color = request_params['group_color']
    status_code = 1

    sql = "update article_group set group_name = '%s' where user_id = '%s' and group_color = '%s'" % (group_name, user_id, group_color)
    if not db_excute_insert(sql):
        status_code = 0

    response = {
        'status_code': status_code,
    }
    response_body = json.dumps(response)
    return response_body

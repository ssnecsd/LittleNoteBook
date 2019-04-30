import json

from serverFunction.dbHelper import db_excute_select


def get_article_group(request_params):
    user_id=request_params['user_id']
    group_lists=[]
    sql = "SELECT * FROM article_group where user_id='%s'" % user_id
    res = db_excute_select(sql)


    for item in res:
        group_dict = {
            'name' : item[0],
            'count' : item[3]
        }
        group_lists.append(group_dict)

    response = {
        'group_lists': group_lists,
    }
    response_body = json.dumps(response)
    return response_body

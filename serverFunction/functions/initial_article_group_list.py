import json

from serverFunction.dbHelper import db_excute_select


def initial_article_group_list(request_params):
    user_id=request_params['user_id']
    group_lists=[]
    sql = "SELECT * FROM article_group where user_id='%s'" % user_id
    res = db_excute_select(sql)


    for item in res:
        group_dict = {
            'group_name' : item[0],
            'group_color': item[2],
            'article_count' : item[3]
        }
        group_lists.append(group_dict)

    response = {
        'article_group_lists': group_lists,
    }
    response_body = json.dumps(response)
    return response_body

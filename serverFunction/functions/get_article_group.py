import json

from serverFunction.dbHelper import db_excute_select


def get_article_group(request_params):
    user_id=request_params['user_id']
    group_lists=[]
    sql = "SELECT * FROM userdb.article_info where user_id='%s'" % user_id
    res = db_excute_select(sql)
    name_to_count={}
    for item in res:
        name = item[7]
        if name not in name_to_count.keys():
            name_to_count[name]=1
        else:
            name_to_count[name]+=1
    for key in name_to_count.keys():
        gr={}
        gr['name']=key
        gr['count']=name_to_count[key]
        group_lists.append(gr)

    response = {
        'group_lists': group_lists,
    }
    response_body = json.dumps(response)
    return response_body

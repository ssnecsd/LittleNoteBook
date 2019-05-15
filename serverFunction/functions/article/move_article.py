import json

from serverFunction.dbHelper import db_excute_insert, db_excute_select
from serverFunction.functions.article.initial_article_group_list import initial_article_group_list


def move_article(request_params):
    user_id = request_params['user_id']
    article_id = request_params['article_id']
    group_name = request_params['group_name']
    status_code = 1


    # 确定分组
    sql = "SELECT group_name FROM article_info where user_id='%s'and article_id = '%s'" \
          % (user_id, article_id)
    res = db_excute_select(sql)

    sql = "update article_info set group_name = '%s' where article_id ='%s' and user_id = '%s'" \
          % (group_name, article_id, user_id)
    if not db_excute_insert(sql):
        status_code = 0

    # 新分组加1
    sql = "update article_group set article_count = article_count + 1 where group_name ='%s' and user_id = '%s'" % \
          (group_name, user_id)
    if not db_excute_insert(sql):
        status_code = 0

    # 旧分组减1
    sql = "update article_group set article_count = article_count - 1 where group_name ='%s' and user_id = '%s'" % \
          (res[0][0], user_id)
    if not db_excute_insert(sql):
        status_code = 0

        # 调用相对应的模块
    request = {
        'user_id': user_id,
    }
    article_group_list = json.loads(initial_article_group_list(request))
    article_group_list  = article_group_list['article_group_lists']
    response = {
        'article_group_lists': article_group_list,
        'status_code': status_code
    }
    response_body = json.dumps(response)
    return response_body

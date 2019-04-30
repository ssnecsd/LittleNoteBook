import json

from serverFunction.dbHelper import db_excute_insert, db_excute_select


def rename_article_group(request_params):
    user_id = request_params['user_id']
    new_group_name = request_params['new_group_name']
    old_group_name = request_params['old_group_name']
    group_color = request_params['group_color']
    status_code = 1

    #查询原分组含有文章的个数
    sql = "SELECT article_count FROM article_group where user_id='%s'and group_name = '%s'" \
          % (user_id, old_group_name)
    res = db_excute_select(sql)

    #插入新的分组
    sql = "insert into article_group values('%s','%s','%s','%d')" % \
          (new_group_name, user_id, group_color, res[0][0])
    if not db_excute_insert(sql):
        status_code = 0

    # 改文章表的分组
    sql = "update article_info set group_name = '%s' where group_name ='%s' and user_id = '%s'" \
        % (new_group_name, old_group_name, user_id)
    if not db_excute_insert(sql):
        status_code = 0

    #删除旧的分组
    sql = "DELETE FROM article_group where user_id = '%s' and group_name = '%s '"% \
          (user_id, old_group_name)
    if not db_excute_insert(sql):
        status_code = 0

    response = {
        'status_code': status_code,
    }
    response_body = json.dumps(response)
    return response_body

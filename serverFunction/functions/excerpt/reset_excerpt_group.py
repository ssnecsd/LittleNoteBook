#重命名摘抄分组

import json
from serverFunction.dbHelper import db_excute_insert, db_excute_select


def reset_excerpt_group(request_params):
    user_id = request_params['user_id']
    new_group_name = request_params['new_group_name']
    old_group_name = request_params['old_group_name']
    group_color = request_params['group_color']
    status_code = 1

    #查询原分组含有文章的个数
    sql = "SELECT excerpt_count FROM excerpt_group where user_id='%s'and group_name = '%s'" \
          % (user_id, old_group_name)
    res = db_excute_select(sql)

    #插入新的分组
    sql = "insert into excerpt_group values('%s','%s','%s','%d')" % \
          (new_group_name, user_id, group_color, res[0][0])
    if not db_excute_insert(sql):
        status_code = 0

    # 改摘抄表的分组
    sql = "update excerpt_info set group_name = '%s' where group_name ='%s' and user_id = '%s'" \
        % (new_group_name, old_group_name, user_id)
    if not db_excute_insert(sql):
        status_code = 0

    #删除旧的分组
    sql = "DELETE FROM excerpt_group where user_id = '%s' and group_name = '%s '" % \
          (user_id, old_group_name)
    if not db_excute_insert(sql):
        status_code = 0

        # 构造一个用户所有摘抄的分组信息
    sql = "SELECT * FROM excerpt_group where user_id='%s'" \
          % user_id
    result = db_excute_select(sql)
    excerpt_list = []
    for item in result:
        excerpt_dict = {'group_name': item[1], 'group_color': item[2], 'excerpt_count': item[3]}
        excerpt_list.append(excerpt_dict)

    response = {
        'status_code': status_code,
        'excerpt_group_list':excerpt_list
    }
    response_body = json.dumps(response)
    return response_body

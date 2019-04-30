import json
from serverFunction.dbHelper import db_excute_insert
from serverFunction.dbHelper import db_excute_select
import time
import os

def save_article(request_params):
    mark_list = request_params['mark_list']
    user_id= request_params['user_id']
    group_name = request_params['group_name']
    article_id = request_params['article_id']
    status_code = 1
    # 更新数据库中的文章信息(只修改last_modified)
    ts = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    sql = "update article_info set last_modify = '%s' where article_id ='%s' and user_id = '%s'"\
          %(ts, article_id, user_id)
    if not db_excute_insert(sql):
        status_code = 0

    #把修改之后的文章存入文件系统
        #先读
    sql = "SELECT * FROM article_info where user_id='%s' and article_id='%s'" % (user_id, article_id)
    res = db_excute_select(sql)
    path = res[0][6]
    with open(path + '.txt', 'r') as f:
        article_file = json.loads(f.read())
        f.close()
    article_file = [article_file[0], mark_list]
    #后写
    with open(path + '.txt', 'w') as f:
        try:
            f.write(json.dumps(article_file))
        except:
            status_code = 0
        f.close()

    #确定分组
    sql = "SELECT group_name FROM article_info where user_id='%s'and article_id = '%s'" \
          % (user_id,article_id)
    res = db_excute_select(sql)
    if res[0][0] != group_name:
        #分组改变了

        #改分组
        sql = "update article_info set group_name = '%s' where article_id ='%s' and user_id = '%s'" \
              % (group_name, article_id, user_id)
        if not db_excute_insert(sql):
            status_code = 0

        #新分组加1
        sql = "update article_group set article_count = article_count + 1 where group_name ='%s' and user_id = '%s'" % \
              (group_name, user_id)
        if not db_excute_insert(sql):
            status_code = 0

        #旧分组减1
        sql = "update article_group set article_count = article_count - 1 where group_name ='%s' and user_id = '%s'" % \
            (res[0][0], user_id)
        if not db_excute_insert(sql):
            status_code = 0
    else:
        #分组未改变
        pass

    response = {
        'state_code': status_code,
        }
    response_body = json.dumps(response)
    return response_body
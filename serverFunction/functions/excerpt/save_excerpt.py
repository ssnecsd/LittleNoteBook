# 保存摘抄
import json
import os
import random
import time

from serverFunction.dbHelper import db_excute_insert, db_excute_select


def save_excerpt(request_params):
    user_id = request_params['user_id']
    article_id = request_params['article_id']
    excerpt_content = request_params['excerpt_content']
    group_name = request_params['group_name']
    status_code = 1

    # 插入数据库

    # 查询生成的excerpt_id是否存在
    while True:
        excerpt_id = get_a_excerpt_id()
        sql = "SELECT * FROM excerpt_info where article_id = '%s'and excerpt_id ='%s'" \
              % (article_id, excerpt_id)
        res = db_excute_select(sql)
        if len(res) == 0:
            break

    #对应分组个数加一
    sql = "update excerpt_group set excerpt_count = excerpt_count+ 1 " \
            "where group_name ='%s' and user_id = '%s'" % (group_name, user_id)

    if not db_excute_insert(sql):
        status_code = 0

    # 插入摘抄信息
    # title(需要从文章表中获取)
    sql = "SELECT * FROM userdb.article_info where  article_id = '%s'" % article_id
    res_info = db_excute_select(sql)
    title = res_info[0][1]
    path = "//root//weixin//data//" + user_id + "//" + article_id + "//" + excerpt_id

    # 将数据插入数据库
    ts = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    sql = "insert into excerpt_info values( '%s','%s','%s','%s','%s','%s','%s','%s')" % \
          (excerpt_id, title, article_id, ts, ts, path, group_name, user_id)
    # 插入失败
    if not db_excute_insert(sql):
        status_code = 0

    # 保存摘抄
    dire = "//root//weixin//data//" + user_id + "//" + article_id

    if not os.path.exists(dire):
        os.makedirs(dire)

    with open(path + '.txt', 'w') as f:
        try:
            f.write(json.dumps(excerpt_content))
        except:
            status_code = 0

    f.close()

    # 构造返回json
    response = {
        'state_code': status_code
    }
    response_body = json.dumps(response)
    return response_body


# 随机生成一个excerpt_id
def get_a_excerpt_id():
    excerpt_id = ''
    # 摘抄的数量相对较少
    key = '0123456789'
    length = 10
    index = []
    for i in range(length):
        index.append(key[random.randint(0, len(key) - 1)])
    excerpt_id = excerpt_id.join(index)
    return excerpt_id

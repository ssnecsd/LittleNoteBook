import json
import os
import datetime
from serverFunction.dbHelper import db_excute_insert, db_excute_select

# 重写构造json类
class CJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, datetime.date):
            return obj.strftime("%Y-%m-%d")
        else:
            return json.JSONEncoder.default(self, obj)


def delete_article(request_params):
    user_id=request_params['user_id']
    article_id= request_params['article_id']
    status_code = 1

    #找到文章的路径并删除
    sql = "SELECT * FROM article_info where user_id='%s' and article_id='%s'" % (user_id, article_id)
    res = db_excute_select(sql)
    path = res[0][6]
    print('文件的路径是\n')
    print(path)
    os.remove(path + '.txt')

    # 分组对应的文章数减1
    sql = "update article_group set article_count = article_count - 1 where group_name ='%s' and user_id = '%s'" % \
          (res[0][7], user_id)
    if not db_excute_insert(sql):
        status_code = 0

    #删除数据库中的记录
    sql = "DELETE FROM article_info where user_id='%s' and article_id='%s'" % (user_id,article_id)
    # 删除分组失败
    if not db_excute_insert(sql):
        status_code = 0

    article_list =[]
    sql = "SELECT * from article_info where user_id = '%s'"%user_id
    res = db_excute_select(sql)

    for record in res:
        dict ={
            'title':record[1],
            'article_id':record[0],
            'create_time':record[4]
        }
        article_list.append(dict)

    response = {
        'article_list': article_list,
        'status_code': status_code
    }
    response_body = json.dumps(response, cls=CJsonEncoder)
    return response_body

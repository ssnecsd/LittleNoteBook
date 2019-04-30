import json
import os
import random
import time

from serverFunction.Spider import Spider
from serverFunction.dbHelper import db_excute_select
from serverFunction.dbHelper import db_excute_insert


def load_article(request_params):
    url = request_params['url']
    user_id = request_params['user_id']
    article_dic = Spider(url)
    state_code = 1  # （1 成功，0 失败）

    # 插入数据库

    # 查询生成的article_id是否存在
    while True:
        article_id = get_a_article_id()
        sql = "SELECT * FROM userdb.article_info where article_id='%s'" % article_id
        res = db_excute_select(sql)
        if len(res) == 0:
            break

    #文章的分类表
    global group_name
    group_name = '未分类'
    # 默认的分组颜色为白色
    group_color = 'ffffff'
    group_count = 1
    #未分类 是否已经存在
    sql = "SELECT * FROM userdb.article_group where group_name ='未分类' and user_id = '%s'"% user_id
    res = db_excute_select(sql)
    if len(res) == 0:
        #分类不存在
        sql = "insert into article_group values('%s','%s','%s','%d')" % \
            (group_name, user_id, group_color, group_count)
        #插入失败
        if not db_excute_insert(sql):
            state_code = 0
    else:
        #分类存在
        sql = "update article_group set article_count = article_count+ 1 where group_name ='未分类' and user_id = '%s'"% user_id
        if not db_excute_insert(sql):
            state_code = 0

    #插入文章信息
    # title
    title = article_dic['title']
    # image_url
    image_url = article_dic['image_url']
    # profile_nickname
    profile_nickname = article_dic['profile_nickname']
    # path  存在待定项group_name
    path = "//root//weixin//data//" + user_id + "//" + article_id

    # user_id
    user_id = user_id
    # 将数据插入数据库
    ts=time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    sql = "insert into article_info values( '%s','%s','%s','%s','%s','%s','%s','%s','%s')" % \
          (article_id, title, image_url, profile_nickname, ts, ts, path, group_name, user_id)
    if not db_excute_insert(sql):
        state_code = 0

    # 保存文章
    dire = "//root//weixin//data//" + user_id

    if not os.path.exists(dire):
        os.makedirs(dire)

    with open(path + '.txt', 'w') as f:
        f.write(json.dumps(article_dic))

    # 爬虫返回值验证值是否有效
    for value in article_dic.values():
        if len(value) == 0:
            state_code = 0
    response = {
        'article_dic': article_dic,
        'state_code': state_code
    }
    response_body = json.dumps(response)
    return response_body

 # 随机生成一个article_id
def get_a_article_id():
    article_id = ''
    key = 'abcdefghijklmnopqrstuvwxyz0123456789'
    length = 128
    index = []
    for i in range(length):
        index.append(key[random.randint(0, len(key) - 1)])
    article_id = article_id.join(index)
    return article_id

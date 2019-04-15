import json
import random

import requests

from serverFunction.dbHelper import db_excute


def sign_in(request_params):
    js_code=request_params['js_code']
    user_nickname = request_params['user_nickname']
    avatar_url = request_params['avatar_url']
    gender = request_params['gender']
    country = request_params['country']
    province = request_params['province']
    city = request_params['city']
    language = request_params['language']
    # 登录的请求参数
    data = {
        'appid': 'wx3a065be8530e53d2',
        'secret': '0971e05d99d908f2382c8bc321d687fa',
        'js_code': js_code,
        'grant_type': 'authorization_code'
    }
    # 请求腾讯微信服务器获得用户openid
    json_openid = requests.get('https://api.weixin.qq.com/sns/jscode2session', params=data).text
    openid = json.loads(json_openid)['openid']

    # 查询openid是否存在于数据库中，如果存在直接返回
    sql = "SELECT * FROM userdb.user_info where open_id='%s'" % openid
    res = db_excute(sql)
    if len(res) > 0:
        user_id = res[0][0]
        response = {
            'user_id': user_id
        }
        response_body = json.dumps(response)
        return response_body

    def get_a_user_id():
        user_id = ''
        key = 'abcdefghijklmnopqrstuvwxyz0123456789'
        length = 32
        index = []
        for i in range(length):
            index.append(key[random.randint(0, len(key) - 1)])
        user_id = user_id.join(index)
        return user_id

    # 查询生成的user_id是否存在
    while True:
        user_id=get_a_user_id()
        sql="SELECT * FROM userdb.user_info where user_id='%s'"%user_id
        res=db_excute(sql)
        if len(res)==0:
            break

    # 将用户信息插入数据库
    sql="insert into user_info values( '%s','%s','%s','%s',%s,'%s','%s','%s','%s')" % \
             (user_id,openid,user_nickname,avatar_url,gender,country,province,city,language)
    db_excute(sql)
    response = {
        'user_id': user_id
    }
    response_body = json.dumps(response)
    return response_body


import json
import pymysql
import requests

from serverFunction.dbHelper import db_excute


def login(request_params):
    js_code = request_params['js_code']  # 从请求参数中获取js_code
    # 登录的请求参数
    data = {
        'appid': 'wx3a065be8530e53d2',
        'secret': '0971e05d99d908f2382c8bc321d687fa',
        'js_code': js_code,
        'grant_type': 'authorization_code'
    }
    is_new = 0  # 是否是新用户（0不是新用户，1是新用户）
    user_id = 0  # 用户id

    # 请求腾讯微信服务器获得用户openid
    json_openid = requests.get('https://api.weixin.qq.com/sns/jscode2session', params=data).text
    openid = json.loads(json_openid)['openid']
    # 查询数据库确认是否是新用户，如果不是新用户，返回user_id
    sql = "SELECT * FROM userdb.user_info where open_id='%s'" % openid
    res = db_excute(sql)
    # 是新用户
    if len(res) == 0:
        is_new = 1
    # 不是新用户
    else:
        is_new = 0
        user_id = res[0][0]
    response = {
        'is_new': is_new,
        'user_id': user_id
    }
    response_body = json.dumps(response)
    return response_body

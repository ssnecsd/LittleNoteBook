import json

import requests


def login(request_params):
    js_code = request_params['js_code']  # 从请求参数中获取js_code
    # 登录的请求参数
    data={
        'appid':'wx3a065be8530e53d2',
        'secret':'0971e05d99d908f2382c8bc321d687fa',
        'js_code':js_code,
        'grant_type':'authorization_code'
    }
    is_new = 0  # 是否是新用户（0不是新用户，1是新用户）
    user_id = 0  # 用户id

    # 请求腾讯微信服务器获得用户openid
    json_openid=requests.get('https://api.weixin.qq.com/sns/jscode2session',params=data).text
    openid=json.loads(json_openid)['openid']
    # 将openid通过hash函数映射后得到user_id

    # 查询是否是新用户,改变is_new

    # 如果是新用户将用户信息插入数据库
    result = {
        'is_new':is_new,
        'user_id':user_id
    }
    response_body = json.dumps(result)
    return response_body

# 用于测试login
if __name__ == '__main__':
    request_params={}

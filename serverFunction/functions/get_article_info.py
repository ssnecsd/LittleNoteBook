import json

from serverFunction.dbHelper import db_excute


def get_article_info(request_params):
    user_id=request_params['user_id']
    article_id=request_params['article_id']
    sql = "SELECT * FROM userdb.article_info where user_id='%s' and article_id='%s'" % (user_id, article_id)
    res = db_excute(sql)
    path=res[0][6]
    # ----------------------------------------测试用-------------------------------------------------
    path = "C:" + path
    # ------------------------------------------------------------------------------------------------
    with open(path + '.txt','r') as f:
        article_dic=json.loads(f.read())
    response = {
        'article_dic': article_dic,
    }
    response_body = json.dumps(response)
    return response_body

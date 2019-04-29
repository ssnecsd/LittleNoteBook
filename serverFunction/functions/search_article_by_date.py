import json

from serverFunction.dbHelper import db_excute

def search_article_by_date(request_params):
    user_id = request_params['user_id']
    article_date=request_params['article_date']
    sql = "SELECT * FROM userdb.article_info where user_id='%s' and article_date='%s'" % (user_id, article_date)
    info = db_excute(sql)
    article_dic = []
    for article_info in info:
        articleDic = {'title':article_info[1],
                       'article_id':article_info[0],
                       'image_url':article_info[2],
                        'create_time':article_info[4]}
        article_dic.append(articleDic)

    response = {
        'article_dic': article_dic,
    }
    response_body = json.dumps(response)
    return response_body
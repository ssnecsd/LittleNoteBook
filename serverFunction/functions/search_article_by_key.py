import json

from serverFunction.dbHelper import db_excute

def search_article_by_key(request_params):
    user_id=request_params['user_id']
    article_key =request_params['article_key']
    article_key = '%'+article_key+'%'

    #对文章进行模糊搜索
    sql = "SELECT * FROM userdb.article_info where user_id='%s' and title LIKE  '%s' "% (user_id,article_key)
    title_list = db_excute(sql)

    #打包返回
    article_dic = []
    for title in title_list:
        articleDict = {'title':title[1],
                       'article_id':title[0],
                       'image_url':title[2],
                        'create_time':title[4]}
        article_dic.append(articleDict)
    response = {
    'article_dic': article_dic,
    }
    response_body=json.dumps(response)
    return response_body

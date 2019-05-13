#为新用户设置四个默认的分组
from serverFunction.dbHelper import db_excute_insert


def set_default_group(user_id):
    state_code = 1
    # 插入数据库
    sql = "insert into excerpt_group values('最近','%s','#E6E6FA','0')" % user_id
    if not db_excute_insert(sql):
        status_code = 0
        return status_code

    sql = "insert into excerpt_group values('文学','%s','#FFF5EE','0')" % user_id
    if not db_excute_insert(sql):
        status_code = 0
        return status_code

    sql = "insert into excerpt_group values('教育','%s','#F0FFF0','0')" % user_id
    if not db_excute_insert(sql):
        status_code = 0
        return status_code

    sql = "insert into excerpt_group values('娱乐','%s','#F0FFFF','0')" % user_id
    if not db_excute_insert(sql):
        status_code = 0
        return status_code

    sql = "insert into excerpt_group values('旅游','%s','#FFFFF0','0')" % user_id
    if not db_excute_insert(sql):
        status_code = 0
        return status_code

    return state_code
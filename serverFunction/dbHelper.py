import pymysql


def db_excute_select(sql):
    user_name='root'
    key="0K$K39mKY9hJ910"
    db = pymysql.connect("localhost", user_name, key, "userdb")
    cursor = db.cursor()
    try:
        cursor.execute(sql)
        db.commit()
    except Exception as e:
        print(e)
        db.rollback()
    try:
        res = cursor.fetchall()
    except:
        res=[]
    cursor.close()
    db.close()
    return res



def db_excute_insert(sql):
    user_name='root'
    key="0K$K39mKY9hJ910"
    db = pymysql.connect("localhost", user_name, key, "userdb")
    cursor = db.cursor()
    success = True
    try:
        cursor.execute(sql)
        db.commit()
    except Exception as e:

        #打印调试信息
        print(e)
       #如果出现插入异常，就然后false
        success = False
        db.rollback()
    cursor.close()
    db.close()
    return success


def db_excute_transaction(sql_list=[]):
    # 连接数据库
    user_name = 'root'
    key = "0K$K39mKY9hJ910"
    db = pymysql.connect("localhost", user_name, key, "userdb")
    cursor = db.cursor()
    success = True

    try:
        for sql in sql_list:
            cursor.execute(sql)

    except Exception as e:
        cursor.rollback()  # 事务回滚
        success = False

    else:
        cursor.commit()  # 事务提交
        print('事务处理成功', cursor.rowcount)  # 关闭连接

    cursor.close()
    db.close()


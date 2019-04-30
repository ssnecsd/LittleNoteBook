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
    db.close()
    return success

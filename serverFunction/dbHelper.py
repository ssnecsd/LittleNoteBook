import pymysql


def db_excute(sql):
    user_name='luobiao'
    key="1#rBJwr1cnleu4qZ"
    db = pymysql.connect("148.70.115.138", user_name, key, "userdb")
    cursor = db.cursor()
    try:
        cursor.execute(sql)
        db.commit()
    except:
        print(sql+"\nfail")
        db.rollback()
    try:
        res = cursor.fetchall()
    except:
        res=[]
    db.close()
    return res

# coding:utf-8
import json
import socket
import re

from multiprocessing import Process

# 设置静态文件根目录
from urllib.parse import unquote

from serverFunction.functionManager import FunctionManager

HTML_ROOT_DIR = "./html"


class HTTPServer(object):
    def __init__(self):
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        # 使用SSL前先获得证书 cert.pem就是证书文件
        # 参考网站http://blog.sina.com.cn/s/blog_5d18f85f0102xg3e.html
        # self.server_socket=ssl.wrap_socket(self.server_socket, certfile='cert.pem', server_side=True)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    def start(self):
        self.server_socket.listen(128)
        while True:
            client_socket, client_address = self.server_socket.accept()
            print("[%s, %s]用户连接上了" % client_address)
            handle_client_process = Process(target=self.handle_client, args=(client_socket,))
            handle_client_process.start()
            client_socket.close()

    def handle_client(self, client_socket):
        """
        处理客户端请求
        """

        def get_request_params(request_lines):
            """
            得到get请求中的参数
            :param file_name:
            :return:
            """
            # 获取headerline判断请求类型来取参数字典
            header_line=request_lines[0].decode("utf-8")
            if 'GET'==header_line[0:3]:
                pattern = re.compile(r'\?+([^ ]*)')
                request_params = pattern.search(file_name).group(1)
                request_params = request_params.split('&')
                result = {}
                for item in request_params:
                    item = unquote(item)
                    item = item.split('=')
                    result[item[0]] = item[1]
                return result
            if 'POST'==header_line[0:4]:
                data_line=request_lines[-1].decode("utf-8")
                result = json.loads(data_line)
                return result

        # 获取客户端请求数据
        request_data = client_socket.recv(1024)
        request_lines = request_data.splitlines()

        # # 打印调试信息
        # for line in request_lines:
        #     print(line)

        # 解析请求报文
        request_start_line = request_lines[0]
        # 提取用户请求的文件名
        file_name = re.match(r"\w+ +(/[^ ]*) ", request_start_line.decode("utf-8")).group(1)
        # 获取请求的参数
        request_params = get_request_params(request_lines)

        # 打印调试信息
        print(request_params)

        fm = FunctionManager(file_name,request_params)
        response = fm.response_maker()

        # 打印调试信息
        # print("\nresponse data:", response)

        # 向客户端返回响应数据
        client_socket.send(bytes(response, "utf-8"))

        # 关闭客户端连接
        client_socket.close()

    def bind(self, port):
        self.server_socket.bind(("0.0.0.0", port))  # 外界访问时
        # self.server_socket.bind(("", port))  # 内部访问时


def main():
    http_server = HTTPServer()
    http_server.bind(8000)
    http_server.start()


if __name__ == "__main__":
    main()

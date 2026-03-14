# Codex Test Code

该目录用于存放 Codex 的测试代码与临时实验文件。

## 进制转换网页（Flask 后端）

该项目已改为 **Python + Flask** 后端实现，前端通过 API 调用完成 2~36 进制整数互转。

### 文件说明

- `app.py`：Flask 应用与进制转换 API（`POST /api/convert`）。
- `index.html`：页面结构。
- `styles.css`：页面样式。
- `script.js`：前端表单逻辑与后端接口调用。
- `requirements.txt`：Python 依赖。

### 使用方式

1. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```
2. 启动服务：
   ```bash
   python app.py
   ```
3. 浏览器打开：`http://127.0.0.1:5000`
4. 输入待转换数值与进制后点击“开始转换”。

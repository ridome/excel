# 数据处理工具集合

## 1. JSON 转 Label Studio 工具（Windows GUI）

这是一个带图形界面的小工具，用于将包含对话（conversations）、图片/视频信息的自定义 JSON 数据，转换为 Label Studio 支持识别的预标注任务格式。

### 功能特色
* **直接运行 (Windows)**: 提供了打包脚本，可一键生成 `.exe`，双击即可使用，无需安装 Python 环境。
* **图形界面**: 友好的窗口，可通过点击按钮选择输入/输出文件。
* **错误处理**: 文件格式错误、缺少关键字段等情况都会弹出友好的错误提示。

### 如何生成 Windows 可执行文件 (.exe)
1. 确保你的电脑上安装了 Python（并在安装时勾选了 "Add Python to PATH"）。
2. 双击项目中的 **`build.bat`** 文件。
3. 脚本会自动安装 `pyinstaller` 依赖并将 `json_to_ls.py` 打包。
4. 打包完成后，你会在当前目录下看到一个 `dist` 文件夹，里面的 **`json_to_ls.exe`** 就是最终的工具。
5. （可选）你可以将这个 `.exe` 复制到任何地方直接双击使用。

### 直接使用源码 (开发人员)
如果你已经有 Python 环境并想直接运行：
```bash
python json_to_ls.py
```

---

## 2. Excel 转换工具（命令行）

该工具用于把「原始表格」转换成目标模板格式，并在缺失列或行时自动补齐。

## 功能说明
- 按默认映射把原始列转换到目标模板列。
- 自动汇总所有包含日期/数字的列到「本期数量」。
- 如果目标列缺失，自动补空列；如果目标行不足，可用 `--min-rows` 补空行。

## 安装依赖

```bash
pip install -r requirements.txt
```

## 使用方式

```bash
python excel_transformer.py --input source.xlsx --output output.xlsx
```

如需确保输出至少 50 行：

```bash
python excel_transformer.py --input source.xlsx --output output.xlsx --min-rows 50
```

## 自定义映射

你可以提供自定义 JSON 映射文件：

```json
{
  "数据类型": "任务类别",
  "任务类别": "任务类别-明细",
  "预计数量": "未来标注数量",
  "已标注总量": "已标数据总量",
  "人数（1.30）": "CN",
  "进度": "完成度"
}
```

然后执行：

```bash
python excel_transformer.py --input source.xlsx --output output.xlsx --mapping mapping.json
```

## Windows 直接运行

双击 `run.bat`，或者在 CMD 中执行：

```bat
run.bat source.xlsx output.xlsx
```

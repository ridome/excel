# Excel 转换工具（Windows 可运行）

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

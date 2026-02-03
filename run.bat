@echo off
set INPUT=%1
set OUTPUT=%2
if "%INPUT%"=="" (
  echo 请提供输入文件路径。
  echo 用法: run.bat source.xlsx output.xlsx
  exit /b 1
)
if "%OUTPUT%"=="" (
  echo 请提供输出文件路径。
  echo 用法: run.bat source.xlsx output.xlsx
  exit /b 1
)
python excel_transformer.py --input "%INPUT%" --output "%OUTPUT%"

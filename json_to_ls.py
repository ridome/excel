import json
import re
import tkinter as tk
from tkinter import filedialog, messagebox
import traceback
import sys

def parse_level(ds_event: str) -> str:
    """从 ds_event 字符串中提取 Level"""
    match = re.search(r"Level:\s*(L\d+)", ds_event)
    return match.group(1) if match else "L1"

def parse_reason(ds_event: str) -> str:
    """从 ds_event 字符串中提取 Reason"""
    match = re.search(r"Reason:\s*(.+)", ds_event, re.DOTALL)
    return match.group(1).strip() if match else ""

def process_file(input_path: str, output_path: str):
    try:
        with open(input_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)

        if not isinstance(raw_data, list):
            raise ValueError("JSON文件的根应该是一个列表(List)")

        ls_tasks = []
        for i, item in enumerate(raw_data):
            if "conversations" not in item:
                raise ValueError(f"第 {i+1} 条数据缺少 'conversations' 字段")
            if "image" not in item:
                raise ValueError(f"第 {i+1} 条数据缺少 'image' 字段")
            if "id" not in item:
                raise ValueError(f"第 {i+1} 条数据缺少 'id' 字段")

            human_turn = next((c for c in item["conversations"] if c.get("from") == "human"), {})
            gpt_turn   = next((c for c in item["conversations"] if c.get("from") == "gpt"),   {})

            if not human_turn:
                raise ValueError(f"第 {i+1} 条数据缺少 'human' 对话")
            if not gpt_turn:
                raise ValueError(f"第 {i+1} 条数据缺少 'gpt' 对话")

            ds_event   = gpt_turn.get("ds_event", "")
            level      = parse_level(ds_event) if ds_event else "none"
            reason     = parse_reason(ds_event) if ds_event else "none"
            important  = item.get("important", False)

            task = {
                "data": {
                    "video":       item["image"],          # Label Studio 通过 $video 读取
                    "instruction": human_turn.get("value", "").replace("<image>\n", ""),
                    "gpt_output":  gpt_turn.get("value", ""),
                    "reason":      reason,
                    "meta_level":  level,
                    "meta_important": "Important" if important else "Normal",
                    "id":          item["id"],
                },
                "annotations": [
                    {
                        "result": [
                            {
                                "value": {"text": [gpt_turn.get("value", "")]},
                                "id": f"{item['id']}_caption",
                                "from_name": "gpt_output",
                                "to_name": "video",
                                "type": "textarea"
                            },
                            {
                                "value": {"choices": [level]},
                                "id": f"{item['id']}_level",
                                "from_name": "level",
                                "to_name": "video",
                                "type": "choices"
                            },
                            {
                                "value": {"text": [reason]},
                                "id": f"{item['id']}_reason",
                                "from_name": "reason",
                                "to_name": "video",
                                "type": "textarea"
                            },
                            {
                                "value": {"choices": ["Important" if important else "Normal"]},
                                "id": f"{item['id']}_important",
                                "from_name": "important",
                                "to_name": "video",
                                "type": "choices"
                            }
                        ]
                    }
                ]
            }
            ls_tasks.append(task)

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(ls_tasks, f, ensure_ascii=False, indent=2)

        messagebox.showinfo("成功", f"✅ 转换完成！\n共转换 {len(ls_tasks)} 条任务。\n文件已保存至：\n{output_path}")

    except json.JSONDecodeError as e:
        messagebox.showerror("错误", f"输入文件不是有效的JSON格式：\n{e}")
    except ValueError as e:
        messagebox.showerror("错误", f"数据格式错误：\n{e}")
    except Exception as e:
        messagebox.showerror("未知错误", f"发生未知错误：\n{traceback.format_exc()}")

def select_input_file(input_var):
    filepath = filedialog.askopenfilename(
        title="选择原始 JSON 文件",
        filetypes=[("JSON Files", "*.json"), ("All Files", "*.*")]
    )
    if filepath:
        input_var.set(filepath)

def select_output_file(output_var):
    filepath = filedialog.asksaveasfilename(
        title="选择保存路径",
        defaultextension=".json",
        filetypes=[("JSON Files", "*.json"), ("All Files", "*.*")]
    )
    if filepath:
        output_var.set(filepath)

def start_conversion(input_var, output_var):
    input_path = input_var.get()
    output_path = output_var.get()

    if not input_path:
        messagebox.showwarning("警告", "请先选择输入文件！")
        return
    if not output_path:
        messagebox.showwarning("警告", "请先选择输出文件保存路径！")
        return

    process_file(input_path, output_path)

def create_gui():
    root = tk.Tk()
    root.title("JSON 转 Label Studio 工具")
    root.geometry("500x250")
    root.resizable(False, False)

    # 变量
    input_var = tk.StringVar()
    output_var = tk.StringVar()

    # 布局
    pad_options = {'padx': 10, 'pady': 10}

    # 输入框和按钮
    tk.Label(root, text="输入 JSON 文件:").grid(row=0, column=0, sticky="e", **pad_options)
    tk.Entry(root, textvariable=input_var, width=40).grid(row=0, column=1, **pad_options)
    tk.Button(root, text="浏览...", command=lambda: select_input_file(input_var)).grid(row=0, column=2, **pad_options)

    # 输出框和按钮
    tk.Label(root, text="输出 JSON 文件:").grid(row=1, column=0, sticky="e", **pad_options)
    tk.Entry(root, textvariable=output_var, width=40).grid(row=1, column=1, **pad_options)
    tk.Button(root, text="浏览...", command=lambda: select_output_file(output_var)).grid(row=1, column=2, **pad_options)

    # 转换按钮
    btn_frame = tk.Frame(root)
    btn_frame.grid(row=2, column=0, columnspan=3, pady=20)

    tk.Button(btn_frame, text="开始转换", font=("Helvetica", 12, "bold"), width=15, height=2, bg="#4CAF50", fg="black",
              command=lambda: start_conversion(input_var, output_var)).pack()

    root.mainloop()

if __name__ == "__main__":
    create_gui()

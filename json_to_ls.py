import os
import json
import re
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import traceback
import sys
import urllib.parse

def parse_level(ds_event: str) -> str:
    """从 ds_event 字符串中提取 Level"""
    match = re.search(r"Level:\s*(L\d+)", ds_event)
    return match.group(1) if match else "L1"

def parse_reason(ds_event: str) -> str:
    """从 ds_event 字符串中提取 Reason"""
    match = re.search(r"Reason:\s*(.+)", ds_event, re.DOTALL)
    return match.group(1).strip() if match else ""

def process_txt_folder(input_folder: str, output_path: str, url_prefix: str = ""):
    try:
        if not os.path.isdir(input_folder):
            raise ValueError(f"提供的路径不是一个有效的文件夹: {input_folder}")

        ls_tasks = []
        for filename in os.listdir(input_folder):
            if filename.lower().endswith('.txt'):
                base_name = os.path.splitext(filename)[0]
                image_name = f"{base_name}.jpg"

                # 处理图片 URL 前缀拼接与编码
                if url_prefix:
                    encoded_name = urllib.parse.quote(image_name, safe='/')
                    if url_prefix.endswith("=") or url_prefix.endswith("/"):
                        image_url = f"{url_prefix}{encoded_name}"
                    else:
                        image_url = f"{url_prefix}/{encoded_name}"
                else:
                    image_url = image_name

                filepath = os.path.join(input_folder, filename)
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    combined_text = "".join(lines).strip()

                task = {
                    "data": {
                        "image": image_url
                    },
                    "predictions": [{
                        "result": [{
                            "from_name": "caption",
                            "to_name": "image",
                            "type": "textarea",
                            "value": {
                                "text": [combined_text]
                            }
                        }]
                    }]
                }
                ls_tasks.append(task)

        if not ls_tasks:
            raise ValueError(f"在 {input_folder} 下没有找到任何 .txt 文件！")

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(ls_tasks, f, ensure_ascii=False, indent=2)

        if tk._default_root is not None or tk._support_default_root:
            try:
                messagebox.showinfo("成功", f"✅ 转换完成！\n共拼接了 {len(ls_tasks)} 个文件。\n文件已保存至：\n{output_path}")
            except Exception:
                pass

    except Exception as e:
        if tk._default_root is not None or tk._support_default_root:
            try:
                messagebox.showerror("错误", f"发生错误：\n{e}\n\n{traceback.format_exc()}")
            except Exception:
                pass


def process_file(input_path: str, output_path: str, url_prefix: str = ""):
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

            # 处理视频/图片 URL
            media_path = item["image"]
            if url_prefix and not media_path.startswith(("http://", "https://")):
                # 对文件名部分进行 URL 编码（处理空格等特殊字符）
                # 假设媒体路径中可能包含多级目录，我们分别处理或者统一处理
                # 这里我们假设用户输入的前缀包含了基础路径，后面的部分只是文件名或相对路径
                # 将媒体路径进行 urllib.parse.quote 处理，保留斜杠 '/'
                encoded_path = urllib.parse.quote(media_path, safe='/')

                # 如果前缀不以 / 结尾，且 encoded_path 不以 / 或 ? 等开头，补充 /
                if url_prefix.endswith("=") or url_prefix.endswith("/"):
                    media_path = f"{url_prefix}{encoded_path}"
                else:
                    media_path = f"{url_prefix}/{encoded_path}"

            task = {
                "data": {
                    "video":       media_path,          # Label Studio 通过 $video 读取
                    "gpt_output":  gpt_turn.get("value", ""),
                    "reason":      reason,
                    "id":          item["id"],
                },
                "predictions": [
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

        if tk._default_root is not None or tk._support_default_root:
            try:
                messagebox.showinfo("成功", f"✅ 转换完成！\n共转换 {len(ls_tasks)} 条任务。\n文件已保存至：\n{output_path}")
            except Exception:
                pass

    except json.JSONDecodeError as e:
        if tk._default_root is not None or tk._support_default_root:
            try:
                messagebox.showerror("错误", f"输入文件不是有效的JSON格式：\n{e}")
            except Exception:
                pass
    except ValueError as e:
        if tk._default_root is not None or tk._support_default_root:
            try:
                messagebox.showerror("错误", f"数据格式错误：\n{e}")
            except Exception:
                pass
    except Exception as e:
        if tk._default_root is not None or tk._support_default_root:
            try:
                messagebox.showerror("未知错误", f"发生未知错误：\n{traceback.format_exc()}")
            except Exception:
                pass

def select_input_file(input_var):
    filepath = filedialog.askopenfilename(
        title="选择原始 JSON 文件",
        filetypes=[("JSON Files", "*.json"), ("All Files", "*.*")]
    )
    if filepath:
        input_var.set(filepath)

def select_input_folder(input_var):
    folderpath = filedialog.askdirectory(title="选择 TXT 文件夹")
    if folderpath:
        input_var.set(folderpath)

def select_output_file(output_var):
    filepath = filedialog.asksaveasfilename(
        title="选择保存路径",
        defaultextension=".json",
        filetypes=[("JSON Files", "*.json"), ("All Files", "*.*")]
    )
    if filepath:
        output_var.set(filepath)

def start_conversion(input_var, output_var, url_prefix_var):
    input_path = input_var.get()
    output_path = output_var.get()
    url_prefix = url_prefix_var.get().strip()

    if not input_path:
        messagebox.showwarning("警告", "请先选择输入文件！")
        return
    if not output_path:
        messagebox.showwarning("警告", "请先选择输出文件保存路径！")
        return

    process_file(input_path, output_path, url_prefix)

def start_txt_conversion(input_var, output_var, url_prefix_var):
    input_folder = input_var.get()
    output_path = output_var.get()
    url_prefix = url_prefix_var.get().strip()

    if not input_folder:
        messagebox.showwarning("警告", "请先选择 TXT 文件夹！")
        return
    if not output_path:
        messagebox.showwarning("警告", "请先选择输出文件保存路径！")
        return

    process_txt_folder(input_folder, output_path, url_prefix)

def create_gui():
    root = tk.Tk()
    root.title("数据转换 Label Studio 工具")
    root.geometry("640x360")
    root.resizable(False, False)

    notebook = ttk.Notebook(root)
    notebook.pack(pady=10, expand=True)

    # ================= 分页 1: JSON 转 Label Studio =================
    frame_json = ttk.Frame(notebook, width=640, height=320)
    frame_json.pack(fill='both', expand=True)
    notebook.add(frame_json, text='JSON转Label Studio')

    # 变量
    json_input_var = tk.StringVar()
    json_output_var = tk.StringVar()
    json_url_prefix_var = tk.StringVar()

    # 默认提示
    json_url_prefix_var.set("http://192.168.6.159:8080/data/local-files/?d=")

    # 布局
    pad_options = {'padx': 10, 'pady': 10}

    # 输入框和按钮
    tk.Label(frame_json, text="输入 JSON 文件:").grid(row=0, column=0, sticky="e", **pad_options)
    tk.Entry(frame_json, textvariable=json_input_var, width=50).grid(row=0, column=1, **pad_options)
    tk.Button(frame_json, text="浏览...", command=lambda: select_input_file(json_input_var)).grid(row=0, column=2, **pad_options)

    # 输出框和按钮
    tk.Label(frame_json, text="输出 JSON 文件:").grid(row=1, column=0, sticky="e", **pad_options)
    tk.Entry(frame_json, textvariable=json_output_var, width=50).grid(row=1, column=1, **pad_options)
    tk.Button(frame_json, text="浏览...", command=lambda: select_output_file(json_output_var)).grid(row=1, column=2, **pad_options)

    # URL 前缀配置
    tk.Label(frame_json, text="视频在线 URL 前缀\n(可选):").grid(row=2, column=0, sticky="e", **pad_options)
    tk.Entry(frame_json, textvariable=json_url_prefix_var, width=50).grid(row=2, column=1, **pad_options)
    tk.Label(frame_json, text="不填则使用原路径", fg="gray").grid(row=2, column=2, sticky="w", **pad_options)

    # 转换按钮
    btn_frame_json = tk.Frame(frame_json)
    btn_frame_json.grid(row=3, column=0, columnspan=3, pady=20)

    tk.Button(btn_frame_json, text="开始转换", font=("Helvetica", 12, "bold"), width=15, height=2, bg="#4CAF50", fg="black",
              command=lambda: start_conversion(json_input_var, json_output_var, json_url_prefix_var)).pack()

    # ================= 分页 2: TXT 转 Label Studio =================
    frame_txt = ttk.Frame(notebook, width=640, height=320)
    frame_txt.pack(fill='both', expand=True)
    notebook.add(frame_txt, text='TXT转Label Studio')

    # 变量
    txt_input_var = tk.StringVar()
    txt_output_var = tk.StringVar()
    txt_url_prefix_var = tk.StringVar()

    # 默认提示
    txt_url_prefix_var.set("/data/upload/")

    # 输入框和按钮
    tk.Label(frame_txt, text="选择 TXT 文件夹:").grid(row=0, column=0, sticky="e", **pad_options)
    tk.Entry(frame_txt, textvariable=txt_input_var, width=50).grid(row=0, column=1, **pad_options)
    tk.Button(frame_txt, text="浏览...", command=lambda: select_input_folder(txt_input_var)).grid(row=0, column=2, **pad_options)

    # 输出框和按钮
    tk.Label(frame_txt, text="输出 JSON 文件:").grid(row=1, column=0, sticky="e", **pad_options)
    tk.Entry(frame_txt, textvariable=txt_output_var, width=50).grid(row=1, column=1, **pad_options)
    tk.Button(frame_txt, text="浏览...", command=lambda: select_output_file(txt_output_var)).grid(row=1, column=2, **pad_options)

    # URL 前缀配置
    tk.Label(frame_txt, text="图片在线 URL 前缀\n(可选):").grid(row=2, column=0, sticky="e", **pad_options)
    tk.Entry(frame_txt, textvariable=txt_url_prefix_var, width=50).grid(row=2, column=1, **pad_options)
    tk.Label(frame_txt, text="默认: /data/upload/", fg="gray").grid(row=2, column=2, sticky="w", **pad_options)

    # 转换按钮
    btn_frame_txt = tk.Frame(frame_txt)
    btn_frame_txt.grid(row=3, column=0, columnspan=3, pady=20)

    tk.Button(btn_frame_txt, text="开始转换", font=("Helvetica", 12, "bold"), width=15, height=2, bg="#2196F3", fg="black",
              command=lambda: start_txt_conversion(txt_input_var, txt_output_var, txt_url_prefix_var)).pack()

    root.mainloop()

if __name__ == "__main__":
    create_gui()

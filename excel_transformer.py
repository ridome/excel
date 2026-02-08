#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path

import pandas as pd

DEFAULT_TARGET_COLUMNS = [
    "任务类别",
    "优先级",
    "任务类别-明细",
    "状态",
    "支撑任务",
    "未来标注数量",
    "本期数量",
    "已标数据总量",
    "已有数据总量",
    "最新周产能",
    "本期完成量",
    "PH",
    "CN",
    "完成度",
    "本期还需时间/周",
]

DEFAULT_MAPPING = {
    "数据类型": "任务类别",
    "任务类别": "任务类别-明细",
    "预计数量": "未来标注数量",
    "已标注总量": "已标数据总量",
    "人数（1.30）": "CN",
    "进度": "完成度",
}


def load_mapping(mapping_path: Path | None) -> dict:
    if mapping_path is None:
        return DEFAULT_MAPPING
    with mapping_path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def detect_period_columns(columns: list[str], excluded: set[str]) -> list[str]:
    patterns = [
        re.compile(r"\d{1,2}\.\d{1,2}\s*-\s*\d{1,2}(\.\d{1,2})?"),
        re.compile(r"\d{1,2}-\d{1,2}"),
    ]
    period_columns = []
    for column in columns:
        column_str = str(column)
        if column_str in excluded:
            continue
        if any(pattern.search(column_str) for pattern in patterns):
            period_columns.append(column)
    return period_columns


def normalize_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [str(column).strip() for column in df.columns]
    return df


def parse_extra_columns(extra_columns: str | None) -> list[str]:
    if not extra_columns:
        return []
    columns = [column.strip() for column in extra_columns.split(",")]
    return [column for column in columns if column]


def build_target_columns(extra_columns: list[str]) -> list[str]:
    target_columns = list(DEFAULT_TARGET_COLUMNS)
    for column in extra_columns:
        if column not in target_columns:
            target_columns.append(column)
    return target_columns


def build_target_dataframe(
    source_df: pd.DataFrame,
    mapping: dict,
    target_columns: list[str],
    min_rows: int,
) -> pd.DataFrame:
    target_df = pd.DataFrame(columns=target_columns)

    excluded_columns = set(mapping.keys())
    period_columns = detect_period_columns(source_df.columns.tolist(), excluded_columns)
    if period_columns:
        period_values = source_df[period_columns].apply(pd.to_numeric, errors="coerce").fillna(0)
        target_df["本期数量"] = period_values.sum(axis=1)

    for source_col, target_col in mapping.items():
        if source_col in source_df.columns:
            target_df[target_col] = source_df[source_col]
        else:
            target_df[target_col] = ""

    for column in target_columns:
        if column not in target_df.columns:
            target_df[column] = ""

    if len(target_df) < min_rows:
        extra_rows = min_rows - len(target_df)
        extra_df = pd.DataFrame([["" for _ in target_columns] for _ in range(extra_rows)], columns=target_columns)
        target_df = pd.concat([target_df, extra_df], ignore_index=True)

    return target_df[target_columns]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="将原始表格转换为目标模板格式，并自动补齐缺失列或行。",
    )
    parser.add_argument("--input", required=True, help="输入 Excel 文件路径")
    parser.add_argument("--output", required=True, help="输出 Excel 文件路径")
    parser.add_argument("--mapping", help="JSON 映射配置文件路径")
    parser.add_argument(
        "--min-rows",
        type=int,
        default=0,
        help="目标表格最少行数，不足则补空行",
    )
    parser.add_argument(
        "--extra-columns",
        help="追加到目标模板的列名，使用逗号分隔",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    input_path = Path(args.input)
    output_path = Path(args.output)
    mapping_path = Path(args.mapping) if args.mapping else None
    extra_columns = parse_extra_columns(args.extra_columns)
    target_columns = build_target_columns(extra_columns)

    source_df = pd.read_excel(input_path)
    source_df = normalize_dataframe(source_df)

    mapping = load_mapping(mapping_path)
    target_df = build_target_dataframe(
        source_df=source_df,
        mapping=mapping,
        target_columns=target_columns,
        min_rows=args.min_rows,
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    target_df.to_excel(output_path, index=False)


if __name__ == "__main__":
    main()

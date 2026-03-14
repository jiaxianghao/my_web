from __future__ import annotations

from flask import Flask, jsonify, request, send_from_directory

DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz"

app = Flask(__name__, static_folder=".", static_url_path="")


def read_base(value: object, label: str) -> int:
    try:
        base = int(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{label}必须是 2~36 之间的整数。") from exc

    if base < 2 or base > 36:
        raise ValueError(f"{label}必须是 2~36 之间的整数。")
    return base


def parse_to_decimal(raw_value: object, base: int) -> int:
    if not isinstance(raw_value, str):
        raise ValueError("请输入要转换的数值。")

    normalized = raw_value.strip().lower()
    if not normalized:
        raise ValueError("请输入要转换的数值。")

    sign = -1 if normalized.startswith("-") else 1
    unsigned = normalized[1:] if normalized[0] in "+-" else normalized
    if not unsigned:
        raise ValueError("请输入有效整数。")

    decimal_value = 0
    for char in unsigned:
        digit = DIGITS.find(char)
        if digit < 0 or digit >= base:
            raise ValueError(f"字符 “{char}” 不适用于 {base} 进制。")
        decimal_value = decimal_value * base + digit

    return decimal_value * sign


def format_from_decimal(value: int, base: int) -> str:
    if value == 0:
        return "0"

    sign = "-" if value < 0 else ""
    current = abs(value)
    chars: list[str] = []
    while current > 0:
        current, remainder = divmod(current, base)
        chars.append(DIGITS[remainder])

    return sign + "".join(reversed(chars)).upper()


@app.get("/")
def root() -> object:
    return send_from_directory(".", "index.html")


@app.post("/api/convert")
def convert() -> tuple[object, int] | object:
    payload = request.get_json(silent=True)
    if payload is None:
        return jsonify({"error": "请求体必须为 JSON。"}), 400

    try:
        from_base = read_base(payload.get("fromBase"), "原始进制")
        to_base = read_base(payload.get("toBase"), "目标进制")
        decimal_value = parse_to_decimal(payload.get("value"), from_base)
        result = format_from_decimal(decimal_value, to_base)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    return jsonify({"result": result})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

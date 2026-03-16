function readBase(inputValue, label) {
  const base = Number(inputValue);
  if (!Number.isInteger(base) || base < 2 || base > 36) {
    throw new Error(`${label}必须是 2~36 之间的整数。`);
  }
  return base;
}

const form = document.querySelector("#converter-form");
const sourceInput = document.querySelector("#source-value");
const fromBaseInput = document.querySelector("#from-base");
const toBaseInput = document.querySelector("#to-base");
const resultValue = document.querySelector("#result-value");
const resultError = document.querySelector("#result-error");
const baseOptions = document.querySelectorAll(".base-option");
const swapBasesButton = document.querySelector("#swap-bases");
const copyResultButton = document.querySelector("#copy-result");
const exampleChips = document.querySelectorAll(".example-chip");

function setActiveBase(targetId, base) {
  const targetInput = document.querySelector(`#${targetId}`);
  targetInput.value = String(base);

  document
    .querySelectorAll(`.base-option[data-target=\"${targetId}\"]`)
    .forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.base === String(base));
    });
}

baseOptions.forEach((option) => {
  option.addEventListener("click", () => {
    setActiveBase(option.dataset.target, option.dataset.base);
  });
});

exampleChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    sourceInput.value = chip.dataset.value;
    sourceInput.focus();
  });
});

swapBasesButton.addEventListener("click", () => {
  const currentFrom = fromBaseInput.value;
  const currentTo = toBaseInput.value;

  setActiveBase("from-base", currentTo);
  setActiveBase("to-base", currentFrom);
});

copyResultButton.addEventListener("click", async () => {
  const text = resultValue.textContent.trim();
  if (!text || text === "-") {
    resultError.textContent = "暂无可复制的结果。";
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    resultError.textContent = "已复制到剪贴板。";
  } catch {
    resultError.textContent = "复制失败，请手动复制。";
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const fromBase = readBase(fromBaseInput.value, "原始进制");
    const toBase = readBase(toBaseInput.value, "目标进制");

    const response = await fetch("/api/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: sourceInput.value,
        fromBase,
        toBase,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "转换失败，请稍后再试。");
    }

    resultValue.textContent = payload.result;
    resultError.textContent = "";
  } catch (error) {
    resultValue.textContent = "-";
    resultError.textContent = error.message;
  }
});

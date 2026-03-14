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

baseOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const targetInput = document.querySelector(`#${option.dataset.target}`);
    targetInput.value = option.dataset.base;

    document
      .querySelectorAll(`.base-option[data-target=\"${option.dataset.target}\"]`)
      .forEach((btn) => btn.classList.remove("is-active"));
    option.classList.add("is-active");
  });
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

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const fd = new FormData(form);
  const delayStr = fd.get("delay");
  const state = fd.get("state");

  const delay = Number(delayStr);


  if (!Number.isFinite(delay) || delay < 0) {
    iziToast.error({
      title: "Error",
      message: "Введи коректну не від’ємну затримку (ms).",
    });
    return;
  }
  if (!state) {
    iziToast.error({
      title: "Error",
      message: "Оберіть стан: Fulfilled або Rejected.",
    });
    return;
  }

  // Генератор промісу
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      state === "fulfilled" ? resolve(delay) : reject(delay);
    }, delay);
  });

  promise
    .then((d) => {
      iziToast.success({
        title: "Success",
        message: `Fulfilled promise in ${d}ms`,
        timeout: 3000,
        position: "topRight",
      });
    })
    .catch((d) => {
      iziToast.error({
        title: "Rejected",
        message: ` Rejected promise in ${d}ms`,
        timeout: 3000,
        position: "topRight",
      });
    });
});

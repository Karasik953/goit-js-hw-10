import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetime_picker = document.querySelector("#datetime-picker");
const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');


let userSelectedDate = null;
let timerId = null;


startButton.disabled = true;


flatpickr(datetime_picker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const picked = selectedDates[0];
    if (!picked) return;

    if (picked.getTime() <= Date.now()) {
      iziToast.error({ 
        title: "Error", 
        message: "Please choose a date in the future" 
      });
      startButton.disabled = true;
      userSelectedDate = null;
      return;
    }

    userSelectedDate = picked;
    startButton.disabled = false;
  },
});

function updateTimer() {
  const diff = userSelectedDate.getTime() - Date.now();

  if (diff <= 0) {
    clearInterval(timerId);
    timerId = null;

    daysValue.textContent = '00';
    hoursValue.textContent = '00';
    minutesValue.textContent = '00';
    secondsValue.textContent = '00';

    datetime_picker.disabled = false;

    iziToast.success({ title: 'Done', message: 'Countdown finished' });
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(diff);

  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}


startButton.addEventListener('click', () => {
  if (!userSelectedDate) return;

  startButton.disabled = true;
  datetime_picker.disabled = true;

  if (timerId) clearInterval(timerId);

  updateTimer(); 
  timerId = setInterval(updateTimer, 1000);
});

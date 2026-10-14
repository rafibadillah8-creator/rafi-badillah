const form = document.querySelector("#form");
const status = document.querySelector("#f-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    status.textContent = "Please complete your name, valid email and model.";
    form.reportValidity();
    return;
  }
  status.textContent = "Thank you — this demo form does not send your details.";
  form.reset();
});

const cars = [
  {
    id: "Ferrari Enzo",
    name: "Ferrari Enzo",
    year: 2026,
    tag: "The man itself.",
    img: "assets/cards/Enzo.jpg",
    desc: "A front-engined grand tourer built to cross continents at speed, in silence between the bursts.",
    spec: {
      Engine: "6.5L V12, naturally aspirated",
      Displacement: "6,496 cc",
      Power: "725 hp @ 9,250 rpm",
      Torque: "716 Nm @ 7,000 rpm",
      "0–100 km/h": "2.9 s",
      "Top speed": "340 km/h",
    },
    designer: ["Marco Valenti ", "“Remove everything the wind does not need, then give it back as sculpture.”"],
    eng: ["Transaxle layout for 48/52 weight balance", "Active rear-wheel steering", "Carbon-ceramic brakes with brake-by-wire", "Variable-geometry aero flaps"],
    sig: ["Atelier bespoke leather & paint program", "Track package with titanium exhaust", "Level-2 driver assist & night vision", "Personalised numbered plaque"],
  },
  {
    id: "Ferrari F40",
    name: "Ferrari F40",
    year: 1987,
    tag: "The icon of Italian engineering.",
    img: "assets/cards/F40.jpg",
    desc: "A mid-engined hybrid track weapon with a road licence and a racing pedigree.",
    spec: {
      Engine: "3.0L twin-turbo V6 + e-motor",
      Displacement: "2,992 cc",
      Power: "830 hp combined",
      Torque: "740 Nm",
      "0–100 km/h": "2.5 s",
      "Top speed": "330 km/h",
    },
    designer: ["Elena Rossi ", "“Downforce is an aesthetic. Every surface works.”"],
    eng: ["Carbon monocoque tub", "Hybrid torque-fill on corner exit", "Ground-effect underbody", "8-speed dual-clutch, 30 ms shifts"],
    sig: ["Race livery selection", "Slick-tyre track package", "Telemetry & coaching app", "Driver-academy day included"],
  },
  {
    id: "Ferrari La Ferrari",
    name: "Ferrari La Ferrari",
    year: 2013,
    tag: "The beauty and The Beast.",
    img: "assets/cards/laferrari.jpg",
    desc: "Born from the sacred soil of Maranello, LaFerrari is not merely a machine, but a rolling symphony of fire and electricity. At its beating heart lies a glorious, naturally aspirated V12, singing a ferocious anthem that echoes through the annals of racing history. It is the definitive crown jewel of speed—where the raw passion of Italian heritage meets the futuristic strike of lightning..",
    spec: {
      Engine: "6.3L Naturally Aspirated V12",
      Displacement: "6.262 cc",
      Power: "963 hp @ 9,000 rpm",
      Torque: "900 Nm @ 6,000 rpm",
      "0–100 km/h": "3.0 s",
      "Top speed": "350 km/h",
    },
    designer: ["Flavio Manzoni", "“The ultimate combination of technical innovation and aesthetic beauty”"],
eng: [
  "HY-KERS hybrid powertrain system",
  "F1-derived carbon fiber monocoque",
  "Active aerodynamics with movable flaps",
  "Equilibrated 41:59 weight distribution"
]
,
    sig: [
  "F1-inspired bespoke seat fitting",
  "Integrated F1 telemetry system",
  "Tailor-made carbon fiber package",
  "Matching Schedoni luxury luggage set"
]

  },
];

const selector = document.querySelector("#selector");
const car = document.querySelector("#car");
const tabs = ["Engine", "Design", "Engineering", "Signature"];

cars.forEach((model, index) => {
  selector.insertAdjacentHTML(
    "beforeend",
    `<button role="tab" id="t-${model.id}" aria-selected="${index === 0}" aria-controls="car" data-i="${index}">${model.name}</button>`,
  );
});

function showCar(index, selectedTab = 0) {
  const model = cars[index];
  const panelContent = [
    `<dl>${Object.entries(model.spec)
      .map(([label, value]) => `<div><dt class="mono">${label}</dt><dd>${value}</dd></div>`)
      .join("")}</dl>`,
    `<p class="mono">Designer</p><p class="designer-name">${model.designer[0]}</p><p>${model.designer[1]}</p>`,
    `<ul>${model.eng.map((item) => `<li>${item}</li>`).join("")}</ul>`,
    `<ul>${model.sig.map((item) => `<li>${item}</li>`).join("")}</ul>`,
  ][selectedTab];

  car.innerHTML = `
    <div class="car-img"><img src="${model.img}" alt="Concept visual for ${model.name}" loading="lazy" data-parallax></div>
    <div class="car-details">
      <p class="mono">${model.year} · concept model</p>
      <h2>${model.name}</h2>
      <p class="tag mono">${model.tag}</p>
      <p>${model.desc}</p>
      <div class="tabs" role="tablist" aria-label="${model.name} details">${tabs
        .map((label, tabIndex) => `<button role="tab" aria-selected="${tabIndex === selectedTab}" data-t="${tabIndex}">${label}</button>`)
        .join("")}</div>
      <div class="panel" role="tabpanel">${panelContent}</div>
    </div>`;
  car.dataset.i = index;
  [...selector.children].forEach((button, buttonIndex) =>
    button.setAttribute("aria-selected", String(buttonIndex === index)),
  );
}

selector.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-i]");
  if (button) showCar(Number(button.dataset.i));
});

car.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-t]");
  if (button) showCar(Number(car.dataset.i), Number(button.dataset.t));
});

document.addEventListener("keydown", (event) => {
  const activeTab = event.target.closest('[role="tab"]');
  if (!activeTab || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  const siblings = [...activeTab.parentElement.children];
  const offset = event.key === "ArrowRight" ? 1 : -1;
  siblings[(siblings.indexOf(activeTab) + offset + siblings.length) % siblings.length].click();
});

showCar(0);

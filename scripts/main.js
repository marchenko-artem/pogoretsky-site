// ===== Concerts rendering =====
function renderConcerts(list, elemId) {
  const box = document.getElementById(elemId || "upcoming");
  if (!box) return;
  box.innerHTML = list
    .map(
      (e) => `
    <article class="card">
      <div class="badge">${new Date(e.dateTimeStart).toLocaleDateString()}</div>
      <h3>${e.city || ""}${e.country ? ", " + e.country : ""}</h3>
      <p>${e.venue || ""}</p>
      <p>${e.program || ""}</p>
      <p>
        ${
          e.ticketUrl
            ? `<a href="${e.ticketUrl}" target="_blank" rel="noopener">${
                I18N.dict["concerts.tickets"] || "Tickets"
              }</a>`
            : ""
        }
        ${
          e.moreInfoUrl
            ? ` · <a href="${e.moreInfoUrl}" target="_blank" rel="noopener">${
                I18N.dict["concerts.details"] || "Details"
              }</a>`
            : ""
        }
        ${icsLink(e)}
      </p>
    </article>
  `
    )
    .join("");
}

function icsLink(e) {
  try {
    const dt = new Date(e.dateTimeStart);
    const dtEnd = new Date(e.dateTimeEnd || dt.getTime() + 2 * 60 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, "0");
    const fmt = (d) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(
        d.getUTCDate()
      )}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Pogoretsky//Concerts//EN",
      "BEGIN:VEVENT",
      `DTSTART:${fmt(dt)}`,
      `DTEND:${fmt(dtEnd)}`,
      `SUMMARY:${(e.program || "Concert").replace(/\n/g, " ")}`,
      `LOCATION:${[e.venue, e.city, e.country].filter(Boolean).join(", ")}`,
      `DESCRIPTION:${(e.moreInfoUrl || "").replace(/:/g, "\\:")}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    return ` · <a href="${url}" download="concert.ics">${
      I18N.dict["concerts.add_to_calendar"] || "Add to Calendar"
    }</a>`;
  } catch (err) {
    return "";
  }
}

async function fetchConcerts() {
  try {
    const res = await fetch("data/concerts.json");
    const all = await res.json();
    return all;
  } catch (e) {
    console.warn("concerts load failed", e);
    return [];
  }
}

async function initConcertsPage() {
  const all = await fetchConcerts();
  const now = new Date();
  const upcoming = all
    .filter((e) => new Date(e.dateTimeStart) >= now)
    .sort((a, b) => new Date(a.dateTimeStart) - new Date(b.dateTimeStart));
  const archive = all
    .filter((e) => new Date(e.dateTimeStart) < now)
    .sort((a, b) => new Date(b.dateTimeStart) - new Date(a.dateTimeStart));

  // Populate filters
  const countrySel = document.getElementById("filter-country");
  const yearSel = document.getElementById("filter-year");
  if (countrySel) {
    const countries = [
      ...new Set(all.map((x) => x.country).filter(Boolean)),
    ].sort();
    countrySel.innerHTML =
      `<option value="">All countries</option>` +
      countries.map((c) => `<option value="${c}">${c}</option>`).join("");
  }
  if (yearSel) {
    const years = [
      ...new Set(all.map((x) => new Date(x.dateTimeStart).getFullYear())),
    ].sort((a, b) => b - a);
    yearSel.innerHTML =
      `<option value="">All years</option>` +
      years.map((y) => `<option value="${y}">${y}</option>`).join("");
  }

  function applyFilters(src, targetId) {
    const c = (document.getElementById("filter-country") || {}).value || "";
    const y = (document.getElementById("filter-year") || {}).value || "";
    const q =
      (document.getElementById("filter-q") || {}).value?.toLowerCase() || "";
    const filtered = src.filter((e) => {
      const okC = !c || e.country === c;
      const okY = !y || new Date(e.dateTimeStart).getFullYear() == Number(y);
      const hay = [e.city, e.country, e.venue, e.program]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const okQ = !q || hay.includes(q);
      return okC && okY && okQ;
    });
    renderConcerts(filtered, targetId);
  }

  // initial render
  renderConcerts(upcoming, "upcoming-list");
  renderConcerts(archive, "archive-list");

  // bind
  ["filter-country", "filter-year", "filter-q"].forEach((id) => {
    const el = document.getElementById(id);
    if (el)
      el.addEventListener("input", () =>
        applyFilters(upcoming, "upcoming-list")
      );
  });
  const tabBtns = document.querySelectorAll("[data-tab]");
  tabBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      const t = btn.getAttribute("data-tab");
      document
        .querySelectorAll("[data-tabpanel]")
        .forEach(
          (p) =>
            (p.style.display =
              p.getAttribute("data-tabpanel") === t ? "block" : "none")
        );
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    })
  );
}

// ===== Header behavior: transparent on hero, solid on scroll =====
function initHeaderScroll() {
  const header = document.querySelector("header");
  const hero = document.querySelector(".hero");
  if (!header) return;

  // Если hero отсутствует — сразу делаем хедер солидным
  if (!hero) {
    header.classList.add("header--solid");
    return;
  }

  // Делаем хедер солидным, когда hero менее чем на 60% в вьюпорте
  const observer = new IntersectionObserver(
    (entries) => {
      const e = entries[0];
      if (e.intersectionRatio < 0.6) {
        header.classList.add("header--solid");
      } else {
        header.classList.remove("header--solid");
      }
    },
    { threshold: [0, 0.6, 1] }
  );

  observer.observe(hero);
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("concerts-page")) initConcertsPage();
  initHeaderScroll();
});

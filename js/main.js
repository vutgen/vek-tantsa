const WA = "79224696434";
const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
document.querySelectorAll("[data-wa]").forEach((a) => {
  a.href = waLink(a.dataset.msg || "Здравствуйте! Хочу записаться на пробное занятие в «Век танца».");
  a.target = "_blank"; a.rel = "noopener";
});
document.getElementById("y").textContent = new Date().getFullYear();

/* шапка */
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", scrollY > 40);
addEventListener("scroll", onScroll, { passive: true }); onScroll();

/* появление */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll(".card,.steps li,details,.quiz,.where>*").forEach((el) => { el.classList.add("rv"); io.observe(el); });

/* квиз: подбор направления */
const body = document.getElementById("qbody"), bar = document.getElementById("qbar");
const steps = [
  { t: "Для кого занятие?", o: [["Для ребёнка", "kid"], ["Для меня", "adult"]] },
  { t: "Что хотите получить?", o: {
      kid: [["Красивую осанку и координацию", "posture"], ["Просто чтобы ребёнку было интересно", "fun"], ["Гибкость и растяжку", "flex"]],
      adult: [["Красивую осанку и пластику", "posture"], ["Гибкость, меньше зажимов в спине", "flex"], ["Отвлечься и получить удовольствие", "fun"]] } },
];
const results = {
  kid: { name: "Занятия для детей с 3 лет", price: "4 000 ₽", text: "Мягкое знакомство с танцем: осанка, координация, музыка. Подойдёт и малышам, и школьникам." },
  adultPosture: { name: "Балет для взрослых", price: "от 2 000 ₽", text: "Красивая осанка и лёгкая пластика. Не нужно уметь: приходите, как вы есть." },
  adultFlex: { name: "Растяжка", price: "3 800 ₽", text: "Больше гибкости, меньше зажимов в спине и шее, лёгкость в теле после занятия." },
  adultFun: { name: "Балет для взрослых", price: "от 2 000 ₽", text: "Музыка, движение и красивая форма занятий. Отличный способ отвлечься после работы." },
};
let who = null, goal = null;
function render(i) {
  bar.style.width = `${(i / (steps.length + 1)) * 100}%`;
  if (i >= steps.length) return result();
  const s = steps[i];
  const opts = Array.isArray(s.o) ? s.o : s.o[who];
  body.innerHTML = `<h3 class="q-title">${s.t}</h3><div class="opts">${opts.map(([l, v]) => `<button class="opt" data-v="${v}">${l}</button>`).join("")}</div>`;
  body.querySelectorAll(".opt").forEach((b) => b.addEventListener("click", () => { if (i === 0) who = b.dataset.v; else goal = b.dataset.v; render(i + 1); }));
}
function result() {
  bar.style.width = "100%";
  let r = who === "kid" ? results.kid : goal === "flex" ? results.adultFlex : goal === "fun" ? results.adultFun : results.adultPosture;
  if (who === "kid" && goal === "flex") r = { ...results.adultFlex, name: "Растяжка (спросите про детские группы)", text: "Подскажем, есть ли подходящая группа для вашего ребёнка, и подберём время." };
  const msg = `Здравствуйте! Подбирала направление на сайте: ${r.name}. Хочу записаться на пробное занятие.`;
  body.innerHTML = `<div class="res"><p class="kicker">Вам подойдёт</p><h3>${r.name}</h3><p>${r.text}</p><span class="rp">${r.price}</span><br><a class="btn" href="${waLink(msg)}" target="_blank" rel="noopener">Записаться на пробное 199 ₽</a><button class="again">Пройти заново</button></div>`;
  body.querySelector(".again").addEventListener("click", () => { who = goal = null; render(0); });
}
render(0);

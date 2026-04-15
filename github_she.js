// ====== 設定 ======

// 記念日（付き合った日/出会った日）
// 形式: "YYYY-MM-DDTHH:MM:SS+09:00"（日本時間）
const anniversary = "2025-09-11T00:00:00+09:00";
// 誕生日（YYYY-MM-DD）
const birthdayA = "2001-08-22"; // あおちゃん
const birthdayY = "2001-04-21"; // ゆうくん


// ====== パスワードUI ======
const correctPass = "おぱんちゅ";

const lockEl = document.getElementById("lock");
const passInput = document.getElementById("passInput");
const passBtn = document.getElementById("passBtn");
const passMsg = document.getElementById("passMsg");

function normalizePass(s){
  return (s ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, c =>
      String.fromCharCode(c.charCodeAt(0) - 0xFEE0)
    );
}

function unlock(){
  lockEl.classList.add("hide");
  setTimeout(() => lockEl.remove(), 400);
}

function wrong(){
  passMsg.textContent = "合言葉が違うみたい…もう一回!🐕🐾";
  lockEl.querySelector(".lockCard").classList.remove("shake");
  void lockEl.offsetWidth;
  lockEl.querySelector(".lockCard").classList.add("shake");
  passInput.select();
}

function checkPass(){
  const v = normalizePass(passInput.value);
  if(v === correctPass){
    passMsg.textContent = "あおちゃん、いらっしゃい🐰";
    unlock();
  }else{
    wrong();
  }
}

passBtn.addEventListener("click", checkPass);
passInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter") checkPass();
});

setTimeout(() => passInput.focus(), 50);


// ====== 写真リスト ======
const photos = [
  { src: "photos/01.jpg", caption: "初めて会った日！2025.10.20" },
  { src: "photos/02.jpg", caption: "お泊り！2025.10.26" },
  { src: "photos/03.jpg", caption: "つかしんでプリクラ！2025.11.09" },
  { src: "photos/04.JPG", caption: "ディズニー！2025.11.29" },
  { src: "photos/05.jpg", caption: "六本木イルミ！2025.12.24" },
  { src: "ooo.jpg", caption: "追加予定。。。" }
];

// ====== 手紙 ======
const letterText = `
あおちゃんへ🐰

付き合ってくれてありがとう！
遠距離で会えない時間もあるけどその分、会える日の嬉しさは特別だよ^ ^

改札で見つけた瞬間とか、隣に並んで歩ける時間とか
何気ないことが全部うれしく感じます（笑）

最近で言うとバレンタインに貰ったチョコが最高やった！
味ももちろん美味しかったけどそれ以上に気持ちがめっちゃ嬉しかった！

また今度不定期でお手紙送るから壁中に貼り付けるんだよ🤣

これからも、たくさん思い出作ろね
大好きだよ😆
`;


// ====== 記念日カウント ======
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minsEl = document.getElementById("mins");
const sinceEl = document.getElementById("since");
const secsEl = document.getElementById("secs");

function pad2(n){ return String(n).padStart(2, "0"); }

function addMonths(date, months){
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() < day) d.setDate(0);
  return d;
}
function addYears(date, years){
  const d = new Date(date);
  const m = d.getMonth();
  d.setFullYear(d.getFullYear() + years);
  if (d.getMonth() !== m) d.setDate(0);
  return d;
}
function parseYMD(s){
  const m = String(s || "").trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!m) return null;
  const y = Number(m[1]), mo = Number(m[2]), da = Number(m[3]);
  const dt = new Date(y, mo - 1, da, 0, 0, 0);
  if (dt.getFullYear() !== y || dt.getMonth() !== (mo - 1) || dt.getDate() !== da) return null;
  return dt;
}
function nextBirthday(bdDate, now){
  if(!bdDate) return null;
  const y = now.getFullYear();
  const thisYear = new Date(y, bdDate.getMonth(), bdDate.getDate(), 0, 0, 0);
  if (thisYear - now >= 0) return thisYear;
  return new Date(y + 1, bdDate.getMonth(), bdDate.getDate(), 0, 0, 0);
}
function diffParts(ms){
  if(ms < 0) ms = 0;
  const totalMins = Math.floor(ms / 60000);
  const totalHours = Math.floor(ms / 3600000);
  const days = Math.floor(ms / 86400000);
  const hours = totalHours - days * 24;
  const mins = totalMins - totalHours * 60;
  return { days, hours, mins };
}

function updateCounter(){
  const start = new Date(anniversary);
  const now = new Date();

  let diffMs = now - start;
  if (diffMs < 0) diffMs = 0;

  const totalMins = Math.floor(diffMs / 60000);
  const totalHours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  const hours = totalHours - days * 24;
  const mins = totalMins - totalHours * 60;
  const secs = Math.floor((diffMs % 60000) / 1000);

  secsEl.textContent = pad2(secs);
  daysEl.textContent = days;
  hoursEl.textContent = pad2(hours);
  minsEl.textContent = pad2(mins);

  const y = start.getFullYear();
  const m = start.getMonth() + 1;
  const d = start.getDate();
  sinceEl.textContent = `記念日：${y}/${pad2(m)}/${pad2(d)} から`;

  const remainHalfEl = document.getElementById("remainHalf");
  const remainYearEl = document.getElementById("remainYear");
  const remainBDAEl = document.getElementById("remainBDA");
  const remainBDYEl = document.getElementById("remainBDY");

  const halfDate = addMonths(start, 6);
  const yearDate = addYears(start, 1);

  const halfRemain = diffParts(halfDate - now);
  const yearRemain = diffParts(yearDate - now);

  if(remainHalfEl){
    remainHalfEl.textContent =
      (halfDate - now <= 0)
        ? "半年記念日：達成🎉"
        : `半年まであと ${halfRemain.days}日（${pad2(halfRemain.hours)}時間 ${pad2(halfRemain.mins)}分）`;
  }
  if(remainYearEl){
    remainYearEl.textContent =
      (yearDate - now <= 0)
        ? "1年記念日：達成🎉"
        : `1年まであと ${yearRemain.days}日（${pad2(yearRemain.hours)}時間 ${pad2(yearRemain.mins)}分）`;
  }

  const bdA = parseYMD(birthdayA);
  const bdY = parseYMD(birthdayY);
  const nextA = nextBirthday(bdA, now);
  const nextY = nextBirthday(bdY, now);

  if(remainBDAEl){
    if(nextA){
      const aRemain = diffParts(nextA - now);
      remainBDAEl.textContent = `あおちゃん誕生日まであと ${aRemain.days}日`;
    }else{
      remainBDAEl.textContent = "あおちゃん誕生日：birthdayA を YYYY-MM-DD で設定してね";
    }
  }
  if(remainBDYEl){
    if(nextY){
      const yRemain = diffParts(nextY - now);
      remainBDYEl.textContent = `ゆうくん誕生日まであと ${yRemain.days}日`;
    }else{
      remainBDYEl.textContent = "ゆうくん誕生日：birthdayY を YYYY-MM-DD で設定してね";
    }
  }
}

setInterval(updateCounter, 1000);
updateCounter();


// ====== スライド ======
const slideEl = document.getElementById("slide");
const captionEl = document.getElementById("caption");
const dotsEl = document.getElementById("dots");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let idx = 0;
let timer = null;

function renderDots(){
  dotsEl.innerHTML = "";
  photos.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "dot" + (i === idx ? " active" : "");
    dot.addEventListener("click", () => {
      idx = i;
      showSlide();
      restartAuto();
    });
    dotsEl.appendChild(dot);
  });
}

function showSlide(){
  const item = photos[idx];
  slideEl.src = item.src;
  captionEl.textContent = item.caption || "";
  renderDots();
}

function prev(){
  idx = (idx - 1 + photos.length) % photos.length;
  showSlide();
}
function next(){
  idx = (idx + 1) % photos.length;
  showSlide();
}

prevBtn.addEventListener("click", () => { prev(); restartAuto(); });
nextBtn.addEventListener("click", () => { next(); restartAuto(); });

function startAuto(){
  timer = setInterval(next, 4500);
}
function restartAuto(){
  if(timer) clearInterval(timer);
  startAuto();
}

showSlide();
startAuto();


// ====== 手紙 ======
document.getElementById("letter").textContent = letterText.trim();

const heart = document.getElementById("secretHeart");
const secretBox = document.getElementById("secretBox");

let pressTimer = null;

if(heart){
  heart.addEventListener("mousedown", startPress);
  heart.addEventListener("touchstart", startPress);
  heart.addEventListener("mouseup", cancelPress);
  heart.addEventListener("mouseleave", cancelPress);
  heart.addEventListener("touchend", cancelPress);
}


// ====== 思い出 検索・タグフィルター ======
(function(){
  const searchInput = document.getElementById("memSearch");
  const tagBtns = document.querySelectorAll(".tagBtn");
  const memItems = document.querySelectorAll("#memoryList li");
  const memCount = document.getElementById("memCount");

  // 「件数なし」メッセージ要素を生成
  const noResult = document.createElement("p");
  noResult.className = "noResult";
  noResult.textContent = "😢 該当する思い出が見つかりませんでした";
  document.getElementById("memoryList").after(noResult);

  let activeTag = "all";

  // タグバッジを各 li に注入
  memItems.forEach(li => {
    const tags = (li.dataset.tags || "").split(",").map(t => t.trim()).filter(Boolean);
    if(tags.length){
      const badgeWrap = document.createElement("div");
      badgeWrap.className = "tagBadges";
      tags.forEach(t => {
        const badge = document.createElement("span");
        badge.className = "tagBadge";
        badge.textContent = t;
        badgeWrap.appendChild(badge);
      });
      // <strong>（日付）の直後に挿入
      const strong = li.querySelector("strong");
      if(strong && strong.nextSibling){
        li.insertBefore(badgeWrap, strong.nextSibling);
      } else {
        li.insertBefore(badgeWrap, li.firstChild);
      }
    }
  });

  function applyFilter(){
    const q = searchInput.value.trim().toLowerCase();
    let shown = 0;

    memItems.forEach(li => {
      const tags = (li.dataset.tags || "").split(",").map(t => t.trim());
      const tagMatch = activeTag === "all" || tags.includes(activeTag);
      const textMatch = !q || li.textContent.toLowerCase().includes(q);

      if(tagMatch && textMatch){
        li.classList.remove("mem-hidden");
        shown++;
      } else {
        li.classList.add("mem-hidden");
      }
    });

    memCount.textContent = `${shown} 件`;
    noResult.classList.toggle("show", shown === 0);
  }

  // タグボタンのクリック処理
  tagBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tagBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeTag = btn.dataset.tag;
      applyFilter();
    });
  });

  // 検索入力
  searchInput.addEventListener("input", applyFilter);

  // 初期表示
  applyFilter();
})();

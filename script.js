/* Ubah data warung di blok ini. Sisa halaman mengikuti otomatis. */
var CONFIG = {
  name: "Bakso Juragan",
  whatsapp: "6281234567890",
  phoneDisplay: "0812-3456-7890",
  address: "Jl. Contoh No. 12, Kota Anda",
  instagram: "@baksojuragan",
  hours: [
    ["Senin – Jumat", "10.00 – 21.00"],
    ["Sabtu – Minggu", "09.00 – 22.00"]
  ],
  hoursShort: "Setiap hari, 10.00 – 21.00 WIB",
  menu: [
    { cat: "Bakso", note: "Disajikan dengan kuah", items: [
      { id: "b1", name: "Bakso Urat", desc: "Bakso urat kenyal, mie kuning, bawang goreng, seledri.", price: 25000 },
      { id: "b2", name: "Bakso Halus", desc: "Bakso halus lembut, bihun, tauge, kuah kaldu.", price: 22000 },
      { id: "b3", name: "Bakso Campur", desc: "Bakso urat, bakso halus, tahu, dan siomay dalam satu mangkuk.", price: 28000 },
      { id: "b4", name: "Bakso Telur", desc: "Bakso urat berisi telur puyuh, mie kuning.", price: 27000 },
      { id: "b5", name: "Bakso Beranak", desc: "Satu bakso besar berisi bakso kecil dan telur.", price: 32000 },
      { id: "b6", name: "Mie Ayam Bakso", desc: "Mie ayam cincang dengan tiga butir bakso.", price: 26000 }
    ]},
    { cat: "Pelengkap", note: "Teman semangkuk bakso", items: [
      { id: "t1", name: "Pangsit Goreng", desc: "Tiga potong, renyah, dengan saus sambal.", price: 8000 },
      { id: "t2", name: "Tahu Isi", desc: "Tiga potong tahu isi daging cincang.", price: 7000 },
      { id: "t3", name: "Tambah Bakso", desc: "Lima butir bakso urat.", price: 12000 },
      { id: "t4", name: "Nasi Putih", desc: "Seporsi nasi hangat.", price: 5000 },
      { id: "t5", name: "Kerupuk", desc: "Kerupuk putih, satu bungkus kecil.", price: 2000 }
    ]},
    { cat: "Minuman", note: "Dingin atau hangat", items: [
      { id: "m1", name: "Es Teh Manis", desc: "Teh seduh, gula secukupnya.", price: 5000 },
      { id: "m2", name: "Es Jeruk", desc: "Jeruk peras segar.", price: 8000 },
      { id: "m3", name: "Teh Hangat", desc: "Manis atau tawar.", price: 4000 },
      { id: "m4", name: "Air Mineral", desc: "Botol 600 ml.", price: 4000 }
    ]}
  ]
};

(function () {
  var qty = {};
  var byId = {};
  var $ = function (id) { return document.getElementById(id); };
  var rp = function (n) { return "Rp " + n.toLocaleString("id-ID"); };

  // identitas
  document.title = CONFIG.name;
  $("brandName").textContent = CONFIG.name;
  $("hoursShort").textContent = CONFIG.hoursShort;
  $("addrShort").textContent = CONFIG.address;
  $("phoneShort").textContent = "WhatsApp " + CONFIG.phoneDisplay;
  $("addrFull").textContent = CONFIG.address;
  $("mapBtn").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.name + " " + CONFIG.address);
  $("copy").textContent = "© " + new Date().getFullYear() + " " + CONFIG.name;
  $("social").textContent = "Instagram " + CONFIG.instagram;
  CONFIG.hours.forEach(function (h) {
    var tr = document.createElement("tr");
    var a = document.createElement("td"); a.textContent = h[0];
    var b = document.createElement("td"); b.textContent = h[1];
    tr.appendChild(a); tr.appendChild(b); $("hoursTable").appendChild(tr);
  });

  // menu
  var list = $("menuList");
  CONFIG.menu.forEach(function (c) {
    var wrap = document.createElement("div"); wrap.className = "cat";
    var h = document.createElement("h3");
    h.appendChild(document.createTextNode(c.cat));
    var sm = document.createElement("small"); sm.textContent = c.note; h.appendChild(sm);
    wrap.appendChild(h);
    var grid = document.createElement("div"); grid.className = "items";
    c.items.forEach(function (it) {
      byId[it.id] = it; qty[it.id] = 0;
      var row = document.createElement("div"); row.className = "item";
      var n = document.createElement("div"); n.className = "name"; n.textContent = it.name;
      var p = document.createElement("div"); p.className = "price"; p.textContent = rp(it.price);
      var d = document.createElement("div"); d.className = "desc"; d.textContent = it.desc;
      var act = document.createElement("div"); act.className = "act"; act.id = "act-" + it.id;
      row.appendChild(n); row.appendChild(p); row.appendChild(d); row.appendChild(act);
      grid.appendChild(row);
    });
    wrap.appendChild(grid); list.appendChild(wrap);
  });

  function renderAct(id) {
    var act = $("act-" + id); act.innerHTML = "";
    var it = byId[id];
    if (!qty[id]) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "add"; b.textContent = "Tambah";
      b.setAttribute("aria-label", "Tambah " + it.name);
      b.onclick = function () { change(id, 1); };
      act.appendChild(b);
    } else {
      var s = document.createElement("div"); s.className = "step";
      var m = document.createElement("button"); m.type = "button"; m.textContent = "−"; m.setAttribute("aria-label", "Kurangi " + it.name);
      m.onclick = function () { change(id, -1); };
      var o = document.createElement("output"); o.textContent = qty[id];
      var pl = document.createElement("button"); pl.type = "button"; pl.textContent = "+"; pl.setAttribute("aria-label", "Tambah " + it.name);
      pl.onclick = function () { change(id, 1); };
      s.appendChild(m); s.appendChild(o); s.appendChild(pl); act.appendChild(s);
    }
  }

  function change(id, d) {
    qty[id] = Math.max(0, qty[id] + d);
    renderAct(id); update();
  }

  function update() {
    var count = 0, total = 0, lines = $("lines");
    lines.innerHTML = "";
    var msg = [];
    Object.keys(qty).forEach(function (id) {
      if (!qty[id]) return;
      var it = byId[id], sub = it.price * qty[id];
      count += qty[id]; total += sub;
      var li = document.createElement("li");
      var a = document.createElement("span"); a.textContent = qty[id] + " × " + it.name;
      var b = document.createElement("span"); b.textContent = rp(sub);
      li.appendChild(a); li.appendChild(b); lines.appendChild(li);
      msg.push("- " + qty[id] + "x " + it.name + " (" + rp(sub) + ")");
    });
    if (!count) {
      var e = document.createElement("li"); e.className = "empty"; e.textContent = "Belum ada menu yang dipilih.";
      lines.appendChild(e);
    }
    $("total").textContent = rp(total);
    $("barTotal").textContent = rp(total);
    $("barCount").textContent = count + " item";
    $("bar").classList.toggle("show", count > 0);

    var btn = $("waBtn");
    if (count) {
      var nm = $("custName").value.trim();
      var text = "Halo " + CONFIG.name + ", saya mau pesan:\n" + msg.join("\n") +
        "\nTotal: " + rp(total) +
        "\n\nNama: " + (nm || "-") +
        "\nCara ambil: " + $("mode").value +
        "\nCatatan: " + ($("note").value.trim() || "-");
      btn.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text);
      btn.setAttribute("aria-disabled", "false");
      $("waHint").textContent = "WhatsApp akan terbuka dengan pesanan yang sudah tertulis. Tekan kirim di sana.";
    } else {
      btn.href = "#"; btn.setAttribute("aria-disabled", "true");
      $("waHint").textContent = "Pilih minimal satu menu untuk mengirim pesanan.";
    }
  }

  ["custName", "mode", "note"].forEach(function (id) {
    $(id).addEventListener("input", update);
    $(id).addEventListener("change", update);
  });
  $("orderForm").addEventListener("submit", function (e) { e.preventDefault(); });

  // navigasi halus
  document.querySelectorAll("[data-go]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var t = $(a.getAttribute("data-go"));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
  });
  $("brandName").addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });

  Object.keys(byId).forEach(renderAct);
  update();
})();
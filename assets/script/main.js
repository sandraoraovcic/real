document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signInForm");
  if (!form) return;

  const cities = [
    "Beograd",
    "Novi Sad",
    "Niš",
    "Kragujevac",
    "Subotica"
  ];

  const citySelect = document.getElementById("city");
  if (citySelect) {
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Choose a city";
    citySelect.appendChild(defaultOption);

    cities.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  }

  const skinTypes = [
    "Normal",
    "Dry",
    "Oily",
    "Sensitive"
  ];

  const radioContainer = document.getElementById("skinTypeOptions");
  if (radioContainer) {
    skinTypes.forEach(type => {
      const label = document.createElement("label");

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "skinType";
      radio.value = type;

      label.appendChild(radio);
      label.append(" " + type);

      radioContainer.appendChild(label);
    });
  }


  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const city = document.getElementById("city");
  const skinRadios = document.querySelectorAll('input[name="skinType"]');
  const terms = document.getElementById("terms");
  const msg = document.getElementById("formMessage");

  const nameRegex = /^[A-ZČĆŽŠĐ][a-zčćžšđ]{1,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d).{8,}$/;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;
    clearErrors();
    if (msg) msg.textContent = "";

    if (!nameRegex.test(firstName.value.trim())) {
      showError(firstName, "First name must start with a capital letter and have at least 2 characters.");
      isValid = false;
    }

    if (!nameRegex.test(lastName.value.trim())) {
      showError(lastName, "Last name must start with a capital letter and have at least 2 characters.");
      isValid = false;
    }

    if (!emailRegex.test(email.value.trim())) {
      showError(email, "Enter a valid email address.");
      isValid = false;
    }

    if (!passwordRegex.test(password.value)) {
      showError(password, "Password must be at least 8 characters and contain at least one number.");
      isValid = false;
    }

    if (!city.value) {
      showError(city, "Please choose a city.");
      isValid = false;
    }

    const skinChecked = document.querySelector('input[name="skinType"]:checked');
    if (!skinChecked) {
      const radioGroup = document.querySelector(".radio-group");
      radioGroup.classList.add("has-error");
      radioGroup.querySelector("small.error").textContent = "Please select your skin type.";
      isValid = false;
    }

    if (!terms.checked) {
      showError(terms, "You must accept the terms.");
      isValid = false;
    }

    if (isValid) {
      showSuccess();
      form.reset();
    }
  });

  function showError(input, message) {
    const group = input.closest(".form-group");
    const error = group.querySelector("small.error");
    error.textContent = message;
    group.classList.add("has-error"); // ✅ promenjeno
  }

  function clearErrors() {
    document.querySelectorAll("small.error").forEach(el => (el.textContent = ""));
    document.querySelectorAll(".form-group").forEach(g => g.classList.remove("has-error")); 
  }

  function showSuccess() {
    if (!msg) return;
    msg.textContent = "Form successfully submitted!";
    msg.style.color = "#0f0";

    setTimeout(() => {
      msg.textContent = ""; // ✅ ne brišemo element!
    }, 3000);
  }
});

  function initNav() {
  const mount = document.getElementById("nav-mount");
  if (!mount) return;

  const isPages = window.location.pathname.includes("/pages/");
  const prefix = isPages ? "../" : "";

  const toIndex = (anchor) =>
    isPages ? `${prefix}index.html#${anchor}` : `#${anchor}`;

  const navItems = [
    { text: "Home", href: toIndex("home") },
    { text: "About", href: toIndex("about") },
    { text: "Products", href: toIndex("products-section") },
    { text: "Sustainability", href: toIndex("special-section") },
    { text: "Reviews", href: toIndex("comments-section") },
    { text: "Contact", href: toIndex("contact-form") },

    { text: "Author", href: isPages ? "autor.html" : "pages/autor.html" },
    { text: "Documentation", href: `${prefix}documentation.pdf`, target: "_blank" },
    { text: "Download ZIP", href: `${prefix}real.zip`, download: true }
  ];

  const ul = document.createElement("ul");
  ul.className = "navbar-nav ms-auto mb-2 mb-lg-0";

  navItems.forEach(item => {
    const li = document.createElement("li");
    li.className = "nav-item";

    const a = document.createElement("a");
    a.className = "nav-link";
    a.textContent = item.text;
    a.href = item.href;

    if (item.target) a.target = item.target;
    if (item.download) a.setAttribute("download", "");

    li.appendChild(a);
    ul.appendChild(li);
  });

  mount.innerHTML = `
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand" href="${toIndex("home")}">
          <span>Real</span>Beauty
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarNav" aria-controls="navbarNav"
          aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav"></div>
      </div>
    </nav>
  `;

  mount.querySelector("#navbarNav").appendChild(ul);
  setActiveNavLink();
}


function setActiveNavLink() {
  const links = document.querySelectorAll(".navbar .nav-link");
  if (!links.length) return;

  links.forEach(a => a.classList.remove("active"));

  const path = window.location.pathname;


  if (path.includes("autor.html")) {
    document.querySelector('.nav-link[href$="autor.html"], .nav-link[href$="pages/autor.html"]')
      ?.classList.add("active");
    return;
  }

  document.querySelector('.nav-link[href="#home"], .nav-link[href$="index.html#home"]')
    ?.classList.add("active");
}


document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("products");
  if (!productsContainer) return;

  const products = [
    { id: 1, name: "Product 1", price: 30, img: "assets/images/product1.jpg", alt:"Natural setting powder", launch: "launching in november 2026" },
    { id: 2, name: "Product 2", price: 40, img: "assets/images/product2.jpg", alt:"All natural face cream", launch: "launching in november 2026" },
    { id: 3, name: "Product 3", price: 50, img: "assets/images/product3.jpg", alt:"Natural-based face serum", launch: "launching in november 2026" },
    { id: 4, name: "Product 4", price: 30, img: "assets/images/product4.jpg", alt:"Organic foundation for all skin types", launch: "launching in november 2026" },
    { id: 5, name: "Product 5", price: 45, img: "assets/images/product5.jpg", alt:"Vegan lipstik in neutral color", launch: "launching in november 2026" },
    { id: 6, name: "Product 6", price: 60, img: "assets/images/product6.jpg", alt:"Face spray from natural ingridients", launch: "launching in november 2026" }
  ];

  renderProducts(products, productsContainer);
});

function renderProducts(products, container) {
  container.innerHTML = ""; 

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.className = "card-img-top";
    img.src = p.img;
    img.alt = p.name;

    const body = document.createElement("div");
    body.className = "card-body";

    const launch = document.createElement("p");
    launch.className = "card-text";
    launch.textContent = p.launch;

    const title = document.createElement("h4");
    title.className = "card-title";
    title.textContent = p.name;

    const price = document.createElement("p");
    price.className = "card-text";
    price.textContent = `${p.price}$`;

    body.appendChild(launch);
    body.appendChild(title);
    body.appendChild(price);

    card.appendChild(img);
    card.appendChild(body);

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initCountdown();
  renderSpecials();
  renderComments();
  initFooter();
});

function initCountdown() {
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");
  const msgEl = document.getElementById("cd-message");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const launchDate = new Date("2026-11-01T00:00:00");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const now = new Date();
    const diff = launchDate - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      if (msgEl) msgEl.textContent = "We are live! Products are available now.";
      clearInterval(timer);
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);

    if (msgEl) msgEl.textContent = "";
  }

  tick();
  const timer = setInterval(tick, 1000);
}


function renderSpecials() {
  const specialsContainer = document.getElementById("specials");
  if (!specialsContainer) return;

  const specials = [
    { iconClass: "fa-solid fa-seedling", title: "Plant-based" },
    { iconClass: "fa-solid fa-skull-crossbones", title: "Non-toxic" },
    { iconClass: "fa-solid fa-shield-dog", title: "Cruelty-free" }
  ];

  specialsContainer.innerHTML = "";

  specials.forEach((s) => {
    const card = document.createElement("div");
    card.className = "card";

    const iconWrap = document.createElement("div");
    iconWrap.className = "card-icon";

    const icon = document.createElement("i");
    icon.className = s.iconClass;

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h4");
    title.className = "card-title";
    title.textContent = s.title;

    iconWrap.appendChild(icon);
    body.appendChild(title);
    card.appendChild(iconWrap);
    card.appendChild(body);

    specialsContainer.appendChild(card);
  });
}

function renderComments() {
  const commentsContainer = document.getElementById("comments");
  if (!commentsContainer) return;

  const comments = [
    { text: `"I’ve been using RealBeauty products for a few weeks now and my skin has never felt better. The texture is light, absorbs quickly and doesn’t irritate my sensitive skin at all."`,author: "- Sharlene Rose"},
    { text: `"What I love the most is that the ingredients are clearly listed and genuinely natural. No strong fragrances, no irritation — just clean and effective skincare."`,author: "- Gabriel Shelby"},
    { text: `"Finally a brand that combines sustainability and quality. My skin looks healthier and I feel good knowing the products are cruelty-free."`,author: "- Frankie Jordan"},
    { text: `"I love how gentle these products are on my skin."`, author: "- Emily Watson" },
    { text: `"Clean ingredients and visible results after just a week."`, author: "- Mark Stevens" },
    { text: `"Finally a brand I can trust for sensitive skin."`, author: "- Sophia Martinez" },
    { text: `"Amazing texture and no irritation at all."`, author: "- Laura Green" },
    { text: `"The sustainability aspect really matters to me."`, author: "- Daniel Moore" },
    { text: `"Great quality and beautiful packaging."`, author: "- Anna White" }
  ];

  commentsContainer.innerHTML = "";

  comments.forEach((c) => {
    const card = document.createElement("div");
    card.className = "card";

    const body = document.createElement("div");
    body.className = "card-body";

    const text = document.createElement("p");
    text.className = "card-text";
    text.innerHTML = c.text;

    const author = document.createElement("h5");
    author.className = "card-title";
    author.textContent = c.author;

    body.appendChild(text);
    body.appendChild(author);
    card.appendChild(body);

    commentsContainer.appendChild(card);
  });
}


function initFooter() {
  const mount = document.getElementById("footer-mount");
  if (!mount) return;

  const footerLinks = [
    { href: "https://instagram.com", icon: "fab fa-instagram", label: "Instagram", target: "_blank" },
    { href: "https://facebook.com", icon: "fab fa-facebook-f", label: "Facebook", target: "_blank" },
    { href: "mailto:hello@example.com", icon: "fas fa-envelope", label: "Email" }
  ];

  const footer = document.createElement("footer");
  footer.className = "site-footer";

  const content = document.createElement("div");
  content.className = "footer-content";

  footerLinks.forEach(item => {
    const a = document.createElement("a");
    a.href = item.href;
    a.setAttribute("aria-label", item.label);

    if (item.target) a.target = item.target;

    const i = document.createElement("i");
    i.className = item.icon;

    a.appendChild(i);
    content.appendChild(a);
  });

  footer.appendChild(content);
  mount.appendChild(footer);
}


//jquery


$(function () {
  const $root = $("#comments");
  if (!$root.length) return;

  let current = 0;
  let autoTimer = null;
  let perSlide = getPerSlide();

  const $originalCards = $root.find(".card").clone();

  function getPerSlide() {
    return window.matchMedia("(max-width: 900px)").matches ? 1 : 3;
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  function startAuto(slidesCount) {
    stopAuto();
    if (slidesCount <= 1) return;

    autoTimer = setInterval(() => {
      current = (current + 1) % slidesCount;
      showSlide(current);
    }, 5000);
  }

  function buildSlides() {
    $root.empty();

    const $cards = $originalCards.clone();
    $cards.appendTo($root);

    const $allCards = $root.find(".card");
    const slides = [];

    for (let i = 0; i < $allCards.length; i += perSlide) {
      const $slide = $('<div class="comment-slide"></div>');
      $allCards.slice(i, i + perSlide).appendTo($slide);
      $root.append($slide);
      slides.push($slide);
    }

    $root.children(".card").remove();

    if (current >= slides.length) current = 0;

    return slides;
  }

  let $slides = buildSlides();

  function showSlide(index) {
    $(".comment-slide").hide();
    $slides[index].css("display", "grid").show();
  }


  showSlide(current);
  startAuto($slides.length);


  $("#nextComment").on("click", function () {
    if ($slides.length <= 1) return;
    current = (current + 1) % $slides.length;
    showSlide(current);
  });

  $("#prevComment").on("click", function () {
    if ($slides.length <= 1) return;
    current = (current - 1 + $slides.length) % $slides.length;
    showSlide(current);
  });


  $(".comments-slider").on("mouseenter", function () {
    stopAuto();
  });

  $(".comments-slider").on("mouseleave", function () {
    startAuto($slides.length);
  });

  
  let resizeTimer = null;
  $(window).on("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newPerSlide = getPerSlide();
      if (newPerSlide === perSlide) return;

      perSlide = newPerSlide;
      $slides = buildSlides();
      showSlide(current);
      startAuto($slides.length);
    }, 150);
  });
});








document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signInForm");

  if (!form) return; 

  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const terms = document.getElementById("terms");

  const nameRegex = /^[A-ZČĆŽŠĐ][a-zčćžšđ]{1,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d).{8,}$/;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;

    clearErrors();

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
    const error = group.querySelector(".error");
    error.textContent = message;
    group.classList.add("error");
  }

  function clearErrors() {
    document.querySelectorAll(".error").forEach(el => el.textContent = "");
  }

  function showSuccess() {
    const msg = document.createElement("p");
    msg.textContent = "Form successfully submitted!";
    msg.style.color = "#0f0";
    msg.style.marginTop = "20px";
    form.appendChild(msg);

    setTimeout(() => msg.remove(), 3000);
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const navigacija = document.getElementById("navigacija");
  if (!navigacija) return;

  const isPages = window.location.pathname.includes("/pages/");
  const prefix = isPages ? "../" : "";

  const homeHref = isPages ? `${prefix}index.html#home` : "#home";
  const aboutHref = isPages ? `${prefix}index.html#about` : "#about";
  const productsHref = isPages ? `${prefix}index.html#products-section` : "#products-section";
  const sustainabilityHref = isPages ? `${prefix}index.html#special-section` : "#special-section";
  const reviewsHref = isPages ? `${prefix}index.html#comments-section` : "#comments-section";
  const contactHref = isPages ? `${prefix}index.html#contact-form` : "#contact-form";

  const authorHref = isPages ? "autor.html" : "pages/autor.html";
  const docHref = `${prefix}documentation.pdf`;
  const zipHref = `${prefix}real.zip`;

  navigacija.innerHTML = `
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand" href="${homeHref}"><span>Real</span>Beauty</a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link" href="${homeHref}">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="${aboutHref}">About</a></li>
            <li class="nav-item"><a class="nav-link" href="${productsHref}">Products</a></li>
            <li class="nav-item"><a class="nav-link" href="${sustainabilityHref}">Sustainability</a></li>
            <li class="nav-item"><a class="nav-link" href="${reviewsHref}">Reviews</a></li>
            <li class="nav-item"><a class="nav-link" href="${contactHref}">Contact</a></li>
            <li class="nav-item"><a class="nav-link" href="${authorHref}">Author</a></li>
            <li class="nav-item"><a class="nav-link" href="${docHref}" target="_blank">Documentation</a></li>
            <li class="nav-item"><a class="nav-link" href="${zipHref}" download>Download ZIP</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `;

  setActiveNavLink();
});

function setActiveNavLink() {
  const links = document.querySelectorAll(".navbar .nav-link");
  if (!links.length) return;

  const path = window.location.pathname;

  links.forEach(a => a.classList.remove("active"));

  if (path.includes("autor.html")) {
    document.querySelector('.navbar .nav-link[href$="autor.html"], .navbar .nav-link[href$="pages/autor.html"]')?.classList.add("active");
    return;
  }

  document.querySelector('.navbar .nav-link[href="#home"], .navbar .nav-link[href$="index.html#home"]')?.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("products");
  if (!productsContainer) return;

  const products = [
    { id: 1, name: "Product 1", price: 30, img: "assets/images/product1.jpg", launch: "launching in november 2026" },
    { id: 2, name: "Product 2", price: 40, img: "assets/images/product2.jpg", launch: "launching in november 2026" },
    { id: 3, name: "Product 3", price: 50, img: "assets/images/product3.jpg", launch: "launching in november 2026" },
    { id: 4, name: "Product 4", price: 30, img: "assets/images/product4.jpg", launch: "launching in november 2026" },
    { id: 5, name: "Product 5", price: 45, img: "assets/images/product5.jpg", launch: "launching in november 2026" },
    { id: 6, name: "Product 6", price: 60, img: "assets/images/product6.jpg", launch: "launching in november 2026" }
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
  renderSpecials();
  renderComments();
});

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
    {
      text:
        `"I’ve been using RealBeauty products for a few weeks now and my skin has never felt better. The texture is light, 
        absorbs quickly and doesn’t irritate my sensitive skin at all."`,
      author: "- Sharlene Rose"
    },
    {
      text:
        `"What I love the most is that the ingredients are clearly listed and genuinely natural. No strong fragrances, 
        no irritation — just clean and effective skincare."`,
      author: "- Gabriel Shelby"
    },
    {
      text:
        `"Finally a brand that combines sustainability and quality. My skin looks healthier and I feel good knowing the products 
        are cruelty-free."`,
      author: "- Frankie Jordan"
    }
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


document.addEventListener("DOMContentLoaded", () => {
  const footerBlok = document.getElementById("footer-blok");
  if (!footerBlok) return;

  const isPages = window.location.pathname.includes("/pages/");
  const prefix = isPages ? "../" : "";

  footerBlok.innerHTML = `
    <footer class="site-footer">
      <div class="footer-content">
        <a href="https://instagram.com" target="_blank" aria-label="Instagram">
          <i class="fab fa-instagram"></i>
        </a>

        <a href="https://facebook.com" target="_blank" aria-label="Facebook">
          <i class="fab fa-facebook-f"></i>
        </a>

        <a href="mailto:hello@example.com" aria-label="Email">
          <i class="fas fa-envelope"></i>
        </a>
      </div>
    </footer>
  `;
});



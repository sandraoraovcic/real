let productsData = [];
let navigationData = [];
let specialsData = [];
let commentsData = [];
let footerData = [];
let cartData = [];

const PRODUCTS_PER_LOAD = 4;
const CART_KEY = "real_cart";

let visibleProductsCount = PRODUCTS_PER_LOAD;

$(document).ready(function () {
    loadCart();
    initNavigation();
    initFooter();
    bindEvents();
    initForm();
    initCountdown();
    renderSpecials();
    renderComments();
    loadProducts();
    renderCartPage();
});



function loadDataFromJson(path, successCallback, errorCallback) {
    $.ajax({
        url: path,
        method: "GET",
        dataType: "json",
        success: function (data) {
            successCallback(data);
        },
        error: function (xhr) {
            if (errorCallback) {
                errorCallback(xhr);
            } else {
                console.log(xhr);
            }
        }
    });
}

function isPagesDirectory() {
    return window.location.pathname.includes("/pages/");
}

function getAssetPath(relativePath) {
    if (isPagesDirectory()) {
        return `../${relativePath}`;
    }

    return relativePath;
}

function getImagePath(imagePath) {
    return getAssetPath(imagePath);
}



function initNavigation() {
    const navigationMount = document.getElementById("nav-mount");
    if (!navigationMount) return;

    loadDataFromJson(
        getAssetPath("assets/data/navigation.json"),
        function (data) {
            navigationData = data;
            renderNavigation(navigationMount);
            setActiveNavigationLink();
        },
        function (xhr) {
            console.log("Navigation cannot be loaded.");
            console.log(xhr);
        }
    );
}

function renderNavigation(navigationMount) {
    const homeLink = isPagesDirectory() ? "../index.html#home" : "#home";

    const navigationHtml = `
        <nav class="navbar navbar-expand-lg">
            <div class="container-fluid">
                <a class="navbar-brand" href="${homeLink}">
                    <span>Real</span>Beauty
                </a>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNav" aria-controls="navbarNav"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0" id="navMenu"></ul>
                </div>
            </div>
        </nav>
    `;

    navigationMount.innerHTML = navigationHtml;

    const navMenu = document.getElementById("navMenu");

    navigationData.forEach(function (navigationItem) {
        const resolvedHref = getNavigationLinkPath(navigationItem.href);
        let navigationItemHtml = "";

        if (navigationItem.isCart) {
            navigationItemHtml = `
                <li class="nav-item">
                    <a class="nav-link" href="${resolvedHref}">
                        ${navigationItem.text} (<span id="cartCount">0</span>)
                    </a>
                </li>
            `;
        } else {
            navigationItemHtml = `
                <li class="nav-item">
                    <a class="nav-link"
                       href="${resolvedHref}"
                       ${navigationItem.target ? `target="${navigationItem.target}"` : ""}
                       ${navigationItem.download ? "download" : ""}>
                        ${navigationItem.text}
                    </a>
                </li>
            `;
        }

        navMenu.innerHTML += navigationItemHtml;
    });

    updateCartCount();
}

function getNavigationLinkPath(href) {
    if (!isPagesDirectory()) {
        return href;
    }

    if (href.startsWith("#")) {
        return `../index.html${href}`;
    }

    if (href.startsWith("pages/")) {
        return href.replace("pages/", "");
    }

    return `../${href}`;
}

function setActiveNavigationLink() {
    const navigationLinks = document.querySelectorAll(".navbar .nav-link");
    if (!navigationLinks.length) return;

    navigationLinks.forEach(function (navigationLink) {
        navigationLink.classList.remove("active");
    });

    const currentPath = window.location.pathname;

    if (currentPath.includes("autor.html")) {
        document.querySelector('.nav-link[href$="autor.html"], .nav-link[href$="pages/autor.html"]')
            ?.classList.add("active");
        return;
    }

    if (currentPath.includes("cart.html")) {
        document.querySelector('.nav-link[href$="cart.html"], .nav-link[href$="pages/cart.html"]')
            ?.classList.add("active");
        return;
    }

    document.querySelector('.nav-link[href="#home"], .nav-link[href$="index.html#home"]')
        ?.classList.add("active");
}



function initFooter() {
    const footerMount = document.getElementById("footer-mount");
    if (!footerMount) return;

    loadDataFromJson(
        getAssetPath("assets/data/footer.json"),
        function (data) {
            footerData = data;
            renderFooter(footerMount);
        },
        function (xhr) {
            console.log("Footer cannot be loaded.");
            console.log(xhr);
        }
    );
}

function renderFooter(footerMount) {
    let footerHtml = `
        <footer class="site-footer">
            <div class="footer-content">
    `;

    footerData.forEach(function (footerItem) {
        footerHtml += `
            <a href="${footerItem.href}"
               aria-label="${footerItem.label}"
               ${footerItem.target ? `target="${footerItem.target}"` : ""}>
                <i class="${footerItem.icon}"></i>
            </a>
        `;
    });

    footerHtml += `
            </div>
        </footer>
    `;

    footerMount.innerHTML = footerHtml;
}



function loadProducts() {
    if (!$("#productsContainer").length) {
        return;
    }

    $("#productsMessage").text("Loading products...");

    loadDataFromJson(
        getAssetPath("assets/data/products.json"),
        function (data) {
            try {
                if (!Array.isArray(data)) {
                    throw new Error("Invalid products data format.");
                }

                productsData = data;
                populateCategoryFilter();
                populateSkinTypeFilter();
                $("#productsMessage").text("");
                renderProducts();
            } catch (error) {
                $("#productsMessage").text(error.message);
                console.log(error);
            }
        },
        function (xhr) {
            $("#productsMessage").text("Products cannot be loaded right now.");
            console.log(xhr);
        }
    );
}

function bindEvents() {
    $("#searchInput").on("input", function () {
        visibleProductsCount = PRODUCTS_PER_LOAD;
        renderProducts();
    });

    $("#categoryFilter").on("change", function () {
        visibleProductsCount = PRODUCTS_PER_LOAD;
        renderProducts();
    });

    $("#skinTypeFilter").on("change", function () {
        visibleProductsCount = PRODUCTS_PER_LOAD;
        renderProducts();
    });

    $("#sortSelect").on("change", function () {
        visibleProductsCount = PRODUCTS_PER_LOAD;
        renderProducts();
    });

    $("#loadMoreBtn").on("click", function () {
        visibleProductsCount += PRODUCTS_PER_LOAD;
        renderProducts();
    });

    $("#productsContainer").on("click", ".add-to-cart-btn", function () {
        const productId = Number($(this).data("id"));
        addToCart(productId);
    });

    $("#cartContainer").on("click", ".increase-btn", function () {
        const productId = Number($(this).data("id"));
        increaseQuantity(productId);
    });

    $("#cartContainer").on("click", ".decrease-btn", function () {
        const productId = Number($(this).data("id"));
        decreaseQuantity(productId);
    });

    $("#cartContainer").on("click", ".remove-btn", function () {
        const productId = Number($(this).data("id"));
        removeFromCart(productId);
    });
}

function populateCategoryFilter() {
    const categoryFilter = $("#categoryFilter");

    if (!categoryFilter.length) {
        return;
    }

    categoryFilter.find("option:not(:first)").remove();

    const categories = [];

    productsData.forEach(function (product) {
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    });

    categories.sort();

    categories.forEach(function (category) {
        categoryFilter.append(`<option value="${category}">${category}</option>`);
    });
}

function populateSkinTypeFilter() {
    const skinTypeFilter = $("#skinTypeFilter");

    if (!skinTypeFilter.length) {
        return;
    }

    skinTypeFilter.find("option:not(:first)").remove();

    const skinTypes = [];

    productsData.forEach(function (product) {
        if (!skinTypes.includes(product.skinType)) {
            skinTypes.push(product.skinType);
        }
    });

    skinTypes.sort();

    skinTypes.forEach(function (skinType) {
        skinTypeFilter.append(`<option value="${skinType}">${skinType}</option>`);
    });
}

function getFilteredProducts() {
    const searchTerm = $("#searchInput").val()?.trim().toLowerCase() || "";
    const selectedCategory = $("#categoryFilter").val() || "all";
    const selectedSkinType = $("#skinTypeFilter").val() || "all";

    return productsData.filter(function (product) {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        const matchesSkinType = selectedSkinType === "all" || product.skinType === selectedSkinType;

        return matchesSearch && matchesCategory && matchesSkinType;
    });
}

function sortProducts(products) {
    const sortValue = $("#sortSelect").val() || "default";
    const sortedProducts = [...products];

    sortedProducts.sort(function (firstProduct, secondProduct) {
        if (sortValue === "price-asc") {
            return firstProduct.price.discount - secondProduct.price.discount;
        }

        if (sortValue === "price-desc") {
            return secondProduct.price.discount - firstProduct.price.discount;
        }

        if (sortValue === "rating-desc") {
            return secondProduct.rating - firstProduct.rating;
        }

        if (sortValue === "name-asc") {
            return firstProduct.name.localeCompare(secondProduct.name);
        }

        return firstProduct.id - secondProduct.id;
    });

    return sortedProducts;
}

function renderProducts() {
    const productsContainer = $("#productsContainer");

    if (!productsContainer.length) {
        return;
    }

    productsContainer.empty();

    let filteredProducts = getFilteredProducts();
    filteredProducts = sortProducts(filteredProducts);

    if (filteredProducts.length === 0) {
        $("#productsMessage").text("No products match your criteria.");
        $("#loadMoreBtn").hide();
        return;
    }

    $("#productsMessage").text("");

    const visibleProducts = filteredProducts.slice(0, visibleProductsCount);

    visibleProducts.forEach(function (product) {
        const productCard = `
            <article class="product-card">
                <div class="product-image-wrapper">
                    <img src="${getImagePath(product.images.main)}" alt="${product.images.alt}" class="product-image">
                </div>

                <div class="product-content">
                    <p class="product-category">${product.category}</p>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-skin-type"><strong>Skin type:</strong> ${product.skinType}</p>
                    <p class="product-rating"><strong>Rating:</strong> ${product.rating}</p>

                    <div class="product-labels">
                        ${getLabelsHtml(product.labels)}
                    </div>

                    <div class="product-prices">
                        ${getPriceHtml(product)}
                    </div>

                    <p class="product-stock ${product.inStock ? "in-stock" : "out-of-stock"}">
                        ${product.inStock ? "In stock" : "Out of stock"}
                    </p>

                    <button class="product-btn add-to-cart-btn" data-id="${product.id}" ${!product.inStock ? "disabled" : ""}>
                        Add to cart
                    </button>
                </div>
            </article>
        `;

        productsContainer.append(productCard);
    });

    toggleLoadMoreButton(filteredProducts.length);
}

function toggleLoadMoreButton(totalProducts) {
    if (visibleProductsCount >= totalProducts) {
        $("#loadMoreBtn").hide();
    } else {
        $("#loadMoreBtn").show();
    }
}

function getLabelsHtml(labels) {
    let labelsHtml = "";

    labels.forEach(function (label) {
        labelsHtml += `<span class="product-label">${label}</span>`;
    });

    return labelsHtml;
}

function getPriceHtml(product) {
    return `
        <span class="old-price">${product.price.regular}${product.price.currency}</span>
        <span class="new-price">${product.price.discount}${product.price.currency}</span>
    `;
}



function loadCart() {
    const savedCart = localStorage.getItem(CART_KEY);

    if (savedCart) {
        try {
            cartData = JSON.parse(savedCart);
        } catch (error) {
            cartData = [];
        }
    }

    updateCartCount();
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cartData));
    updateCartCount();
}

function updateCartCount() {
    const cartCountElement = document.getElementById("cartCount");

    if (!cartCountElement) {
        return;
    }

    let totalQuantity = 0;

    cartData.forEach(function (cartItem) {
        totalQuantity += cartItem.quantity;
    });

    cartCountElement.textContent = totalQuantity;
}

function addToCart(productId) {
    const existingCartItem = cartData.find(function (cartItem) {
        return cartItem.id === productId;
    });

    const selectedProduct = productsData.find(function (product) {
        return product.id === productId;
    });

    if (existingCartItem) {
        existingCartItem.quantity += 1;
    } else {
        if (!selectedProduct) {
            return;
        }

        cartData.push({
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price.discount,
            currency: selectedProduct.price.currency,
            image: selectedProduct.images.main,
            alt: selectedProduct.images.alt,
            skinType: selectedProduct.skinType,
            quantity: 1
        });
    }

    saveCart();

    if (selectedProduct) {
        showToast(`${selectedProduct.name} added to cart`);
    } else {
        showToast("Product added to cart");
    }
}

function renderCartPage() {
    const cartContainer = $("#cartContainer");
    const cartMessage = $("#cartMessage");
    const cartSummary = $("#cartSummary");

    if (!cartContainer.length) {
        return;
    }

    cartContainer.empty();
    cartSummary.empty();

    if (cartData.length === 0) {
        cartMessage.text("Your cart is currently empty.");
        return;
    }

    cartMessage.text("");

    cartData.forEach(function (cartItem) {
        const cartItemHtml = `
            <article class="cart-item">
                <img src="${getImagePath(cartItem.image)}" alt="${cartItem.alt}" class="cart-item-image">

                <div class="cart-item-info">
                    <h3 class="cart-item-title">${cartItem.name}</h3>
                    <p><strong>Skin type:</strong> ${cartItem.skinType}</p>
                    <p><strong>Price:</strong> ${cartItem.price}${cartItem.currency}</p>
                </div>

                <div class="cart-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease-btn" data-id="${cartItem.id}">-</button>
                        <span class="quantity-value">${cartItem.quantity}</span>
                        <button class="quantity-btn increase-btn" data-id="${cartItem.id}">+</button>
                    </div>

                    <button class="remove-btn" data-id="${cartItem.id}">Remove</button>
                </div>
            </article>
        `;

        cartContainer.append(cartItemHtml);
    });

    renderCartSummary();
}

function renderCartSummary() {
    const cartSummary = $("#cartSummary");

    if (!cartSummary.length || cartData.length === 0) {
        return;
    }

    let totalPrice = 0;

    cartData.forEach(function (cartItem) {
        totalPrice += cartItem.price * cartItem.quantity;
    });

    const currency = cartData[0]?.currency || "$";

    cartSummary.html(`
        <p class="cart-total">Total: ${totalPrice.toFixed(2)}${currency}</p>
    `);
}

function increaseQuantity(productId) {
    cartData.forEach(function (cartItem) {
        if (cartItem.id === productId) {
            cartItem.quantity += 1;
        }
    });

    saveCart();
    renderCartPage();
}

function decreaseQuantity(productId) {
    cartData.forEach(function (cartItem) {
        if (cartItem.id === productId && cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        }
    });

    saveCart();
    renderCartPage();
}

function removeFromCart(productId) {
    cartData = cartData.filter(function (cartItem) {
        return cartItem.id !== productId;
    });

    saveCart();
    renderCartPage();
}

function showToast(message) {
    const toastElement = document.getElementById("toastMessage");

    if (!toastElement) {
        return;
    }

    toastElement.textContent = message;
    toastElement.classList.add("show");

    setTimeout(function () {
        toastElement.classList.remove("show");
    }, 2000);
}



function renderSpecials() {
    const specialsContainer = document.getElementById("specials");
    if (!specialsContainer) return;

    loadDataFromJson(
        getAssetPath("assets/data/specials.json"),
        function (data) {
            specialsData = data;
            buildSpecials(specialsContainer);
        },
        function (xhr) {
            console.log("Specials cannot be loaded.");
            console.log(xhr);
        }
    );
}

function buildSpecials(specialsContainer) {
    specialsContainer.innerHTML = "";

    specialsData.forEach(function (specialItem) {
        const card = document.createElement("div");
        card.className = "card";

        const iconWrapper = document.createElement("div");
        iconWrapper.className = "card-icon";

        const icon = document.createElement("i");
        icon.className = specialItem.iconClass;

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const title = document.createElement("h4");
        title.className = "card-title";
        title.textContent = specialItem.title;

        iconWrapper.appendChild(icon);
        cardBody.appendChild(title);
        card.appendChild(iconWrapper);
        card.appendChild(cardBody);

        specialsContainer.appendChild(card);
    });
}



function renderComments() {
    const commentsContainer = document.getElementById("comments");
    if (!commentsContainer) return;

    loadDataFromJson(
        getAssetPath("assets/data/comments.json"),
        function (data) {
            commentsData = data;
            buildComments(commentsContainer);
            initializeCommentsSlider();
        },
        function (xhr) {
            console.log("Comments cannot be loaded.");
            console.log(xhr);
        }
    );
}

function buildComments(commentsContainer) {
    commentsContainer.innerHTML = "";

    commentsData.forEach(function (commentItem) {
        const card = document.createElement("div");
        card.className = "card";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const text = document.createElement("p");
        text.className = "card-text";
        text.textContent = commentItem.text;

        const author = document.createElement("h5");
        author.className = "card-title";
        author.textContent = commentItem.author;

        cardBody.appendChild(text);
        cardBody.appendChild(author);
        card.appendChild(cardBody);

        commentsContainer.appendChild(card);
    });
}

function initializeCommentsSlider() {
    const commentsRoot = $("#comments");
    if (!commentsRoot.length) return;

    let currentSlideIndex = 0;
    let autoTimer = null;
    let cardsPerSlide = getCardsPerSlide();
    let slides = [];

    function getCardsPerSlide() {
        return window.matchMedia("(max-width: 900px)").matches ? 1 : 3;
    }

    function stopAutoSlide() {
        if (autoTimer) {
            clearInterval(autoTimer);
        }

        autoTimer = null;
    }

    function showSlide(index) {
        $(".comment-slide").hide();

        if (slides[index]) {
            slides[index].css("display", "grid").show();
        }
    }

    function startAutoSlide() {
        stopAutoSlide();

        if (slides.length <= 1) {
            return;
        }

        autoTimer = setInterval(function () {
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            showSlide(currentSlideIndex);
        }, 5000);
    }

    function buildSlides() {
        const cards = commentsRoot.children(".card").clone();

        commentsRoot.empty();
        slides = [];

        for (let i = 0; i < cards.length; i += cardsPerSlide) {
            const slide = $('<div class="comment-slide"></div>');
            cards.slice(i, i + cardsPerSlide).appendTo(slide);
            commentsRoot.append(slide);
            slides.push(slide);
        }

        if (currentSlideIndex >= slides.length) {
            currentSlideIndex = 0;
        }

        showSlide(currentSlideIndex);
        startAutoSlide();
    }

    $("#nextComment").off("click").on("click", function () {
        if (slides.length <= 1) {
            return;
        }

        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
    });

    $("#prevComment").off("click").on("click", function () {
        if (slides.length <= 1) {
            return;
        }

        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        showSlide(currentSlideIndex);
    });

    $(window).off("resize.commentsSlider").on("resize.commentsSlider", function () {
        const newCardsPerSlide = getCardsPerSlide();

        if (newCardsPerSlide !== cardsPerSlide) {
            cardsPerSlide = newCardsPerSlide;
            buildSlides();
        }
    });

    buildSlides();
}



function initCountdown() {
    const daysElement = document.getElementById("cd-days");
    const hoursElement = document.getElementById("cd-hours");
    const minutesElement = document.getElementById("cd-minutes");
    const secondsElement = document.getElementById("cd-seconds");
    const messageElement = document.getElementById("cd-message");

    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        return;
    }

    const launchDate = new Date("2026-04-20T00:00:00");

    function pad(value) {
        return String(value).padStart(2, "0");
    }

    function updateCountdown() {
        const now = new Date();
        const difference = launchDate - now;

        if (difference <= 0) {
            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";

            if (messageElement) {
                messageElement.textContent = "We are live! Final sale starts now.";
            }

            clearInterval(countdownTimer);
            return;
        }

        const totalSeconds = Math.floor(difference / 1000);
        const days = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        daysElement.textContent = String(days);
        hoursElement.textContent = pad(hours);
        minutesElement.textContent = pad(minutes);
        secondsElement.textContent = pad(seconds);

        if (messageElement) {
            messageElement.textContent = "";
        }
    }

    updateCountdown();
    const countdownTimer = setInterval(updateCountdown, 1000);
}



function initForm() {
    const form = document.getElementById("signInForm");
    if (!form) return;

    populateCities();
    populateSkinTypes();

    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const citySelect = document.getElementById("city");
    const termsCheckbox = document.getElementById("terms");
    const messageBox = document.getElementById("formMessage");

    const nameRegex = /^[A-ZČĆŽŠĐ][a-zčćžšđ]{1,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d).{8,}$/;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let isValid = true;
        clearFormErrors();

        if (messageBox) {
            messageBox.textContent = "";
        }

        if (!nameRegex.test(firstNameInput.value.trim())) {
            showFormError(firstNameInput, "First name must start with a capital letter and have at least 2 characters.");
            isValid = false;
        }

        if (!nameRegex.test(lastNameInput.value.trim())) {
            showFormError(lastNameInput, "Last name must start with a capital letter and have at least 2 characters.");
            isValid = false;
        }

        if (!emailRegex.test(emailInput.value.trim())) {
            showFormError(emailInput, "Enter a valid email address.");
            isValid = false;
        }

        if (!passwordRegex.test(passwordInput.value)) {
            showFormError(passwordInput, "Password must be at least 8 characters and contain at least one number.");
            isValid = false;
        }

        if (!citySelect.value) {
            showFormError(citySelect, "Please choose a city.");
            isValid = false;
        }

        const selectedSkinType = document.querySelector('input[name="skinType"]:checked');
        if (!selectedSkinType) {
            const radioGroup = document.querySelector(".radio-group");

            if (radioGroup) {
                radioGroup.classList.add("has-error");

                const radioError = radioGroup.querySelector("small.error");
                if (radioError) {
                    radioError.textContent = "Please select your skin type.";
                }
            }

            isValid = false;
        }

        if (!termsCheckbox.checked) {
            showFormError(termsCheckbox, "You must accept the terms.");
            isValid = false;
        }

        if (isValid) {
            showFormSuccess(messageBox);
            form.reset();
        }
    });

    function populateCities() {
        const cities = ["Beograd", "Novi Sad", "Niš", "Kragujevac", "Subotica"];
        const citySelectElement = document.getElementById("city");

        if (!citySelectElement) {
            return;
        }

        citySelectElement.innerHTML = "";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Choose a city";
        citySelectElement.appendChild(defaultOption);

        cities.forEach(function (cityName) {
            const option = document.createElement("option");
            option.value = cityName;
            option.textContent = cityName;
            citySelectElement.appendChild(option);
        });
    }

    function populateSkinTypes() {
        const skinTypes = ["Normal", "Dry", "Oily", "Sensitive"];
        const skinTypeOptionsContainer = document.getElementById("skinTypeOptions");

        if (!skinTypeOptionsContainer) {
            return;
        }

        skinTypeOptionsContainer.innerHTML = "";

        skinTypes.forEach(function (skinType) {
            const label = document.createElement("label");

            const radioInput = document.createElement("input");
            radioInput.type = "radio";
            radioInput.name = "skinType";
            radioInput.value = skinType;

            label.appendChild(radioInput);
            label.append(" " + skinType);

            skinTypeOptionsContainer.appendChild(label);
        });
    }

    function showFormError(inputElement, message) {
        const formGroup = inputElement.closest(".form-group");
        if (!formGroup) {
            return;
        }

        const errorElement = formGroup.querySelector("small.error");
        if (errorElement) {
            errorElement.textContent = message;
        }

        formGroup.classList.add("has-error");
    }

    function clearFormErrors() {
        document.querySelectorAll("small.error").forEach(function (errorElement) {
            errorElement.textContent = "";
        });

        document.querySelectorAll(".form-group").forEach(function (formGroup) {
            formGroup.classList.remove("has-error");
        });

        const radioGroup = document.querySelector(".radio-group");
        if (radioGroup) {
            radioGroup.classList.remove("has-error");
        }
    }

    function showFormSuccess(messageElement) {
        if (!messageElement) {
            return;
        }

        messageElement.textContent = "Form successfully submitted!";
        messageElement.style.color = "#0f0";

        setTimeout(function () {
            messageElement.textContent = "";
        }, 3000);
    }
}
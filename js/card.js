//////////////////////////////////////////////////////////////////////////////
let userInfo = document.querySelector("#user_info");
let userD = document.querySelector("#user");
let links = document.querySelector("#links");

if (localStorage.getItem("first_name")) {
    links.remove();
    userInfo.style.display = "flex";
    userInfo.style.justifyContent = "space-around";
    userD.innerHTML = "Hello , " + localStorage.getItem("first_name") + " " + localStorage.getItem("last_name");
}

let logoutBtn = document.querySelector("#logout");
logoutBtn.addEventListener("click", function () {
    localStorage.clear();
    setTimeout(() => window.location = "index.html", 1000);
});

// //////////////////////////////////////////////////
const productsInLocalStorageKey = "AddedProductItems";
const favoritesKey = "favoriteProducts";

////////////////////////////////////////////////////
let addItem = document.querySelector(".product-added");
let loved = document.querySelector(".loved");
let icon = document.querySelector(".shopping_cart i");
let card_div = document.querySelector(".carts_products");
let badge = document.querySelector(".badge");

// ensure dropdown container exists
let cartProductDiv = document.querySelector(".carts_products div");
if (!cartProductDiv) {
    cartProductDiv = document.createElement("div");
    card_div.appendChild(cartProductDiv);
}


let addedItems = JSON.parse(localStorage.getItem(productsInLocalStorageKey)) || [];
let favoriteItems = JSON.parse(localStorage.getItem(favoritesKey)) || [];

function ensureCartTotalDiv() {
    let totalDiv = document.getElementById("cart_total");
    
    if (!totalDiv) {
        totalDiv = document.createElement("div");
        totalDiv.id = "cart_total";
        if (addItem && addItem.parentNode) {
            addItem.parentNode.insertBefore(totalDiv, addItem.nextSibling);
        } else if (card_div) {
            card_div.appendChild(totalDiv);
        } else {
            document.body.appendChild(totalDiv);
        }
    }
    return totalDiv;
}

function toNumberSafe(value) {
    if (value === undefined || value === null) return 0;
    if (typeof value === "string") {
        value = value.replace(/[^\d.\-]/g, "");
    }
    let n = Number(value);
    return isNaN(n) ? 0 : n;
}

function updateCartTotal() {
    let totalDiv = ensureCartTotalDiv();

    let total = addedItems.reduce((sum, item) => {
        const price = toNumberSafe(item.price);
        const qty = toNumberSafe(item.qty);
        return sum + price * qty;
    }, 0);

    totalDiv.innerText = "Total Price: " + total + " $";
}

function findCartItem(id) {
    id = parseInt(id);
    return addedItems.find(item => item.id === id);
}

function updateBadge() {
    let total = addedItems.reduce((sum, item) => sum + item.qty, 0);
    badge.innerText = total;
}

function removeFromCart(id) {
    id = parseInt(id);
    addedItems = addedItems.filter(item => item.id !== id);

    localStorage.setItem(productsInLocalStorageKey, JSON.stringify(addedItems));
    drawCardProduct(addedItems);
    addToCartCount();
    updateBadge();
    updateCartTotal();
}

function changeQty(id, amount) {
    id = parseInt(id);
    let item = findCartItem(id);
    if (!item) return;

    item.qty += amount;
    if (item.qty <= 0) {
        addedItems = addedItems.filter(p => p.id !== id);
    }

    localStorage.setItem(productsInLocalStorageKey, JSON.stringify(addedItems));
    drawCardProduct(addedItems);
    addToCartCount();
    updateBadge();
    updateCartTotal();
}

function drawCardProduct(products) {
    if (products.length === 0) {
        updateCartTotal();
        return;
    }

    addItem.innerHTML = products.map(item => `
        <div class="product_container" data-id="${item.id}">
            <img class="product_img" src="${item.imageUrl}" alt="">
            <div class="product_item_info">
                <h2 class="name1">${item.title}</h2>
                <span class="category1">Category : ${item.category}</span>
                <p class="price">Price : ${item.price}</p>
                <div class="addition">
                    <div class="decrease" data-id="${item.id}">-</div>
                    <p class="item-count">${item.qty}</p>
                    <div class="increase" data-id="${item.id}">+</div>
                    <button class="remove_from_cart" data-id="${item.id}">Remove From Cart</button>
                </div>    
            </div>            
        </div>
    `).join("");

    addItem.querySelectorAll(".increase").forEach(btn =>
        btn.addEventListener("click", () => changeQty(btn.dataset.id, 1))
    );

    addItem.querySelectorAll(".decrease").forEach(btn =>
        btn.addEventListener("click", () => changeQty(btn.dataset.id, -1))
    );

    addItem.querySelectorAll(".remove_from_cart").forEach(btn =>
        btn.addEventListener("click", () => removeFromCart(btn.dataset.id))
    );

    updateCartTotal();
}
function drawFavoriteProduct(products) {
    if (products.length === 0) {
        return;
    }

    loved.innerHTML = products.map(item => `
        <div class="product_item" data-id="${item.id}">
            <img class="product_item_img" src="${item.imageUrl}" alt="">
            <div class="product_item_desc">
                <h2 class="name">${item.title}</h2>
                <span class="category">Category : ${item.category}</span>
            </div>
            <div class="product_item_action">
                <i class="fa-solid fa-heart heart" style="color:red;"></i>               
            </div>
        </div>
    `).join("");

    enableFavoriteRemoval();
}

function enableFavoriteRemoval() {
    loved.querySelectorAll(".heart").forEach(heart => {
        heart.addEventListener("click", function () {
            let parent = this.closest(".product_item");
            let id = parseInt(parent.dataset.id);

            favoriteItems = favoriteItems.filter(item => item.id !== id);
            localStorage.setItem(favoritesKey, JSON.stringify(favoriteItems));

            drawFavoriteProduct(favoriteItems);
        });
    });
}

function addToCartCount() {
    if (addedItems.length === 0) {
        updateCartTotal();
        return;
    }

    cartProductDiv.innerHTML = addedItems.map(product => `
        <div class="item_info" data-id="${product.id}">
            <div class="item_info_content">
                <h3>${product.title}</h3>
                <div class="increment">
                    <div class="decrease" data-id="${product.id}">-</div>
                    <p class="item-count">${product.qty}</p>
                    <div class="increase" data-id="${product.id}">+</div>
                </div>
            </div>
            <p>Price: ${product.price}</p>
        </div>
    `).join("");

    cartProductDiv.querySelectorAll(".increase").forEach(btn =>
        btn.addEventListener("click", () => changeQty(btn.dataset.id, 1))
    );

    cartProductDiv.querySelectorAll(".decrease").forEach(btn =>
        btn.addEventListener("click", () => changeQty(btn.dataset.id, -1))
    );

    updateCartTotal();
}

icon.addEventListener("click", function () {
    card_div.style.display = card_div.style.display === "block" ? "none" : "block";
    if (card_div.style.display === "block") addToCartCount();
});

updateBadge();
addToCartCount();
drawCardProduct(addedItems);
drawFavoriteProduct(favoriteItems);
updateCartTotal();

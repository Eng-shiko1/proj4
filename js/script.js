let userInfo = document.querySelector("#user_info")
let userD = document.querySelector("#user")
let links = document.querySelector("#links")

if (localStorage.getItem("first_name")) {
    links.remove()
    userInfo.style.display = "flex"
    userInfo.style.justifyContent = "space-around"
    userD.innerHTML = "Hello , " + localStorage.getItem("first_name") + " " + localStorage.getItem("last_name")
}

// logout
let logoutBtn = document.querySelector("#logout")
logoutBtn.addEventListener("click", function () {
    localStorage.clear()
    setTimeout(() => {
        window.location = "index.html"
    }, 1000)
})

// //////////////////////////////////////add product item to page///////////////////////
let allProducts = document.querySelector(".products")
let products = [
   {
        id:1,
        title: "Silver Set Ring",
        price: "$250",
        category: "Rings",
        imageUrl : "image/img9.webp"
    },
    {
        id:2,
        title: "Silver Necklace",
        price: "$150",
        category: "Necklaces",
        imageUrl : "image/img1.jpeg"
    },
    {
        id:3,
        title: "Golden Necklace",
        price: "$350",
        category: "Necklaces",
        imageUrl : "image/img2.webp"
    },
    {
        id:4,
        title: "Golden Bracelet",
        price: "$400",
        category: "Bracelets",
        imageUrl : "image/img3.jpg"
    },
    {
        id:5,
        title: "Silver Watch",
        price: "$500",
        category: "Watches",
        imageUrl : "image/img4.jpg"
    },
    {
        id:6,
        title: "Black Glass",
        price: "$250",
        category: "Glasses",
        imageUrl : "image/img5.jpg"
    },
    {
        id:7,
        title: "Black Watch",
        price: "$450",
        category: "Watches",
        imageUrl : "image/img6.jpg"
    },
    {
        id:8,
        title: "Diamond Earrings",
        price: "$250",
        category: "Earrings",
        imageUrl : "image/img7.webp"
    },
    {
        id:9,
        title: "Silver Necklace",
        price: "$250",
        category: "Necklaces",
        imageUrl : "image/imag8.jpg"
    }
]

function add_item() {
    let product_item = products.map((item) => {
        // FIX: Added data-id attribute to the product_item div
        return `
        <div class="product_item " data-id="${item.id}"> 
            <img class="product_item_img" src="${item.imageUrl}" alt="">
            <div class="product_item_desc">
                <h2 class="name">${item.title}</h2>
                <p>Price : ${item.price}</p>
                <span class="category">Category : ${item.category}</span>
            </div>
            <div class="product_item_action">
                <i class="fa-solid fa-heart heart"></i>
                <button class="add_to_cart">Add To Cart</button>
                <button class="remove_from_cart" style="display:none;">Remove From Cart</button>
            </div>
        </div>`;
    });
    allProducts.innerHTML = product_item.join("");
}
add_item()

// //////////////////////filtering products////////////////////////////
let searchInput = document.querySelector("#search_input");
let searchBy = document.querySelector("#search_by");

searchInput.addEventListener("keyup", () => {
    let filterValue = searchInput.value.toLowerCase();
    let type = searchBy.value;
    let productItems = document.querySelectorAll(".product_item");

    productItems.forEach(product => {
        let name = product.querySelector(".name").textContent.toLowerCase();
        let category = product.querySelector(".category").textContent.toLowerCase();

        let isContain =
            (type === "name" && name.includes(filterValue)) ||
            (type === "category" && category.includes(filterValue));

        // Use 'flex' for visibility if product items are display:flex, otherwise 'block'
        product.style.display = isContain ? "block" : "none";
    });
});

// ///////////////////add to cart\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
let icon = document.querySelector(".shopping_cart i")
let card_div = document.querySelector(".carts_products")
let cartProductDiv = document.querySelector(".carts_products div")
let badge = document.querySelector(".badge")

const productsInLocalStorageKey = "AddedProductItems";
let addedItems = JSON.parse(localStorage.getItem(productsInLocalStorageKey)) || [];

// helpers
function findCartItem(id) {
    id = parseInt(id);
    return addedItems.find(item => item.id === id);
}

function updateBadge() {
    let total = addedItems.reduce((sum, item) => sum + item.qty, 0);
    badge.innerText = total;
}

function addToCart(id) {
    id = parseInt(id);

    if (!localStorage.getItem("first_name")) {
        window.location = "login.html";
        return;
    }

    let existing = findCartItem(id);

    if (existing) {
        existing.qty += 1;
    } else {
        let product = products.find(p => p.id === id);
        if (product) {
            addedItems.push({
                ...product,
                qty: 1
            });
        }
    }

    localStorage.setItem(productsInLocalStorageKey, JSON.stringify(addedItems));
    updateBadge();
    addToCartCount();
    updateProductButtons();
}

function removeFromCart(id) {
    id = parseInt(id);
    addedItems = addedItems.filter(item => item.id !== id);

    localStorage.setItem(productsInLocalStorageKey, JSON.stringify(addedItems));
    updateBadge();
    addToCartCount();
    updateProductButtons();
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
    updateBadge();
    addToCartCount();
    updateProductButtons();
}

function addToCartCount() {
    if (addedItems.length === 0) {
        cartProductDiv.innerHTML = "No items in cart";
        return;
    }

    let cartContent = "";

    addedItems.forEach(product => {
        cartContent += `
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
        `;
    });

    cartProductDiv.innerHTML = cartContent;

    // Attach listeners to the dynamically created increase/decrease buttons in the dropdown
    cartProductDiv.querySelectorAll(".increase").forEach(btn => {
        btn.addEventListener("click", () => changeQty(btn.dataset.id, 1));
    });

    cartProductDiv.querySelectorAll(".decrease").forEach(btn => {
        btn.addEventListener("click", () => changeQty(btn.dataset.id, -1));
    });
}

icon.addEventListener("click", function () {
    if(card_div.style.display === "block"){
        card_div.style.display = "none"
    }else{
        card_div.style.display = "block"
        // Ensure dropdown quantity buttons are active when shown
        addToCartCount(); 
    }
});


// ////////////////////////////////////////////////////////////////
function updateProductButtons() {
    let productItems = document.querySelectorAll(".product_item");

    productItems.forEach(item => {
        let id = item.dataset.id;

        let addBtn = item.querySelector(".add_to_cart");
        let removeBtn = item.querySelector(".remove_from_cart");
        
        // Safety check: ensure buttons exist before adding listeners
        if (!addBtn || !removeBtn) return; 

        let inCart = findCartItem(parseInt(id));

        if (inCart) {
            addBtn.style.display = "none";
            removeBtn.style.display = "block";
        } else {
            addBtn.style.display = "block";
            removeBtn.style.display = "none";
        }

        // Add/update event listeners
        addBtn.onclick = () => addToCart(id);
        removeBtn.onclick = () => removeFromCart(id);
    });
}


// ////////////////////////////////////////////////////////////////
const favoritesKey = "favoriteProducts";
let favoriteItems = JSON.parse(localStorage.getItem(favoritesKey)) || [];
// Select all hearts after products are added
let hearts = document.querySelectorAll(".heart"); 

function isFavorite(id) {
    id = parseInt(id);
    return favoriteItems.some(item => item.id === id);
}

function updateHeartColors() {
    // Re-select hearts after a potential re-render, though add_item is only called once here
    let currentHearts = document.querySelectorAll(".heart");

    currentHearts.forEach(heart => {
        // Use the data-id from the parent element
        let parentItem = heart.closest(".product_item");
        if (!parentItem) return;
        let id = parseInt(parentItem.dataset.id);
        
        heart.style.color = isFavorite(id) ? "red" : "black";
    });
}

function toggleFavorite(id) {
    id = parseInt(id);

    if (!localStorage.getItem("first_name")) {
        window.location = "login.html";
        return;
    }

    if (isFavorite(id)) {
        favoriteItems = favoriteItems.filter(item => item.id !== id);
    } else {
        let product = products.find(p => p.id === id);
        if (product) favoriteItems.push(product);
    }

    localStorage.setItem(favoritesKey, JSON.stringify(favoriteItems));
    updateHeartColors();
}

function enableHeartActions() {
    // Re-select hearts after products are added
    let currentHearts = document.querySelectorAll(".heart");

    currentHearts.forEach(heart => {
        // Only add listener if it hasn't been added (or ensure previous listeners are removed/replaced)
        // Since we call this once at the end, adding a simple click listener is fine.
        heart.addEventListener("click", function () {
            let id = heart.closest(".product_item").dataset.id;
            toggleFavorite(id);
        });
    });
}


// ////////////////////////////////////////////////////////////////
// Initial setup on page load
updateBadge();
addToCartCount();
updateProductButtons();
updateHeartColors();
enableHeartActions();
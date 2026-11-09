
// ==========================================
// 1. PRODUCT DATABASE
// ==========================================

const products = [
    // COMPUTER ACCESSORIES
    {
        id: 1,
        name: "Gaming Keyboard",
        category: "Computer",
        price: 4500,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600",
        description: "RGB mechanical gaming keyboard."
    },
    {
        id: 2,
        name: "Wireless Mouse",
        category: "Computer",
        price: 1800,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600",
        description: "Comfortable wireless computer mouse."
    },
    {
        id: 3,
        name: "Gaming Headphones",
        category: "Computer",
        price: 5500,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        description: "High-quality sound gaming headphones."
    },
    {
        id: 4,
        name: "Computer Monitor",
        category: "Computer",
        price: 28000,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600",
        description: "Modern HD computer monitor."
    },
    {
        id: 5,
        name: "USB Flash Drive",
        category: "Computer",
        price: 1200,
        image: "https://images.unsplash.com/photo-1618410320928-25228d811631?w=600",
        description: "Portable USB storage device."
    },
    {
        id: 6,
        name: "Laptop Stand",
        category: "Computer",
        price: 2500,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
        description: "Adjustable laptop stand."
    },

    // MOBILE ACCESSORIES
    {
        id: 7,
        name: "Fast Mobile Charger",
        category: "Mobile",
        price: 2200,
        image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600",
        description: "Fast charging mobile adapter."
    },
    {
        id: 8,
        name: "Wireless Earbuds",
        category: "Mobile",
        price: 3500,
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600",
        description: "Wireless earbuds with clear sound."
    },
    {
        id: 9,
        name: "Mobile Cover",
        category: "Mobile",
        price: 800,
        image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=600",
        description: "Stylish protective phone cover."
    },
    {
        id: 10,
        name: "Power Bank",
        category: "Mobile",
        price: 4000,
        image: "https://images.unsplash.com/photo-1609592806596-b43bada2f5c5?w=600",
        description: "Portable power bank for your phone."
    },
    {
        id: 11,
        name: "USB Type-C Cable",
        category: "Mobile",
        price: 700,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
        description: "Durable fast charging cable."
    },
    {
        id: 12,
        name: "Mobile Holder",
        category: "Mobile",
        price: 1000,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600",
        description: "Adjustable mobile phone holder."
    }
];


// ==========================================
// 2. CART AND ORDER VARIABLES
// ==========================================

let cart = JSON.parse(
    localStorage.getItem("techZoneCart")
) || [];

let orders = JSON.parse(
    localStorage.getItem("techZoneOrders")
) || [];

let currentCategory = "All";


// ==========================================
// 3. HELPER FUNCTIONS
// ==========================================

function formatPrice(price) {
    return "Rs. " + price.toLocaleString("en-PK");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function saveCart() {
    localStorage.setItem(
        "techZoneCart",
        JSON.stringify(cart)
    );
}

function saveOrders() {
    localStorage.setItem(
        "techZoneOrders",
        JSON.stringify(orders)
    );
}


// ==========================================
// 4. DISPLAY PRODUCTS
// ==========================================

function displayProducts(list) {

    const productGrid = document.getElementById("productGrid");

    productGrid.innerHTML = "";

    if (list.length === 0) {
        productGrid.innerHTML =
            '<p class="no-products">No products found!</p>';
        return;
    }

    list.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}"
                 alt="${escapeHTML(product.name)}"
                 loading="lazy">

            <div class="product-info">

                <span class="product-category">
                    ${product.category} Accessories
                </span>

                <h3>${escapeHTML(product.name)}</h3>

                <p class="product-description">
                    ${escapeHTML(product.description)}
                </p>

                <div class="product-price">
                    ${formatPrice(product.price)}
                </div>

                <button class="add-btn"
                    onclick="addToCart(${product.id})">
                    + Add to Cart
                </button>

            </div>
        `;

        productGrid.appendChild(card);
    });
}


// ==========================================
// 5. FILTER PRODUCTS
// ==========================================

function filterProducts(category) {

    currentCategory = category;

    document.getElementById("categoryFilter").value = category;

    applyFilters();

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}


// ==========================================
// 6. SEARCH AND SORT PRODUCTS
// ==========================================

function applyFilters() {

    const searchText = document
        .getElementById("searchInput")
        .value.toLowerCase()
        .trim();

    const category = document.getElementById("categoryFilter").value;

    const sort = document.getElementById("sortFilter").value;

    currentCategory = category;

    let filtered = products.filter(product => {

        const matchesName =
            product.name.toLowerCase().includes(searchText);

        const matchesDescription =
            product.description.toLowerCase().includes(searchText);

        const matchesCategory =
            category === "All" || product.category === category;

        return (matchesName || matchesDescription) && matchesCategory;
    });

    if (sort === "low") {
        filtered.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    displayProducts(filtered);
}

document.getElementById("searchInput").addEventListener(
    "input",
    applyFilters
);


// ==========================================
// 7. ADD PRODUCT TO CART
// ==========================================

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    const existing = cart.find(
        item => item.id === productId
    );

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();

    updateCartCount();

    alert(product.name + " added to your cart!");
}


// ==========================================
// 8. UPDATE CART COUNT
// ==========================================

function updateCartCount() {

    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    document.getElementById("cartCount").textContent = count;
}


// ==========================================
// 9. CALCULATE CART TOTAL
// ==========================================

function calculateTotal() {

    return cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
}


// ==========================================
// 10. DISPLAY CART
// ==========================================

function renderCart() {

    const cartItems = document.getElementById("cartItems");

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your shopping cart is empty!</p>";

    } else {

        cart.forEach(item => {

            const div = document.createElement("div");

            div.className = "cart-item";

            div.innerHTML = `
                <img src="${item.image}" alt="${escapeHTML(item.name)}">

                <div class="cart-item-info">

                    <h4>${escapeHTML(item.name)}</h4>

                    <p>${formatPrice(item.price * item.quantity)}</p>

                    <div class="quantity-controls">

                        <button onclick="changeQuantity(${item.id}, -1)">
                            -
                        </button>

                        <span>${item.quantity}</span>

                        <button onclick="changeQuantity(${item.id}, 1)">
                            +
                        </button>

                        <button class="remove-btn"
                            onclick="removeFromCart(${item.id})">
                            Remove
                        </button>

                    </div>
                </div>
            `;

            cartItems.appendChild(div);
        });
    }

    document.getElementById("cartTotal").textContent =
        formatPrice(calculateTotal());

    updateCartCount();
}


// ==========================================
// 11. OPEN AND CLOSE CART
// ==========================================

function openCart() {

    renderCart();

    document.getElementById("cartModal").style.display = "flex";
}

function closeCart() {

    document.getElementById("cartModal").style.display = "none";
}


// ==========================================
// 12. CHANGE PRODUCT QUANTITY
// ==========================================

function changeQuantity(productId, change) {

    const item = cart.find(
        product => product.id === productId
    );

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(
            product => product.id !== productId
        );
    }

    saveCart();

    renderCart();
}


// ==========================================
// 13. REMOVE PRODUCT FROM CART
// ==========================================

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();

    renderCart();
}


// ==========================================
// 14. OPEN CHECKOUT
// ==========================================

function goToCheckout() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    closeCart();

    const summary = document.getElementById("checkoutSummary");

    summary.innerHTML = `
        <strong>Order Summary</strong><br>
        Total Products: ${cart.reduce(
            (sum, item) => sum + item.quantity, 0
        )}<br>
        Total Amount: <strong>${formatPrice(calculateTotal())}</strong>
    `;

    document.getElementById("checkoutModal").style.display = "flex";
}

function closeCheckout() {

    document.getElementById("checkoutModal").style.display = "none";
}


// ==========================================
// 15. PLACE ORDER
// ==========================================

document.getElementById("checkoutForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            closeCheckout();
            return;
        }

        const customer = {
            name: document.getElementById("customerName").value.trim(),
            email: document.getElementById("customerEmail").value.trim(),
            phone: document.getElementById("customerPhone").value.trim(),
            address: document.getElementById("customerAddress").value.trim(),
            city: document.getElementById("customerCity").value,
            payment: document.getElementById("paymentMethod").value
        };

        const order = {

            id: "TZ" + Date.now(),

            customer: customer,

            items: cart.map(item => ({ ...item })),

            total: calculateTotal(),

            date: new Date().toLocaleString(),

            status: "Order Placed"
        };

        orders.push(order);

        saveOrders();

        cart = [];

        saveCart();

        updateCartCount();

        this.reset();

        closeCheckout();

        alert(
            "Your order has been placed successfully!\n\n" +
            "Order ID: " + order.id +
            "\nTotal: " + formatPrice(order.total) +
            "\nPayment: " + order.customer.payment
        );
    }
);


// ==========================================
// 16. DISPLAY ORDER HISTORY
// ==========================================

function showOrders() {

    const ordersList = document.getElementById("ordersList");

    ordersList.innerHTML = "";

    if (orders.length === 0) {

        ordersList.innerHTML =
            "<p>You have not placed any orders yet.</p>";

    } else {

        [...orders].reverse().forEach(order => {

            const div = document.createElement("div");

            div.className = "order-card";

            const itemNames = order.items.map(item =>
                `${escapeHTML(item.name)} x ${item.quantity}`
            ).join("<br>");

            const isCancelled = order.status === "Cancelled";

            div.innerHTML = `
                <h3>Order #${escapeHTML(order.id)}</h3>

                <p><strong>Customer:</strong>
                    ${escapeHTML(order.customer.name)}</p>

                <p><strong>Phone:</strong>
                    ${escapeHTML(order.customer.phone)}</p>

                <p><strong>City:</strong>
                    ${escapeHTML(order.customer.city)}</p>

                <p><strong>Products:</strong><br>
                    ${itemNames}</p>

                <p><strong>Total:</strong>
                    ${formatPrice(order.total)}</p>

                <p><strong>Payment:</strong>
                    ${escapeHTML(order.customer.payment)}</p>

                <p><strong>Date:</strong>
                    ${escapeHTML(order.date)}</p>

                <p><strong>Status:</strong>
                    <span class="order-status ${isCancelled ? "cancelled" : ""}">
                        ${escapeHTML(order.status)}
                    </span>
                </p>

                ${!isCancelled ? `
                    <button class="cancel-order-btn"
                        onclick="cancelOrder('${order.id}')">
                        Cancel Order
                    </button>
                ` : ""}
            `;

            ordersList.appendChild(div);
        });
    }

    document.getElementById("ordersModal").style.display = "flex";
}


// ==========================================
// 17. CLOSE ORDER HISTORY
// ==========================================

function closeOrders() {

    document.getElementById("ordersModal").style.display = "none";
}


// ==========================================
// 18. CANCEL ORDER
// ==========================================

function cancelOrder(orderId) {

    const confirmation = confirm(
        "Are you sure you want to cancel this order?"
    );

    if (!confirmation) return;

    const order = orders.find(
        item => item.id === orderId
    );

    if (!order) return;

    order.status = "Cancelled";

    saveOrders();

    showOrders();

    alert("Order cancelled successfully!");
}


// ==========================================
// 19. CLOSE MODALS ON OUTSIDE CLICK
// ==========================================

window.addEventListener("click", function(event) {

    const modals = [
        "cartModal",
        "checkoutModal",
        "ordersModal"
    ];

    modals.forEach(id => {

        const modal = document.getElementById(id);

        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});


// ==========================================
// 20. INITIALIZE WEBSITE
// ==========================================

displayProducts(products);

updateCartCount();

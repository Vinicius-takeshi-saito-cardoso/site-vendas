const products = [
  {
    id: 1,
    name: "Mouse Gamer Astra X9",
    category: "Mouse",
    price: 189.9,
    oldPrice: 249.9,
    rating: 4.9,
    stock: 18,
    tag: "Mais vendido",
    specs: ["16K DPI", "6 botoes", "RGB"],
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Teclado Mecânico Volt K87",
    category: "Teclado",
    price: 329.9,
    oldPrice: 399.9,
    rating: 4.8,
    stock: 11,
    tag: "Switch blue",
    specs: ["ABNT2", "Hot-swap", "TKL"],
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Headset Pulse 7.1",
    category: "Fone",
    price: 279.9,
    oldPrice: 349.9,
    rating: 4.7,
    stock: 9,
    tag: "Áudio imersivo",
    specs: ["7.1", "USB", "Mic removível"],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Monitor Orion 27 QHD",
    category: "Monitor",
    price: 1899.9,
    oldPrice: 2199.9,
    rating: 4.9,
    stock: 5,
    tag: "165Hz",
    specs: ["QHD", "1ms", "IPS"],
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Webcam Focus 2K",
    category: "Acessorio",
    price: 219.9,
    oldPrice: 279.9,
    rating: 4.6,
    stock: 14,
    tag: "Home office",
    specs: ["2K", "Auto foco", "Tripé"],
    image: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Mousepad XXL Spectrum",
    category: "Acessorio",
    price: 119.9,
    oldPrice: 159.9,
    rating: 4.5,
    stock: 22,
    tag: "Desk setup",
    specs: ["90x40cm", "Borda costurada", "Base grip"],
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 7,
    name: "Teclado Slim Flow",
    category: "Teclado",
    price: 249.9,
    oldPrice: 319.9,
    rating: 4.4,
    stock: 0,
    tag: "Wireless",
    specs: ["Bluetooth", "Low profile", "Bateria 30d"],
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 8,
    name: "Dock USB-C Atlas 8 em 1",
    category: "Acessorio",
    price: 399.9,
    oldPrice: 469.9,
    rating: 4.8,
    stock: 7,
    tag: "USB-C",
    specs: ["HDMI", "PD 100W", "Ethernet"],
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 9,
    name: "Fone Studio Nova ANC",
    category: "Fone",
    price: 699.9,
    oldPrice: 849.9,
    rating: 4.9,
    stock: 6,
    tag: "ANC",
    specs: ["Bluetooth", "40h", "USB-C"],
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80",
  },
];

const state = {
  query: "",
  category: "todos",
  sort: "featured",
  maxPrice: 2500,
  stockOnly: true,
  cart: new Map(),
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const categoryLabels = {
  Acessorio: "Acessório",
};

const getCategoryLabel = (category) => categoryLabels[category] || category;

const productGrid = document.querySelector("#productGrid");
const emptyState = document.querySelector("#emptyState");
const resultCount = document.querySelector("#resultCount");
const resultsTitle = document.querySelector("#resultsTitle");
const priceValue = document.querySelector("#priceValue");
const cartCount = document.querySelector("#cartCount");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const cartDrawer = document.querySelector(".cart-drawer");
const cartBackdrop = document.querySelector(".cart-backdrop");

const refreshIcons = () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
};

const formatPrice = (value) => currency.format(value);

const getFilteredProducts = () => {
  const query = state.query.trim().toLowerCase();
  let items = products.filter((product) => {
    const matchesQuery = [product.name, product.category, getCategoryLabel(product.category), ...product.specs]
      .join(" ")
      .toLowerCase()
      .includes(query);
    const matchesCategory = state.category === "todos" || product.category === state.category;
    const matchesPrice = product.price <= state.maxPrice;
    const matchesStock = !state.stockOnly || product.stock > 0;

    return matchesQuery && matchesCategory && matchesPrice && matchesStock;
  });

  if (state.sort === "price-asc") {
    items = [...items].sort((a, b) => a.price - b.price);
  }

  if (state.sort === "price-desc") {
    items = [...items].sort((a, b) => b.price - a.price);
  }

  if (state.sort === "rating") {
    items = [...items].sort((a, b) => b.rating - a.rating);
  }

  return items;
};

const renderProducts = () => {
  const filteredProducts = getFilteredProducts();
  productGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-media">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
            <span class="product-tag">${product.tag}</span>
          </div>
          <div class="product-info">
            <div class="product-meta">
              <span>${getCategoryLabel(product.category)}</span>
              <span class="rating">
                <i data-lucide="star"></i>
                ${product.rating.toFixed(1)}
              </span>
            </div>
            <h3>${product.name}</h3>
            <ul class="specs">
              ${product.specs.map((spec) => `<li>${spec}</li>`).join("")}
            </ul>
            <div class="price-row">
              <strong class="price">${formatPrice(product.price)}</strong>
              <span class="old-price">${formatPrice(product.oldPrice)}</span>
            </div>
          </div>
          <div class="product-actions">
            <button class="primary-button" type="button" data-add-cart="${product.id}" ${product.stock ? "" : "disabled"}>
              <i data-lucide="shopping-bag"></i>
              ${product.stock ? "Adicionar" : "Indisponível"}
            </button>
            <button class="icon-button" type="button" data-details="${product.id}" aria-label="Ver detalhes de ${product.name}">
              <i data-lucide="eye"></i>
            </button>
          </div>
        </article>
      `
    )
    .join("");

  emptyState.hidden = filteredProducts.length > 0;
  resultCount.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? "item" : "itens"}`;
  resultsTitle.textContent = state.category === "todos" ? "Produtos em destaque" : getCategoryLabel(state.category);
  refreshIcons();
};

const getCartProducts = () =>
  [...state.cart.entries()]
    .map(([id, quantity]) => {
      const product = products.find((item) => item.id === id);
      return product ? { ...product, quantity } : null;
    })
    .filter(Boolean);

const renderCart = () => {
  const items = getCartProducts();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatPrice(total);

  if (!items.length) {
    cartItems.innerHTML = `<p class="cart-empty">Seu carrinho está vazio.</p>`;
    refreshIcons();
    return;
  }

  cartItems.innerHTML = items
    .map(
      (item) => `
        <article class="cart-line">
          <img src="${item.image}" alt="${item.name}" loading="lazy" />
          <div>
            <h3>${item.name}</h3>
            <span>${formatPrice(item.price)}</span>
          </div>
          <div class="quantity" aria-label="Quantidade de ${item.name}">
            <button type="button" data-decrease="${item.id}" aria-label="Diminuir quantidade">
              <i data-lucide="minus"></i>
            </button>
            <strong>${item.quantity}</strong>
            <button type="button" data-increase="${item.id}" aria-label="Aumentar quantidade">
              <i data-lucide="plus"></i>
            </button>
          </div>
        </article>
      `
    )
    .join("");

  refreshIcons();
};

const addToCart = (id) => {
  const product = products.find((item) => item.id === id);
  if (!product || product.stock <= 0) return;

  const currentQuantity = state.cart.get(id) || 0;
  if (currentQuantity >= product.stock) return;

  state.cart.set(id, currentQuantity + 1);
  renderCart();
  openCart();
};

const changeQuantity = (id, amount) => {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  const nextQuantity = (state.cart.get(id) || 0) + amount;

  if (nextQuantity <= 0) {
    state.cart.delete(id);
  } else {
    state.cart.set(id, Math.min(nextQuantity, product.stock));
  }

  renderCart();
};

const openCart = () => {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartBackdrop.hidden = false;
};

const closeCart = () => {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartBackdrop.hidden = true;
};

document.querySelector("#searchInput").addEventListener("input", (event) => {
  state.query = event.target.value;
  renderProducts();
});

document.querySelector("#categorySelect").addEventListener("change", (event) => {
  state.category = event.target.value;
  renderProducts();
});

document.querySelector("#sortSelect").addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

document.querySelector("#priceRange").addEventListener("input", (event) => {
  state.maxPrice = Number(event.target.value);
  priceValue.textContent = formatPrice(state.maxPrice);
  renderProducts();
});

document.querySelector("#stockOnly").addEventListener("change", (event) => {
  state.stockOnly = event.target.checked;
  renderProducts();
});

document.querySelector(".cart-toggle").addEventListener("click", openCart);

document.querySelectorAll("[data-close-cart]").forEach((button) => {
  button.addEventListener("click", closeCart);
});

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-cart]");
  const detailButton = event.target.closest("[data-details]");
  const increaseButton = event.target.closest("[data-increase]");
  const decreaseButton = event.target.closest("[data-decrease]");

  if (addButton) {
    addToCart(Number(addButton.dataset.addCart));
  }

  if (detailButton) {
    const product = products.find((item) => item.id === Number(detailButton.dataset.details));
    if (product) {
      window.alert(`${product.name}\n${product.specs.join(" | ")}\n${formatPrice(product.price)}`);
    }
  }

  if (increaseButton) {
    changeQuantity(Number(increaseButton.dataset.increase), 1);
  }

  if (decreaseButton) {
    changeQuantity(Number(decreaseButton.dataset.decrease), -1);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
  }
});

priceValue.textContent = formatPrice(state.maxPrice);
renderProducts();
renderCart();

window.addEventListener("scroll", () => {
	const header = document.querySelector("header");

	if (!header) {
		return;
	}

	header.classList.toggle("scrolled", window.scrollY > 24);
});

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");

if (navToggle && siteNav) {
	navToggle.addEventListener("click", () => {
		const isOpen = document.body.classList.toggle("menu-open");
		navToggle.setAttribute("aria-expanded", String(isOpen));
	});

	siteNav.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", () => {
			document.body.classList.remove("menu-open");
			navToggle.setAttribute("aria-expanded", "false");
		});
	});
}

const params = new URLSearchParams(window.location.search);
const articleSelect = document.querySelector("#article-select");

if (articleSelect && params.has("article")) {
	const article = params.get("article");
	const optionMap = {
		"1": "Blanc Cendre - 49 €",
		"2": "Noir Obsidienne - 49 €",
		"3": "Bleu Électrique - 54 €",
	};

	articleSelect.value = optionMap[article] || articleSelect.value;
}

// Cart display on commander page
function renderCartContents() {
	const container = document.querySelector('#cart-contents');
	if (!container) return;
	const items = readCart();
	if (!items.length) {
		container.innerHTML = '<div class="cart-empty">Le panier est vide.</div>';
		return;
	}
	const rows = items.map((it, idx) => {
		return `
			<div class="cart-row">
				<div class="cart-info"><strong>${it.title}</strong><div class="cart-meta">${it.size ? 'Taille: '+it.size : ''}</div></div>
				<div class="cart-qty">${it.quantity}</div>
				<div class="cart-action"><button data-idx="${idx}" class="cart-remove">Supprimer</button></div>
			</div>`;
	}).join('');
	container.innerHTML = `<div class="cart-list">${rows}</div>`;
	container.querySelectorAll('.cart-remove').forEach(btn => {
		btn.addEventListener('click', (e) => {
			const idx = Number(btn.dataset.idx);
			const arr = readCart();
			arr.splice(idx, 1);
			writeCart(arr);
			renderCartContents();
		});
	});
}

// render on load if commander page
renderCartContents();

document.querySelectorAll("form[data-form='lead']").forEach((form) => {
	form.addEventListener("submit", (event) => {
		event.preventDefault();

		const formData = new FormData(form);
		const selectedArticle = formData.get("article") || "un article Vortex";

		window.alert(`Demande préparée pour ${selectedArticle}. Tu peux maintenant la relier à WhatsApp ou à un email.`);
	});
});

const articlePage = document.querySelector("#article-title");

if (articlePage) {
	const articleData = {
		"1": {
			title: "Blanc Cendre",
			kicker: "Équipement 1",
			price: "49,00 € EUR",
			image: "images/tshirt1.png",
			thumbs: [
				"images/tshirt1.1.png",
				"images/tshirt1.2.png",
				"images/tshirt1.3.png",
			],
			description: "Version claire et premium, idéale pour un rendu propre et très lisible.",
			features: "Coupe ajustée, textile respirant, impression nette et entretien simple.",
		},
		"2": {
			title: "Noir Obsidienne",
			kicker: "Équipement 2",
			price: "49,00 € EUR",
			image: "images/tshirt2.png",
			thumbs: [
				"images/tshirt2.1.png",
				"images/tshirt2.2.png",
				"images/tshirt2.3.png",
			],
			description: "Le contraste le plus fort de la collection, avec une présence visuelle plus agressive.",
			features: "Matière technique, coupe confortable et finition pensée pour le sport comme le lifestyle.",
		},
		"3": {
			title: "Bleu Électrique",
			kicker: "Équipement 3",
			price: "54,00 € EUR",
			image: "images/tshirt3.png",
			thumbs: [
				"images/tshirt3.1.png",
				"images/tshirt3.2.png",
				"images/tshirt3.3.png",
			],
			description: "La version la plus dynamique pour attirer l’œil et marquer la collection.",
			features: "Textile souple, rendu très visuel et excellente tenue au quotidien.",
		},
	};

	const selectedArticle = articleData[params.get("article")] || articleData["1"];
	document.title = `VORTEX | ${selectedArticle.title}`;
	// show big article number
	const articleNum = params.get("article") || "1";
	const numberEl = document.querySelector('#article-number');
	if (numberEl) numberEl.textContent = articleNum;
	document.querySelector("#article-title").textContent = selectedArticle.title;
	document.querySelector("#article-kicker").textContent = selectedArticle.kicker;
	document.querySelector("#article-price").textContent = selectedArticle.price;
	// Set main image: prefer first thumb if available
	const mainImageSrc = (selectedArticle.thumbs && selectedArticle.thumbs[0]) || selectedArticle.image;
	document.querySelector("#article-image").src = mainImageSrc;
	document.querySelector("#article-image").alt = selectedArticle.title;
	document.querySelector("#article-description").textContent = selectedArticle.description;
	document.querySelector("#article-features").textContent = selectedArticle.features;
	document.querySelector("#article-buy").href = `commander.html?article=${params.get("article") || 1}`;

	// Initialize thumbnails from article data if provided
	const thumbEls = Array.from(document.querySelectorAll(".detail-thumb"));
	const thumbs = selectedArticle.thumbs || [selectedArticle.image, selectedArticle.image, selectedArticle.image];
	thumbEls.forEach((thumbEl, idx) => {
		const src = thumbs[idx] || selectedArticle.image;
		thumbEl.dataset.image = src;
		const img = thumbEl.querySelector("img");
		if (img) img.src = src;
		thumbEl.classList.toggle("is-active", idx === 0);
		thumbEl.addEventListener("click", () => {
			const mainImg = document.querySelector("#article-image");
			if (!mainImg) return;
			// add switching class for smooth fade/scale
			mainImg.classList.add('switching');
			// when the new image finishes loading, remove the switching class
			mainImg.addEventListener('load', function onLoad() {
				mainImg.classList.remove('switching');
			}, { once: true });
			// set the new src (this will trigger load event)
			mainImg.src = thumbEl.dataset.image;
			thumbEls.forEach((item) => item.classList.remove("is-active"));
			thumbEl.classList.add("is-active");
		});
	});

	// Make the article page feel more mobile-first: keep the CTA reachable.
	const detailBuy = document.querySelector(".detail-buy");
	if (detailBuy) {
		detailBuy.setAttribute("data-sticky-cta", "true");
	}

	const quantityValue = document.querySelector(".quantity-picker strong");
	const quantityButtons = document.querySelectorAll(".quantity-picker button");
	let quantity = 1;

	quantityButtons.forEach((button) => {
		button.addEventListener("click", () => {
			quantity += button.textContent.trim() === "+" ? 1 : -1;
			quantity = Math.max(1, quantity);
			quantityValue.textContent = quantity;
		});
	});

	document.querySelectorAll(".size-pills button").forEach((button) => {
		button.addEventListener("click", () => {
			document.querySelectorAll(".size-pills button").forEach((item) => item.classList.remove("is-selected"));
			button.classList.add("is-selected");
		});
	});
}

	/* Simple client-side cart stored in localStorage */
	const CART_KEY = "vortex_cart_v1";

	function readCart() {
		try {
			const raw = localStorage.getItem(CART_KEY);
			return raw ? JSON.parse(raw) : [];
		} catch (e) {
			return [];
		}
	}

	function writeCart(items) {
		localStorage.setItem(CART_KEY, JSON.stringify(items));
		updateCartCount();
	}

	function updateCartCount() {
		const countEls = document.querySelectorAll(".cart-count");
		const items = readCart();
		const total = items.reduce((s, it) => s + (it.quantity || 1), 0);
		countEls.forEach(el => el.textContent = String(total));
	}

	function addToCart(item) {
		const items = readCart();
		// merge by id + size
		const idx = items.findIndex(i => i.id === item.id && i.size === item.size);
		if (idx > -1) {
			items[idx].quantity = (items[idx].quantity || 1) + (item.quantity || 1);
		} else {
			items.push(Object.assign({quantity: 1}, item));
		}
		writeCart(items);
	}

	// Initialize counter on load
	updateCartCount();

	// Hook add-to-cart button on product detail
	document.querySelectorAll('.detail-buy').forEach(btn => {
		btn.addEventListener('click', (e) => {
			// If link navigates, prevent default to update cart first
			e.preventDefault();
			// gather product info from page
			const id = new URLSearchParams(window.location.search).get('article') || '1';
			const title = document.querySelector('#article-title')?.textContent || '';
			const priceText = document.querySelector('#article-price')?.textContent || '';
			const sizeEl = document.querySelector('.size-pills .is-selected');
			const size = sizeEl ? sizeEl.textContent.trim() : '';
			const qty = parseInt(document.querySelector('.quantity-picker strong')?.textContent || '1', 10) || 1;
			addToCart({ id, title, price: priceText, size, quantity: qty });
			// provide quick feedback
			btn.textContent = 'Ajouté ✓';
			setTimeout(() => {
				btn.textContent = 'Ajouter au panier';
				// then navigate to commander page
				window.location.href = btn.getAttribute('href') || 'commander.html';
			}, 700);
		});
	});
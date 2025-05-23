// Cart System with Categories
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize
updateCartUI();

// Add to Cart (called from shop.html buttons)
function addToCart(name, price) {
  // For demo, assign a default category and image based on name
  let category = 'General';
  let image = '';
  if (name.toLowerCase().includes('phone')) { category = 'Electronics'; image = 'products/phone.jpg'; }
  else if (name.toLowerCase().includes('laptop')) { category = 'Electronics'; image = 'products/laptop.jpg'; }
  else if (name.toLowerCase().includes('tomato')) { category = 'Vegetables'; image = 'products/tomato.jpg'; }
  else if (name.toLowerCase().includes('potato')) { category = 'Vegetables'; image = 'products/potato.jpg'; }
  else if (name.toLowerCase().includes('chair')) { category = 'Furniture'; image = 'products/chair.jpg'; }
  else if (name.toLowerCase().includes('table')) { category = 'Furniture'; image = 'products/table.jpg'; }

  // Check if item already in cart
  let existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: Date.now(),
      name,
      price,
      category,
      image,
      quantity: 1
    });
  }
  saveCart();
  showCartNotification(name);
}

// Remove Item
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

// Save to LocalStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

// Update UI
function updateCartUI() {
  // Update cart button
  cartBtn.textContent = `🛒 Cart (${cart.length})`;

  // Render cart items
  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="flex justify-between items-center mb-2 p-2 border-b">
      <div class="flex items-center">
        <img src="${item.image}" alt="${item.name}" class="w-10 h-10 object-cover mr-2">
        <div>
          <p class="font-medium">${item.name}</p>
          <p class="text-sm">₹${item.price} × ${item.quantity}</p>
        </div>
      </div>
      <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700">
        ✕
      </button>
    </div>
  `).join('');

  // Update total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  document.getElementById('cart-total').textContent = `₹${total}`;
}

// Add aria-live to cart notification
function showCartNotification(name) {
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg animate-bounce';
  notification.textContent = `Added ${name} to cart!`;
  notification.setAttribute('role', 'status');
  notification.setAttribute('aria-live', 'polite');
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2000);
}

// Toggle Cart Visibility
cartBtn.addEventListener('click', () => {
  cartSidebar.classList.toggle('translate-x-full');
});

// Checkout (non-functional)
checkoutBtn.addEventListener('click', () => {
  alert('Checkout would go here in a real implementation!');
});

// Mobile Menu Toggle (reuse your existing logic if needed)
document.getElementById('mobile-menu-toggle').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});

// Checkout Modal Logic
const checkoutModal = document.getElementById('checkout-modal');
const orderConfirmation = document.getElementById('order-confirmation');
const checkoutForm = document.getElementById('checkout-form');
const closeCheckout = document.getElementById('close-checkout');
const closeConfirmation = document.getElementById('close-confirmation');

// Show checkout modal when user clicks checkout (add a button in cart section)
if (document.getElementById('cart-items')) {
  const checkoutBtn = document.createElement('button');
  checkoutBtn.textContent = 'Checkout';
  checkoutBtn.className = 'mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-bold';
  checkoutBtn.onclick = () => checkoutModal.classList.remove('hidden');
  document.getElementById('cart').appendChild(checkoutBtn);
}

// Payment method dynamic fields
if (checkoutForm) {
  checkoutForm.payment.addEventListener('change', function() {
    const details = document.getElementById('payment-details');
    details.innerHTML = '';
    details.classList.add('hidden');
    if (this.value === 'upi') {
      details.innerHTML = '<label class="block font-semibold mb-1">UPI ID</label><input type="text" name="upiid" required class="w-full p-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white" placeholder="your@upi" />';
      details.classList.remove('hidden');
    } else if (this.value === 'card') {
      details.innerHTML = '<label class="block font-semibold mb-1">Card Number</label><input type="text" name="cardnum" required class="w-full p-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white" placeholder="1234 5678 9012 3456" maxlength="19" />' +
        '<label class="block font-semibold mb-1 mt-2">Expiry</label><input type="text" name="expiry" required class="w-full p-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white" placeholder="MM/YY" maxlength="5" />' +
        '<label class="block font-semibold mb-1 mt-2">CVV</label><input type="password" name="cvv" required class="w-full p-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white" maxlength="4" />';
      details.classList.remove('hidden');
    }
  });
}

// Keyboard accessibility for modals
function trapFocus(modal) {
  const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  modal.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    if (e.key === 'Escape') {
      modal.classList.add('hidden');
    }
  });
}
if (checkoutModal) {
  checkoutBtn.onclick = () => {
    checkoutModal.classList.remove('hidden');
    setTimeout(() => {
      const firstInput = checkoutModal.querySelector('input, select, textarea, button');
      if (firstInput) firstInput.focus();
    }, 100);
    trapFocus(checkoutModal);
  };
}
if (orderConfirmation) {
  orderConfirmation.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') orderConfirmation.classList.add('hidden');
  });
}

// Place order
if (checkoutForm) {
  checkoutForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Validate phone
    const phone = checkoutForm.phone.value;
    if (!/^\d{10}$/.test(phone)) {
      alert('Please enter a valid 10-digit phone number.');
      checkoutForm.phone.focus();
      return;
    }
    // Validate payment details if required
    if (checkoutForm.payment.value === 'upi') {
      if (!checkoutForm.upiid.value || !checkoutForm.upiid.value.includes('@')) {
        alert('Please enter a valid UPI ID.');
        checkoutForm.upiid.focus();
        return;
      }
    }
    if (checkoutForm.payment.value === 'card') {
      if (!/^\d{16,19}$/.test(checkoutForm.cardnum.value.replace(/\s/g, ''))) {
        alert('Please enter a valid card number.');
        checkoutForm.cardnum.focus();
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(checkoutForm.expiry.value)) {
        alert('Please enter expiry in MM/YY format.');
        checkoutForm.expiry.focus();
        return;
      }
      if (!/^\d{3,4}$/.test(checkoutForm.cvv.value)) {
        alert('Please enter a valid CVV.');
        checkoutForm.cvv.focus();
        return;
      }
    }
    checkoutModal.classList.add('hidden');
    orderConfirmation.classList.remove('hidden');
    cart = [];
    saveCart();
    updateCartUI();
    setTimeout(() => {
      const closeBtn = document.getElementById('close-confirmation');
      if (closeBtn) closeBtn.focus();
    }, 100);
  });
}
if (closeCheckout) closeCheckout.onclick = () => checkoutModal.classList.add('hidden');
if (closeConfirmation) closeConfirmation.onclick = () => orderConfirmation.classList.add('hidden');
document.addEventListener("DOMContentLoaded", () => {
    const navigation_bar = document.querySelector(".nav");
    function updateNavWidth() {
        navigation_bar.style.width = `${document.documentElement.clientWidth}px`;
    }
    updateNavWidth();
    window.addEventListener("resize", updateNavWidth);
});

// Replace the items loading code at the beginning with:
let items = []; // Global items array

// Add this function to load items
async function loadItemsFromServer() {
    try {
        const response = await fetch('https://study-materials-backend-fsaa.onrender.com/items');
        const data = await response.json();
        if (data.success) {
            items = data.items;
            // Initialize items display
            items.forEach((item, index) => {
                addItems(index);
            });
            // Update filter options
            updateFilterOptions();
        }
    } catch (err) {
        console.error('Error loading items:', err);
    }
}

// Update the DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function() {
    // Load items from server
    loadItemsFromServer();

    // Initialize cart
    CART();

    // Initialize search and filter functionality
    const searchInput = document.querySelector('.search-input');
    const filterBtn = document.querySelector('.filter-btn');
    
    if (!searchInput) console.error('Search input not found');
    if (!filterBtn) console.error('Filter button not found');
});

const items_section = document.querySelector(".items");
const cartItems = new Set(); // Track cart items

function addItems(i) {
    const card = document.createElement('div');
    card.classList.add("card");

    // Add image
    const image = document.createElement("img");
    image.src = "books.jpeg";
    card.append(image);

    // Add title
    const title = document.createElement("h2");
    title.innerHTML = items[i].title;
    card.append(title);

    // Add description
    const description = document.createElement("p");
    description.innerHTML = items[i].desc;
    card.append(description);

    // Add price section
    const section = document.createElement("section");
    const price = document.createElement("div");
    price.classList.add("price");
    price.setAttribute("rate", items[i].price);
    price.innerHTML = `Rs. ${items[i].price}`;
    section.append(price);
    card.append(section);

    // Add cart and purchase section
    const actionDiv = document.createElement("div");
    actionDiv.classList.add("action-section");

    // Add to Cart button
    const addToCartBtn = document.createElement("button");
    addToCartBtn.textContent = "Add to Cart";
    addToCartBtn.className = "button add-to-cart-btn";
    
    addToCartBtn.addEventListener("click", () => {
        const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
        if (!loggedUser) {
            alert("Please login first!");
            return;
        }
        
        cartItems.add(items[i]);
        updateCartCount();
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = "Added to Cart";
    });

    // Password input (hidden initially)
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.placeholder = "Enter password";
    passwordInput.style.display = "none";

    // Unlock button (hidden initially)
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Unlock";
    submitBtn.className = "button";
    submitBtn.style.display = "none";

    // Download link (hidden initially)
    const downloadLink = document.createElement("a");
    downloadLink.style.display = "none";
    downloadLink.textContent = "Download";
    downloadLink.className = "button download";
    downloadLink.target = "_blank";
    downloadLink.style.textDecoration = "none";

    // Password verification handler
    submitBtn.addEventListener("click", () => {
        const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
        if (!loggedUser) {
            alert("Please login first!");
            return;
        }

        fetch("https://study-materials-backend-fsaa.onrender.com/verify-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: items[i].title,
                password: passwordInput.value,
                email: loggedUser.email,
                accountPassword: loggedUser.password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                downloadLink.href = `https://study-materials-backend-fsaa.onrender.com${data.download}`;
                downloadLink.style.display = "inline-block";
                submitBtn.style.display = "none";
                passwordInput.style.display = "none";
            } else {
                alert(data.message || "Incorrect password.");
            }
        });
    });

    // Append all elements
    actionDiv.append(addToCartBtn, passwordInput, submitBtn, downloadLink);
    card.append(actionDiv);
    items_section.append(card);
}

function updateCartCount() {
    const cart_count = document.getElementById("cartCount");
    cart_count.innerHTML = cartItems.size.toString();
}

// Update the showPasswordModal function
function showPasswordModal(passwords) {
    const overlay = document.createElement('div');
    overlay.classList.add('password-modal-overlay');
    overlay.setAttribute('data-passwords', JSON.stringify(passwords)); // Store passwords for unlock all
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1001;
    `;

    const modal = document.createElement('div');
    modal.classList.add('password-modal');
    modal.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;

    const content = document.createElement('div');
    content.innerHTML = `
        <h3 style="margin: 0 0 15px; color: #333; font-size: 20px;">Your One-Time Passwords</h3>
        <p style="margin: 0 0 20px; color: #666;">Save these passwords - they can only be used once!</p>
        <div id="passwordsList">
            ${Object.entries(passwords)
                .map(([title, pwd]) => `
                    <div class="password-item" style="margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong style="color: #333;">${title}:</strong> 
                            <code style="background: #e9ecef; padding: 3px 6px; border-radius: 3px; margin-left: 5px;">${pwd}</code>
                        </div>
                        <button 
                            class="unlock-btn"
                            onclick="unlockItem('${title}', '${pwd}', this)"
                            style="
                                padding: 5px 10px;
                                background: #4CAF50;
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                            "
                        >
                            Unlock Now
                        </button>
                    </div>
                `).join('')}
        </div>
        <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
            <button 
                onclick="unlockAllItems(this)"
                class="unlock-all-btn"
                style="
                    padding: 10px 20px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                "
            >
                Unlock All Items
            </button>
            <button 
                class="close-modal-btn"
                style="
                    padding: 10px 20px;
                    background: #ff4444;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                "
            >
                Close
            </button>
        </div>
    `;

    modal.appendChild(content);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const closeBtn = modal.querySelector('.close-modal-btn');
    closeBtn.onclick = () => {
        overlay.remove();
        document.body.style.overflow = 'auto';
    };
}

// Update the unlockItem function
function unlockItem(title, password, button = null) {
    return new Promise((resolve, reject) => {
        const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
        if (!loggedUser) {
            reject("Please login first!");
            return;
        }

        // Check if item is already unlocked
        const card = [...document.querySelectorAll(".card")]
            .find(c => c.querySelector("h2").textContent === title);
        
        if (card) {
            const downloadLink = card.querySelector(".download");
            if (downloadLink && downloadLink.style.display === "inline-block") {
                if (button) {
                    button.textContent = "Already Unlocked";
                    button.style.backgroundColor = "#666";
                    button.disabled = true;
                }
                resolve("Already unlocked");
                return;
            }
        }

        fetch("https://study-materials-backend-fsaa.onrender.com/verify-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title,
                password: password,
                email: loggedUser.email
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (card) {
                    // Update card UI
                    const downloadLink = card.querySelector(".download");
                    downloadLink.href = `https://study-materials-backend-fsaa.onrender.com${data.download}`;
                    downloadLink.style.display = "inline-block";
                    downloadLink.style.position = "absolute";
                    downloadLink.style.right = "10px";
                    downloadLink.style.bottom = "10px";
                    
                    // Hide other elements
                    const passwordInput = card.querySelector("input[type='password']");
                    const submitBtn = card.querySelector(".button:not(.download):not(.add-to-cart-btn)");
                    const addToCartBtn = card.querySelector(".add-to-cart-btn");
                    
                    if (passwordInput) passwordInput.style.display = "none";
                    if (submitBtn) submitBtn.style.display = "none";
                    if (addToCartBtn) addToCartBtn.style.display = "none";

                    // Update modal button if provided
                    if (button) {
                        button.textContent = "Unlocked";
                        button.style.backgroundColor = "#666";
                        button.disabled = true;
                    }
                }
                resolve();
            } else {
                reject(data.message || "Failed to verify password");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            reject("An error occurred while verifying the password");
        });
    });
}

// Update the unlockAllItems function
function unlockAllItems(button) {
    const overlay = button.closest('.password-modal-overlay');
    const passwords = JSON.parse(overlay.getAttribute('data-passwords'));
    button.disabled = true;
    button.textContent = 'Unlocking...';

    const unlockPromises = Object.entries(passwords).map(([title, pwd]) => {
        const passwordItems = overlay.querySelectorAll('.password-item');
        let unlockButton;
        
        for (const item of passwordItems) {
            const strongText = item.querySelector('strong').textContent;
            if (strongText.includes(title + ':')) {
                unlockButton = item.querySelector('.unlock-btn');
                break;
            }
        }

        return unlockItem(title, pwd, unlockButton);
    });

    Promise.all(unlockPromises)
        .then(() => {
            button.textContent = 'All Items Unlocked';
            button.style.backgroundColor = '#666';
            
            // Update all buttons in the modal
            overlay.querySelectorAll('.unlock-btn').forEach(btn => {
                if (!btn.disabled) {
                    btn.textContent = 'Already Unlocked';
                    btn.style.backgroundColor = '#666';
                    btn.disabled = true;
                }
            });

            // Enable close button functionality
            const closeButton = overlay.querySelector('button[onclick*="closest"]');
            if (closeButton) {
                closeButton.onclick = () => {
                    overlay.remove();
                    document.body.style.overflow = 'auto';
                };
            }
        })
        .catch(error => {
            console.error('Error unlocking items:', error);
            if (error !== "Already unlocked") {
                button.textContent = 'Failed to Unlock All';
                button.style.backgroundColor = '#ff4444';
                button.disabled = false;
            } else {
                button.textContent = 'All Items Unlocked';
                button.style.backgroundColor = '#666';
                button.disabled = true;
            }
            
            // Enable close button functionality even on error
            const closeButton = overlay.querySelector('button[onclick*="closest"]');
            if (closeButton) {
                closeButton.onclick = () => {
                    overlay.remove();
                    document.body.style.overflow = 'auto';
                };
            }
        });
}

function CART() {
    const cart = document.querySelector(".cart-icon-container");
    const cartTableBody = document.querySelector(".cart-table tbody");
    const cartTableFoot = document.querySelector(".cart-table tfoot");
    const pop_up = document.getElementById("black");

    cart.addEventListener("click", () => {
        let price = 0;
        cartTableBody.innerHTML = "";

        // Show cart popup
        pop_up.style.display = "flex";
        // Disable body scroll when cart is open
        document.body.style.overflow = 'hidden';

        cartItems.forEach((item) => {
            const rate = item.price;
            price += rate;

            const row = document.createElement("tr");
            
            const itemName = document.createElement("td");
            itemName.innerHTML = item.title;
            
            const rateItem = document.createElement("td");
            rateItem.innerHTML = `Rs. ${rate}`;

            // Add remove button
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.className = "remove-btn";
            removeBtn.onclick = () => {
                cartItems.delete(item);
                row.remove();
                updateCartCount();
                
                // Update totals
                price -= rate;
                const footers = cartTableFoot.querySelectorAll(".f");
                footers[0].innerHTML = `Rs. ${price}`;
                const tax = parseFloat((18 / 100 * price).toFixed(2));
                const total = tax + price;
                footers[1].innerHTML = `Rs. ${tax}`;
                footers[2].innerHTML = `Rs. ${total}`;

                // Re-enable Add to Cart button
                const itemCard = [...document.querySelectorAll(".card")]
                    .find(card => card.querySelector("h2").textContent === item.title);
                if (itemCard) {
                    const addToCartBtn = itemCard.querySelector(".add-to-cart-btn");
                    if (addToCartBtn) {
                        addToCartBtn.disabled = false;
                        addToCartBtn.textContent = "Add to Cart";
                    }
                }
            };

            const actionCell = document.createElement("td");
            actionCell.appendChild(removeBtn);
            row.append(itemName, rateItem, actionCell);
            cartTableBody.append(row);
        });

        // Calculate totals
        const footers = cartTableFoot.querySelectorAll(".f");
        footers[0].innerHTML = `Rs. ${price}`;
        const tax = parseFloat((18 / 100 * price).toFixed(2));
        const total = tax + price;
        footers[1].innerHTML = `Rs. ${tax}`;
        footers[2].innerHTML = `Rs. ${total}`;

        window.scrollTo(0, 0);
    });

    // Close cart popup
    document.querySelector(".close-btn").addEventListener("click", () => {
        pop_up.style.display = "none";
        // Re-enable body scroll when cart is closed
        document.body.style.overflow = 'auto';
    });

    // Remove existing checkout event listener if any
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (!checkoutBtn) {
        console.error("Checkout button not found!");
        return;
    }

    // Remove any existing event listeners
    checkoutBtn.replaceWith(checkoutBtn.cloneNode(true));
    
    // Add new event listener to the fresh button
    document.querySelector(".checkout-btn").addEventListener("click", function(e) {
        // Prevent multiple clicks
        if (this.disabled) return;
        
        // Call handleCheckout
        handleCheckout();
    }, { once: true }); // Use once:true to ensure single execution
}

function handleCheckout() {
    // Get checkout button and disable it immediately
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (!checkoutBtn || checkoutBtn.disabled) {
        return; // Exit if button is already disabled or not found
    }

    // Disable the button immediately
    checkoutBtn.disabled = true;
    checkoutBtn.style.backgroundColor = '#666';
    checkoutBtn.textContent = 'Processing...';

    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (!loggedUser) {
        alert("Please log in to proceed with checkout.");
        resetCheckoutButton(checkoutBtn);
        return;
    }

    if (cartItems.size === 0) {
        alert("Your cart is empty.");
        resetCheckoutButton(checkoutBtn);
        return;
    }

    const checkoutItems = Array.from(cartItems).map(item => ({
        title: item.title,
        price: item.price,
        quantity: 1
    }));

    fetch("https://study-materials-backend-fsaa.onrender.com/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            email: loggedUser.email, 
            cart: checkoutItems 
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Show password modal first
            showPasswordModal(data.passwords);
            
            // Open bill in new tab
            window.open(`https://study-materials-backend-fsaa.onrender.com${data.download}`, "_blank");
            
            // Record purchase time
            const purchaseTime = new Date();
            const purchases = checkoutItems.map(item => ({
                title: item.title,
                price: item.price,
                date: purchaseTime.toLocaleDateString('en-GB'),
                time: purchaseTime.toLocaleTimeString('en-GB'),
                timestamp: purchaseTime.getTime()
            }));

            // Update local storage
            loggedUser.purchases = loggedUser.purchases || [];
            loggedUser.purchases.push(...purchases);
            localStorage.setItem("loggedUser", JSON.stringify(loggedUser));

            // Update backend
            fetch("https://study-materials-backend-fsaa.onrender.com/record-purchase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: loggedUser.email,
                    purchases: purchases
                })
            });

            // Clear cart
            cartItems.clear();
            updateCartCount();
            
            // Close cart popup and restore scrolling
            document.getElementById('black').style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Reset Add to Cart buttons
            document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.disabled = false;
                btn.textContent = "Add to Cart";
            });
        } else {
            alert(data.message || "Checkout failed. Please try again.");
            resetCheckoutButton(checkoutBtn);
        }
    })
    .catch(error => {
        console.error("Checkout error:", error);
        alert("An error occurred during checkout. Please try again.");
        resetCheckoutButton(checkoutBtn);
    });
}

// Add helper function to reset checkout button
function resetCheckoutButton(button) {
    if (button) {
        button.disabled = false;
        button.style.backgroundColor = '#4CAF50';
        button.textContent = 'Checkout';
    }
}

// Replace the existing filter button click handler
document.querySelector(".filter-btn").addEventListener("click", function() {
    // Clear search
    const searchInput = document.querySelector('.search-input');
    if (searchInput) searchInput.value = '';

    const selectedSubject = document.getElementById("subjects").value;
    const itemsSection = document.querySelector('.items');
    itemsSection.innerHTML = '';
    let foundItems = false;

    // Remove any existing no results message
    const existingMsg = document.querySelector('.no-results-message');
    if (existingMsg) existingMsg.remove();

    // Add items based on filter
    items.forEach((item, index) => {
        if (!selectedSubject || item.subject === selectedSubject) {
            addItems(index);
            foundItems = true;
        }
    });

    // Show message if no items found
    if (!foundItems && selectedSubject) {
        const noItemsMsg = document.createElement('div');
        noItemsMsg.className = 'no-results-message';
        noItemsMsg.style.cssText = `
            width: 100%;
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 16px;
        `;
        noItemsMsg.textContent = 'No items found for selected subject';
        itemsSection.appendChild(noItemsMsg);
    }

    // Reset cart
    cartItems.clear();
    updateCartCount();
});

// Replace the search functionality
document.querySelector('.search-input').addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
        // If search is empty, show all items
        document.querySelectorAll('.card').forEach(card => {
            card.style.display = '';
        });
        const noResultsMsg = document.querySelector('.no-results-message');
        if (noResultsMsg) noResultsMsg.remove();
        return;
    }

    let foundItems = false;
    document.querySelectorAll('.card').forEach(card => {
        const title = card.querySelector('h2').textContent.toLowerCase();
        const desc = card.querySelector('p').textContent.toLowerCase();
        if (title.includes(query) || desc.includes(query)) {
            card.style.display = '';
            foundItems = true;
        } else {
            card.style.display = 'none';
        }
    });

    // Handle no results message
    const existingMsg = document.querySelector('.no-results-message');
    if (!foundItems) {
        if (!existingMsg) {
            const noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.style.cssText = `
                width: 100%;
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 16px;
            `;
            noResultsMsg.textContent = 'No matching items found';
            document.querySelector('.items').appendChild(noResultsMsg);
        }
    } else if (existingMsg) {
        existingMsg.remove();
    }
});

// Add function to clear search
function clearSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.value = '';
    }
}

// Replace the existing getSubjectFullName function
async function loadSubjects() {
    try {
        const response = await fetch('https://study-materials-backend-fsaa.onrender.com/subjects');
        const data = await response.json();
        return data.success ? data.subjects : {};
    } catch (err) {
        console.error('Error loading subjects:', err);
        return {};
    }
}

// Update the updateFilterOptions function
async function updateFilterOptions() {
    const subjectSelect = document.getElementById('subjects');
    if (!subjectSelect) return;

    // Keep only the first "All Subjects" option
    while (subjectSelect.options.length > 1) {
        subjectSelect.remove(1);
    }

    // Get unique subjects from items and their full names
    const uniqueSubjects = [...new Set(items.map(item => item.subject))];
    const subjects = await loadSubjects();

    // Sort subjects alphabetically
    uniqueSubjects.sort((a, b) => {
        const nameA = subjects[a] || a;
        const nameB = subjects[b] || b;
        return nameA.localeCompare(nameB);
    });

    // Add subjects in proper format
    for (const subject of uniqueSubjects) {
        const subjectName = subjects[subject] || subject;
        const option = new Option(subjectName, subject);
        subjectSelect.add(option);
    }
}

// Update the loadItems function
function loadItems() {
    fetch('../items.js')
        .then(res => res.text())
        .then(text => {
            const itemsArray = eval(text.replace('const items =', ''));
            const tbody = document.getElementById("itemsTableBody");
            tbody.innerHTML = '';
            
            // Update items array
            window.items = itemsArray;
            
            // Update filter options in both admin and main page
            updateFilterOptions();
            
            itemsArray.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.title}</td>
                    <td>${item.desc}</td>
                    <td>Rs. ${item.price}</td>
                    <td>${item.subject}</td>
                    <td>
                        <div class="file-cell">
                            ${item.filename ? 
                                `<span class="file-status success">✓ ${item.filename}</span>` : 
                                '<span class="file-status pending">No file</span>'}
                        </div>
                    </td>
                    <td>
                        <button class="delete-item-btn" 
                                onclick="removeItem(${index})">
                            Delete
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        });
}
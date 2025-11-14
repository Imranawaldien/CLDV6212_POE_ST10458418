

async function postJson(url, data){
  const r = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
  return r.json();
}

async function getJson(url){
  const r = await fetch(url);
  return r.json();
}

// Login page
if(location.pathname.endsWith('index.html') || location.pathname === '/'){
  document.getElementById('btnLogin').addEventListener('click', async ()=>{
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if(!email || !password){ document.getElementById('status').innerText='Enter email and password'; return; }
    const res = await postJson('/api/AddUser', { email, password });
    if(res && res.email) {
      localStorage.setItem('user', res.email);
      location.href = 'products.html';
    } else {
      document.getElementById('status').innerText = 'Login failed';
    }
  });
}

// Products page
if(location.pathname.endsWith('products.html')){
  (async ()=>{
    const data = await getJson('/api/GetProducts');
    const el = document.getElementById('list');
    if(!data || data.length===0) { el.innerText='No products'; return; }
    el.innerHTML = data.map(p => {
      const id = p.RowKey || p.ProductId;
      const price = p.Price || 0;
      return `<div><strong>${p.Name}</strong> - R${price.toFixed(2)}<br>
              ${p.Description || ''}<br>
              <button onclick="addToCart('${id}','${(p.Name||'').replace(/'/g,'\\\'')}',${price})">Add</button></div><hr>`;
    }).join('');
  })();
}

function addToCart(id, name, price){
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  const found = cart.find(i=>i.ProductId===id);
  if(found) found.Quantity++;
  else cart.push({ ProductId:id, Name:name, Price:price, Quantity:1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Added to cart');
}

// Checkout page
if(location.pathname.endsWith('checkout.html')){
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  document.getElementById('cart').innerText = JSON.stringify(cart,null,2);
  document.getElementById('btnPlace').addEventListener('click', async ()=>{
    const user = localStorage.getItem('user') || 'anonymous';
    const res = await postJson('/api/AddOrder', { user, items: cart });
    document.getElementById('result').innerText = JSON.stringify(res);
    localStorage.removeItem('cart');
  });
}

// Admin page
if(location.pathname.endsWith('admin.html')){
  (async ()=>{
    const data = await getJson('/api/GetOrders');
    document.getElementById('orders').innerText = JSON.stringify(data, null, 2);
  })();
}

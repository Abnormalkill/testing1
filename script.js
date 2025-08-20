 // --- Pricing Logic ---
 const deliveryFlat = 120; // Rs
 const premiumCleanPerKg = 80; // Rs per kg

 const money = n => `Rs ${n.toLocaleString('en-PK')}`;

 const els = {
   cut: [...document.querySelectorAll('input[name="cut"]')],
   qty: document.getElementById('qty'),
   cleaning: document.getElementById('cleaning'),
   subtotal: document.getElementById('subtotal'),
   cleaningCost: document.getElementById('cleaningCost'),
   delivery: document.getElementById('delivery'),
   discount: document.getElementById('discount'),
   total: document.getElementById('total'),
   payment: document.getElementById('payment'),
   cardFields: document.getElementById('cardFields'),
   placeOrder: document.getElementById('placeOrder'),
   name: document.getElementById('name'),
   phone: document.getElementById('phone'),
   email: document.getElementById('email'),
   address: document.getElementById('address'),
   modal: document.getElementById('orderModal'),
   ref: document.getElementById('ref'),
   confirmEmail: document.getElementById('confirmEmail'),
   sumItem: document.getElementById('sumItem'),
   sumQty: document.getElementById('sumQty'),
   sumPay: document.getElementById('sumPay'),
   sumTotal: document.getElementById('sumTotal'),
 };

 const getSelectedCut = () => els.cut.find(r => r.checked);

 function calc(){
   const cut = getSelectedCut();
   const price = Number(cut.dataset.price);
   const qty = Math.max(0.5, Number(els.qty.value) || 0);
   const clean = els.cleaning.value;

   const subtotal = Math.round(price * qty);
   const cleaning = clean === 'premium' ? Math.round(premiumCleanPerKg * qty) : 0;

   // Discount: 3% if qty >= 3kg, 6% if >= 5kg
   let discount = 0;
   if(qty >= 5) discount = Math.round((subtotal + cleaning) * 0.06);
   else if(qty >= 3) discount = Math.round((subtotal + cleaning) * 0.03);

   const total = subtotal + cleaning + deliveryFlat - discount;

   els.subtotal.textContent = money(subtotal);
   els.cleaningCost.textContent = money(cleaning);
   els.delivery.textContent = money(deliveryFlat);
   els.discount.textContent = `- ${money(discount)}`;
   els.total.textContent = money(total);

   return {subtotal, cleaning, discount, total, qty, cut: cut.value, price};
 }

 function validate(){
   const errs = [];
   if(!els.name.value.trim()) errs.push('Name is required');
   const phone = els.phone.value.replace(/[^0-9]/g,'');
   if(phone.length < 10) errs.push('Valid phone is required');
   if(!els.address.value.trim()) errs.push('Address is required');
   if(els.payment.value === 'online'){
     // Demo only: not processing real payments.
   }
   return errs;
 }

 els.cut.forEach(r => r.addEventListener('change', calc));
 ['input','change'].forEach(ev => {
   els.qty.addEventListener(ev, calc);
   els.cleaning.addEventListener(ev, calc);
 });

 els.payment.addEventListener('change', e => {
   const show = e.target.value === 'online';
   els.cardFields.classList.toggle('hidden', !show);
 });

 els.placeOrder.addEventListener('click', () => {
   const errs = validate();
   if(errs.length){
     alert('Please fix the following:\n\n- ' + errs.join('\n- '));
     return;
   }

   const pr = calc();
   const ref = 'CM' + Math.floor(100000 + Math.random()*900000);

   // Simulate API payload
   const payload = {
     reference: ref,
     item: pr.cut,
     qty: pr.qty,
     pricePerKg: pr.price,
     totals: pr,
     delivery: { name: els.name.value, phone: els.phone.value, email: els.email.value, address: els.address.value },
     paymentMethod: els.payment.value,
     notes: document.getElementById('notes').value,
     time: document.getElementById('time').value,
     createdAt: new Date().toISOString()
   };

   // Persist locally so you can test without a backend
   const orders = JSON.parse(localStorage.getItem('chickenmart_orders')||'[]');
   orders.push(payload);
   localStorage.setItem('chickenmart_orders', JSON.stringify(orders));

   // Show modal
   els.ref.textContent = ref;
   els.confirmEmail.textContent = payload.delivery.email || 'your email';
   els.sumItem.textContent = payload.item.charAt(0).toUpperCase()+payload.item.slice(1);
   els.sumQty.textContent = payload.qty + ' kg';
   els.sumPay.textContent = payload.paymentMethod.toUpperCase();
   els.sumTotal.textContent = money(payload.totals.total);
   els.modal.showModal();
 });

 document.getElementById('closeModal').addEventListener('click', ()=> els.modal.close());

 // Year
 document.getElementById('year').textContent = new Date().getFullYear();

 // Init
 calc();
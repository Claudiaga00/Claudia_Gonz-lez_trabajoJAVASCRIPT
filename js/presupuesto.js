// presupuesto.js
document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('form-presupuesto');
  const nombre = document.getElementById('nombre');
  const apellidos = document.getElementById('apellidos');
  const telefono = document.getElementById('telefono');
  const email = document.getElementById('email');
  const plazo = document.getElementById('plazo');
  const presupuestoFinal = document.getElementById('presupuesto-final');
  const acepto = document.getElementById('acepto');
  const btnSend = document.getElementById('btn-send');
  const btnReset = document.getElementById('btn-reset');

  // Validadores
  const regexNombre = /^\p{L}+$/u; // solo letras (incluye acentos)
  const regexApellidos = /^\p{L}+$/u; // estrictamente letras (si quieres permitir espacios/hífen, cambia esto)
  const regexTelefono = /^\d{1,9}$/;

  function validarNombre(){
    const v = nombre.value.trim();
    if(!v) return setErr('err-nombre','El nombre es obligatorio.');
    if(v.length > 15) return setErr('err-nombre','Máx. 15 caracteres.');
    if(!regexNombre.test(v)) return setErr('err-nombre','Solo letras (no espacios ni números).');
    clearErr('err-nombre'); return true;
  }
  function validarApellidos(){
    const v = apellidos.value.trim();
    if(!v) return setErr('err-apellidos','Los apellidos son obligatorios.');
    if(v.length > 40) return setErr('err-apellidos','Máx. 40 caracteres.');
    if(!regexApellidos.test(v)) return setErr('err-apellidos','Solo letras (no espacios ni números).');
    clearErr('err-apellidos'); return true;
  }
  function validarTelefono(){
    const v = telefono.value.trim();
    if(!v) return setErr('err-telefono','Teléfono obligatorio.');
    if(!regexTelefono.test(v)) return setErr('err-telefono','Solo números (hasta 9 dígitos).');
    clearErr('err-telefono'); return true;
  }
  function validarEmail(){
    if(!email.checkValidity()) { setErr('err-email','Email no válido.'); return false; }
    clearErr('err-email'); return true;
  }

  function setErr(id,msg){
    document.getElementById(id).textContent = msg;
    return false;
  }
  function clearErr(id){
    document.getElementById(id).textContent = '';
  }

  // Cálculo del presupuesto
  function calcularPresupuesto(){
    const producto = Number(document.querySelector('input[name="producto"]:checked').value);
    const extrasChecked = [...document.querySelectorAll('input[name="extra"]:checked')].map(n=>Number(n.value)).reduce((a,b)=>a+b,0);
    const meses = Math.max(1, Number(plazo.value) || 1);

    // Regla de descuentos (ejemplo claro y justificable):
    // 1-2 meses -> 0%
    // 3-5 meses -> 5%
    // 6-11 meses -> 10%
    // 12+ meses -> 20%
    let discount = 0;
    if(meses >= 12) discount = 0.20;
    else if(meses >= 6) discount = 0.10;
    else if(meses >= 3) discount = 0.05;

    let total = producto + extrasChecked;
    total = total * (1 - discount);
    // Si el hosting se cobra mensualmente (ejemplo), podríamos sumar hosting*meses. En este caso, el checkbox de hosting es un extra de 10€ y se suma una vez.
    presupuestoFinal.value = total.toFixed(2) + ' €';
    return {total,discount,producto,extrasChecked,meses};
  }

  // Controlar estado del botón de enviar
  function comprobarTodo(){
    const v = validarNombre() && validarApellidos() && validarTelefono() && validarEmail() && acepto.checked;
    btnSend.disabled = !v;
  }

  // Event listeners
  [nombre,apellidos,telefono,email].forEach(el => el.addEventListener('input', ()=>{
    if(el===nombre) validarNombre();
    if(el===apellidos) validarApellidos();
    if(el===telefono) validarTelefono();
    if(el===email) validarEmail();
    comprobarTodo();
  }));

  document.querySelectorAll('input[name="producto"], input[name="extra"], #plazo').forEach(el => el.addEventListener('change', ()=>{
    calcularPresupuesto();
  }));

  acepto.addEventListener('change', comprobarTodo);
  btnReset.addEventListener('click', ()=>{
    setTimeout(()=>{ // esperar que el formulario se resetee y recalcular
      calcularPresupuesto(); comprobarTodo();
    },0);
  });

  // Enviar por mailto (abre el cliente de correo del usuario con los datos)
  btnSend.addEventListener('click', ()=>{
    if(!(validarNombre() && validarApellidos() && validarTelefono() && validarEmail() && acepto.checked)){
      alert('Rellena correctamente todos los campos y acepta las condiciones.');
      return;
    }
    const resumen = calcularPresupuesto();
    const body = [
      `Nombre: ${nombre.value}`,
      `Apellidos: ${apellidos.value}`,
      `Teléfono: ${telefono.value}`,
      `Email: ${email.value}`,
      `Producto: ${resumen.producto} €`,
      `Extras: ${resumen.extrasChecked} €`,
      `Plazo (meses): ${resumen.meses}`,
      `Descuento aplicado: ${(resumen.discount*100)}%`,
      `Total: ${resumen.total.toFixed(2)} €`
    ].join('%0D%0A');

    // Cambia el correo destino por el que te indiquen en el enunciado o por tu correo real
    const mailTo = `mailto:nnnnn_nnn@zzzzz.xxx?subject=${encodeURIComponent('Presupuesto')}&body=${body}`;
    window.location.href = mailTo;
  });

  // Inicializar
  calcularPresupuesto();
  comprobarTodo();
});

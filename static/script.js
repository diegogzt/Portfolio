function areaAuto(){
    const input = document.getElementById('user-input');
    
    input.addEventListener('input', function () {
        this.style.height = 'auto'; // Restablece la altura para recalcularla
        this.style.height = this.scrollHeight + 'px'; // Ajusta la altura al contenido
    });
    
}

const chatBody = document.getElementById("chat-body"); // Obtiene el elemento del DOM con el id "chat-body"
const userInput = document.getElementById("user-input"); // Obtiene el elemento del DOM con el id "user-input"
const sendButton = document.getElementById("button"); // Obtiene el botón de envío

function addMessage(role, message) {
    areaAuto();
    const div = document.createElement("div"); // Crea un nuevo elemento div
    div.className = `message ${role}`; // Asigna una clase al div basada en el rol (user o bot)
    if (role == "bot") {
        div.className = `chati`;
        // Reemplaza los dobles asteriscos por saltos de línea
        message = message.replace(/\*\*/g, '<br>');
        // Convierte los enlaces en HTML
        message = message.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" style="color: blue;" target="_blank">$1</a>');
        div.innerHTML = message; // Establece el contenido HTML del div al mensaje proporcionado
    } else {
        div.textContent = message; // Establece el contenido de texto del div al mensaje proporcionado
    }

    // Aplica estilos para el ancho máximo y el ajuste de texto
    div.style.maxWidth = '510px';
    div.style.marginLeft = '20px';

    chatBody.appendChild(div); // Añade el div al final del elemento chatBody
    chatBody.scrollTop = chatBody.scrollHeight; // Desplaza el chatBody hacia abajo para mostrar el nuevo mensaje
}

function addLoadingMessage() {
    const div = document.createElement("div");
    div.className = "message bot loading";
    div.innerHTML = '<div class="loading-spinner"></div>'; // Añade la animación de cargando
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    return div;
}

async function sendMessage() {
    const message = userInput.value.trim(); // Obtiene y recorta el valor del input de usuario
    if (!message) return; // Si el mensaje está vacío, no hace nada

    addMessage("user", message); // Añade el mensaje del usuario al chat

    // Deshabilita el campo de entrada y el botón de envío
    userInput.disabled = true;
    sendButton.disabled = true;

    const loadingMessage = addLoadingMessage(); // Añade el mensaje de cargando

    try {
        const response = await fetch("https://chatbot-backend-z6pr.onrender.com", { // Envía una solicitud POST al servidor
            method: "POST",
            headers: { "Content-Type": "application/json" }, // Establece el tipo de contenido como JSON
            body: JSON.stringify({ message }) // Convierte el mensaje a una cadena JSON y lo envía en el cuerpo de la solicitud
        });

        const data = await response.json(); // Espera la respuesta del servidor y la convierte a JSON
        chatBody.removeChild(loadingMessage); // Elimina el mensaje de cargando

        if (data.response) {
            addMessage("bot", data.response); // Si hay una respuesta, añade el mensaje del bot al chat
        } else {
            addMessage("bot", "Lo siento, ocurrió un error."); // Si no hay respuesta, muestra un mensaje de error
        }
    } catch (error) {
        console.error(error); // Muestra el error en la consola
        chatBody.removeChild(loadingMessage); // Elimina el mensaje de cargando
        addMessage("bot", "No se pudo conectar con el servidor."); // Añade un mensaje de error al chat
    }

    // Habilita el campo de entrada y el botón de envío
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.value = ""; // Limpia el campo de entrada del usuario
    userInput.focus(); // Enfoca el campo de entrada del usuario
}

userInput.addEventListener("keydown", function(event) { // Añade un evento al campo de entrada del usuario
    if (event.key === "Enter") { // Si la tecla presionada es Enter
        sendMessage(); // Envía el mensaje
    }
});

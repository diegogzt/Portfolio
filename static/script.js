function areaAuto() {
    const input = document.getElementById('user-input');

    input.addEventListener('input', function () {
        this.style.height = 'auto'; // Restablece la altura para recalcularla
        this.style.height = this.scrollHeight + 'px'; // Ajusta la altura al contenido
    });
}

const chatBody = document.getElementById("chat-body");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("button");

function addMessage(role, message) {
    areaAuto();
    const div = document.createElement("div");
    div.className = `message ${role}`;
    if (role == "bot") {
        div.className = `chati`;
        // Reemplaza los dobles asteriscos por saltos de línea
        message = message.replace(/\*\*/g, '<br>');
        // Convierte los enlaces en HTML
        message = message.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" style="color: blue;" target="_blank">$1</a>');
        div.innerHTML = message;
    } else {
        div.textContent = message;
    }

    // Aplica estilos para el ancho máximo y el ajuste de texto
    div.style.maxWidth = '510px';
    div.style.marginLeft = '20px';

    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function addLoadingMessage() {
    const div = document.createElement("div");
    div.className = "message bot loading";
    div.innerHTML = '<div class="loading-spinner"></div>';
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    return div;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage("user", message);

    userInput.disabled = true;
    sendButton.disabled = true;

    const loadingMessage = addLoadingMessage();

    try {
        // Note we're using '/api/chat' instead of just '/chat'
        const response = await fetch('/api/chat', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        chatBody.removeChild(loadingMessage);

        if (data.response) {
            addMessage("bot", data.response);
        } else {
            addMessage("bot", "Lo siento, ocurrió un error en la respuesta.");
        }
    } catch (error) {
        console.error("Error:", error);
        chatBody.removeChild(loadingMessage);
        addMessage("bot", "No se pudo conectar con el servidor. Error: " + error.message);
    }

    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.value = "";
    userInput.focus();
}

userInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default to avoid submitting a form if inside one
        sendMessage();
    }
});

// Initialize the auto-sizing textarea when the page loads
document.addEventListener('DOMContentLoaded', areaAuto);
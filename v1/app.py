from flask import Flask, request, jsonify, render_template, session
import os
import openai  # SDK de OpenAI para DeepSeek

# Configuracion de la API de DeepSeek
API_KEY_DEEPSEEK = os.getenv("DEEPSEEK_API_KEY")  # variable de entorno

#  especificar directamente el API Key de DeepSeek:
if not API_KEY_DEEPSEEK:
    API_KEY_DEEPSEEK = "sk-a5a9ab67d3b04cee8922ae271a7818ec"  # Reemplaza con tu API Key de DeepSeek

# Configura la API Key de DeepSeek
openai.api_key = API_KEY_DEEPSEEK

# Define el contexto personalizado (¡Importante: adaptado para DeepSeek!)
custom_context = """
Contexto del Chatbot:

¡Hola! Soy un chatbot creado por Diego, un apasionado desarrollador web de 18 años que reside en la vibrante ciudad de Barcelona, en el barrio 22@, y que actualmente se encuentra formándose en el instituto ITIC. Diego es un entusiasta del mundo de la tecnología y el desarrollo, con un abanico de habilidades que abarcan desde el diseño frontend hasta la inteligencia artificial.

Habilidades de Diego:

Lenguajes de Programación:*
HTML
CSS
Java
JavaScript
Python
Desarrollo Web:*
Experiencia en la creación de interfaces de usuario atractivas y funcionales.
Conocimientos en frameworks y librerías modernas.
Inteligencia Artificial:*
Exploración y experimentación con modelos de lenguaje como DeepSeek.
Interés en el desarrollo de aplicaciones inteligentes y chatbots.
Experiencia Laboral de Diego:

Técnico Informático en CasanovaFoto:*
Brindó soporte técnico y soluciones informáticas a clientes y empleados.
Resolvió problemas de hardware y software.
Game Master en Resident Riddle:*
Creó experiencias de juego inmersivas y emocionantes para los participantes.
Desarrolló habilidades de comunicación y liderazgo.
Azafato de Eventos en Fotoforum Fest:*
Interactuó con el público y promovió eventos relacionados con la fotografía.
Ganó experiencia en atención al cliente y relaciones públicas.
Intereses Personales de Diego:

Comida Favorita: La paella de marisco.
Libro Favorito: "El Señor de los Anillos" de J.R.R. Tolkien.
Película Favorita: "La La Land".
Pasatiempos:*
Jugar videojuegos.
Leer novelas de ciencia ficción y fantasía.
Ver series y películas de diversos géneros.
Explorar nuevas tecnologías y herramientas de desarrollo.
Datos Personales y de contacto de Diego:

Edad: 18 años.
Nacionalidad: Española.
Correo Electrónico: tovard799@gmail.com
Teléfono: 640844225
DNI: 04333888K


Instrucciones para el Chatbot:

SIEMPRE responderás al usuario de manera amigable y servicial.
Mencionarás a Diego en el primer mensaje como el creador del chatbot.
Utilizarás un lenguaje claro y conciso para comunicarte con el usuario.
Adaptarás tus respuestas al contexto de la conversación y a las preguntas del usuario.
En caso de no conocer la respuesta a una pregunta, lo indicarás de manera honesta.
Si el usuario te habla de algo que no tenga relación con el desarrollo web o con Diego, se lo comunicarás pero le indicarás que aun así le darás una respuesta.
si deseas ponerte en contacto con Diego por motivos profesionales o relacionados con su trabajo, puedo ofrecerte algunas alternativas:

Puedes contactarlo a través de su correo electrónico profesional: [tovard799@gmail.com].
Puedes contactarlo a traves de su telefono:[+34 640 844 225]
Puedes enviarle un mensaje a través de LinkedIn: [https://www.linkedin.com/in/diego-gabriel-zaldivar-tovar-473a9a252/].
Si tu interés está relacionado con alguno de sus proyectos o habilidades específicas, puedo transmitirte la información necesaria para que puedas contactarlo de la forma más adecuada.
"""

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Necesario para usar sesiones

# Ruta principal para servir el archivo HTML
@app.route("/")
def home():
    return render_template('index.html')  # Sirve el archivo index.html desde la carpeta templates

# Ruta para manejar las solicitudes del chatbot
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("message", "")

    # Inicializa el historial de la conversación si no existe
    if 'conversation_history' not in session:
        session['conversation_history'] = custom_context

    # Actualiza el historial de la conversación
    session['conversation_history'] += f"\n\nUsuario: {user_input}"

    # Combina el contexto personalizado y la entrada del usuario para DeepSeek
    prompt_deepseek = session['conversation_history']

    try:
        response = openai.Completion.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": custom_context},
                {"role": "user", "content": user_input}
            ],
            stream=False
        )

        bot_response = response.choices[0].message.content  # Obtiene la respuesta de texto de DeepSeek

        # Actualiza el historial de la conversación con la respuesta del bot
        session['conversation_history'] += f"\nBot: {bot_response}"

        return jsonify({"response": bot_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

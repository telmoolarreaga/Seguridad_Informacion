import requests
import json
import os

# Configuración de la API (Apartado Extra)
OPENROUTER_API_KEY = "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"
FILE_TEXT = "contenido_estructurado.txt"

def procesar_con_ia():
    print("\n--- Iniciando procesamiento con LLM (Extra) ---")
    
    # 1. Leer el contenido extraído
    if not os.path.exists(FILE_TEXT):
        print("Error: No se encuentra el archivo de texto estructurado.")
        return

    with open(FILE_TEXT, "r", encoding="utf-8") as f:
        texto_noticias = f.read()[:4000] # Límite de seguridad

    # 2. Llamada a la API de OpenRouter
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            data=json.dumps({
                # Usamos una versión gratuita de Gemini en OpenRouter para evitar fallos por saldo
                "model": "meta-llama/llama-3.1-8b-instruct", 
                "messages": [
                    {
                        "role": "system", 
                        "content": "Eres un analista experto. Resume las noticias de forma muy breve."
                    },
                    {
                        "role": "user", 
                        "content": f"Basado en este texto, dime las 3 noticias más importantes en viñetas:\n\n{texto_noticias}"
                    }
                ]
            })
        )
        
        resultado = response.json()
        
        # --- NUEVO: COMPROBACIÓN DE ERRORES DE LA API ---
        if "error" in resultado:
            print(f"❌ La API rechazó la petición. Motivo: {resultado['error']['message']}")
            return
            
        # Si no hay error, extraemos el mensaje
        mensaje_ia = resultado['choices'][0]['message']['content']
        
        # 3. Guardar la conclusión
        with open("conclusiones_ia.txt", "w", encoding="utf-8") as f_out:
            f_out.write(mensaje_ia)
            
        print("✅ ¡Éxito! Conclusiones guardadas en 'conclusiones_ia.txt'.")
        print("\n--- RESUMEN DE LA IA ---\n", mensaje_ia)

    except Exception as e:
        print(f"Error general de Python: {e}")
if __name__ == "__main__":
    # Primero asegúrate de haber ejecutado el scraping para generar el archivo .txt
    procesar_con_ia()
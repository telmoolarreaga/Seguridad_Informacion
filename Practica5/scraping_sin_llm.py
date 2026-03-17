import requests
from bs4 import BeautifulSoup
import os
import re
from urllib.parse import urljoin

# CONFIGURACIÓN (Punto 1.c)
# URL introducida por variable global como permite el enunciado 
URL_OBJETIVO = "https://www.elmundo.es/"
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
CARPETA_IMGS = "imagenes" # Nombre exacto solicitado 

# Crear carpeta para imágenes si no existe 
os.makedirs(CARPETA_IMGS, exist_ok=True)

def ejecutar_scraping():
    print(f"Iniciando extracción en: {URL_OBJETIVO}")
    
    try:
        response = requests.get(URL_OBJETIVO, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(response.text, "html.parser")

        # i. TEXTO ESTRUCTURADO (títulos, cabeceras, p) 
        print("Guardando texto estructurado...")
        with open("contenido_estructurado.txt", "w", encoding="utf-8") as f_text:
            # Buscamos etiquetas h1-h3 para cabeceras y p para párrafos 
            for tag in soup.find_all(['h1', 'h2', 'h3', 'p']):
                tipo = "CABECERA" if tag.name.startswith('h') else "PÁRRAFO"
                texto = tag.get_text().strip()
                if texto:
                    f_text.write(f"{tipo}: {texto}\n")

        # ii. IMÁGENES (En carpeta imagenes) 
        print("Descargando imágenes...")
        for i, img in enumerate(soup.find_all("img")[:10]): # Limitado a 10 para la prueba
            src = img.get("src") or img.get("data-src")
            if src:
                img_url = urljoin(URL_OBJETIVO, src)
                try:
                    img_data = requests.get(img_url, headers=HEADERS).content
                    with open(f"{CARPETA_IMGS}/img_{i}.jpg", "wb") as f_img:
                        f_img.write(img_data)
                except: continue

        # iii. HIPERVÍNCULOS (Dentro de un txt) 
        print("Extrayendo hipervínculos...")
        links = soup.find_all("a", href=True)
        with open("hipervinculos.txt", "w", encoding="utf-8") as f_links:
            for link in links:
                f_links.write(urljoin(URL_OBJETIVO, link['href']) + "\n")

        # iv. DETALLES DE CONTACTO (mails) 
        # Búsqueda mediante expresiones regulares en el HTML 
        emails = set(re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', response.text))
        with open("contactos.txt", "w", encoding="utf-8") as f_cont:
            if emails:
                for email in emails:
                    f_cont.write(f"EMAIL: {email}\n")
            else:
                f_cont.write("No se encontraron emails en la portada.")

        # v. ARCHIVOS (Descarga de PDFs si existen) 
        print("Buscando archivos PDF...")
        for link in links:
            href = link['href'].lower()
            if href.endswith(".pdf"):
                pdf_url = urljoin(URL_OBJETIVO, href)
                pdf_nombre = pdf_url.split("/")[-1]
                try:
                    pdf_content = requests.get(pdf_url, headers=HEADERS).content
                    with open(pdf_nombre, "wb") as f_pdf:
                        f_pdf.write(pdf_content)
                    print(f"Descargado: {pdf_nombre}")
                except: pass

        print("\n--- Todos los archivos resultantes han sido generados  ---")

    except Exception as e:
        print(f"Error al acceder a la página: {e}")

if __name__ == "__main__":
    ejecutar_scraping()
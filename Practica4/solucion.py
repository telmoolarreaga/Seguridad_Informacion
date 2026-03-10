import hashlib
import itertools
import string
import time

# Leer el hash del archivo (solo lectura, no se sobrescribe)
archivo = open("hash_guardado.txt", "r")
hash_objetivo = archivo.read().strip()
archivo.close()

caracteres = string.ascii_lowercase  # letras a-z
intentos = 0

inicio = time.time()

# Generar todas las combinaciones de 4 letras
for combinacion in itertools.product(caracteres, repeat=4):
    password = "".join(combinacion)

    # Calcular hash SHA-256
    hash_generado = hashlib.sha256(password.encode()).hexdigest()

    intentos += 1

    if hash_generado == hash_objetivo:
        fin = time.time()
        print("Contraseña encontrada:", password)
        print("Intentos:", intentos)
        print("Tiempo:", fin - inicio, "segundos")
        break
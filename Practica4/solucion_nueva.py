import hashlib
import itertools
import string
import time

# Leer hash
with open("hash_nuevo.txt", "r") as f:
    hash_objetivo = f.read().strip()

letras = string.ascii_lowercase
inicio = time.time()
intentos = 0

# Como CR7 ya está en orden, necesitamos completar los 7 caracteres
# El patrón: 'c', 'r', '7' + 4 letras
# Vamos a colocar las 4 letras en las posiciones restantes (total 7)

# Posiciones posibles para CR7
# c en pos i, r en pos j>i, 7 en pos k>j
# luego las 4 letras en las otras posiciones

# Para simplificar, vamos a asumir CR7 al principio y generar todas combinaciones de 4 letras después
for letras_restantes in itertools.product(letras, repeat=4):
    password = 'cr7' + ''.join(letras_restantes)
    hash_generado = hashlib.sha256(password.encode()).hexdigest()
    intentos += 1

    if hash_generado == hash_objetivo:
        print("Contraseña encontrada:", password)
        print("Intentos:", intentos)
        print("Tiempo:", time.time() - inicio, "segundos")
        exit()
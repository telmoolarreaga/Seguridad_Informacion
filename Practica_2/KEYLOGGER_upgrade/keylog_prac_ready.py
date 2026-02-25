from pynput import keyboard
from datetime import datetime
import os


BASE_DIR = r"C:\Users\gonzalez.asier\Documents"
LOG_FILE = os.path.join(BASE_DIR, "teclas_log.txt")
RAW_FILE = os.path.join(BASE_DIR, "RAW.txt")

def now_str():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]

def guardar_log(texto):
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(texto + "\n")

def guardar_raw(texto):
    with open(RAW_FILE, "a", encoding="utf-8") as f:
        f.write(texto)

def borrar_ultimo_raw():
    try:
        with open(RAW_FILE, "rb+") as f:
            f.seek(0, 2)  # ir al final
            size = f.tell()
            if size > 0:
                f.seek(-1, 2)
                f.truncate()
    except:
        pass

def on_press(key):
    try:
        k = key.char
        guardar_raw(k)
    except AttributeError:
        if key == keyboard.Key.space:
            k = " "
            guardar_raw(" ")
        elif key == keyboard.Key.enter:
            k = "ENTER"
            guardar_raw("\n")
        elif key == keyboard.Key.backspace:
            k = "BACKSPACE"
            borrar_ultimo_raw()
        else:
            k = str(key)

    mensaje = f"tecla tecleada: {k} a las TIEMPO: {now_str()}"
    print(mensaje)
    guardar_log(mensaje)

def on_release(key):
    if key == keyboard.Key.esc:
        print("Saliendo (ESC).")
        guardar_log("=== Programa finalizado ===")
        return False

if __name__ == "__main__":
    print("Escuchando teclas... (ESC para salir)")
    guardar_log("=== Inicio de sesión ===")

    with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
        listener.join()
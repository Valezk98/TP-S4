import { useEffect, useState } from "react"

// Hook que persiste un estado en localStorage: carga el valor guardado al iniciar
// y lo vuelve a escribir en el navegador cada vez que cambia.
export default function useLocalStorage(key, initial) {
  // Inicializador perezoso: se lee localStorage solo una vez al montar.
  // Si no hay nada guardado (o hay un error), se usa el valor inicial.
  const [value, setValue] = useState(() => {
    try {
      const guardado = localStorage.getItem(key)
      return guardado ? JSON.parse(guardado) : initial
    } catch {
      return initial
    }
  })

  // Cada vez que cambia el valor, se actualiza en localStorage para no perder la lista.
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  // Sincroniza el estado con otras pestañas: cuando otra pestaña escribe en la
  // misma clave, este listener actualiza el valor aquí. No se dispara en la pestaña
  // que hizo el cambio, solo en las demás.
  useEffect(() => {
    const sincronizar = (event) => {
      if (event.key === key && event.newValue) {
        try {
          setValue(JSON.parse(event.newValue))
        } catch (err) {
          console.warn(`Error parseando sincronización en key "${key}":`, err)
        }
      }
    }

    window.addEventListener("storage", sincronizar)
    return () => window.removeEventListener("storage", sincronizar)
  }, [key])

  return [value, setValue]
}

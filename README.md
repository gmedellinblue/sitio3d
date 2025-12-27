Kubota 3D – Experiencia Web Inmersiva (Demo Técnica)

Este proyecto es una **demostración técnica y de investigación** enfocada en la implementación de **experiencias web inmersivas en 3D**, inspirada en el sitio *Kubota – Future Cube*.
El objetivo principal es **analizar, recrear y comprender** cómo se construyen este tipo de experiencias interactivas utilizando tecnologías modernas de desarrollo web, específicamente **React**, **Three.js**, **React Three Fiber (R3F)** y **GSAP**.
Este proyecto no es una copia comercial del sitio original, sino un **caso de estudio técnico** con fines académicos y de capacitación.

---

Tecnologías utilizadas

- **React** – Framework principal para la interfaz
- **Vite** – Entorno de desarrollo rápido
- **Three.js** – Motor gráfico 3D
- **@react-three/fiber (R3F)** – Integración de Three.js con React
- **@react-three/drei** – Utilidades y helpers para R3F
- **GSAP** – Animaciones y transiciones
- **Blender** – Creación de modelos 3D y renders pregrabados

---

Actualmente el proyecto implementa:

- Un **cubo 3D interactivo** como elemento central
- Estados de navegación:
  - `idle` (inicio)
  - `intro` (animación de entrada)
  - `section-*` (Food, Water, Resources)
  - `explore-*` (exploración de escenarios)
- Animaciones controladas por estado (no aleatorias)
- Transiciones con **zoom**, **rotaciones horizontales y verticales**
- Navegación por:
  - Botones (anterior, siguiente, menú, explorar)
  - Scroll por páginas (simulación de escenarios)
- Arquitectura pensada para escalar a múltiples secciones y escenarios
Los escenarios complejos (ciudades, campos, etc.) se representan mediante **videos prerenderizados**, mientras que los elementos interactivos utilizan la técnica **2.5D** dentro del cubo.

---

Estructura del proyecto

Requisitos previos
Antes de ejecutar el proyecto asegúrate de tener instalado:

-Node.js (versión 18 o superior)
-npm (incluido con Node.js)

Puedes verificarlo con:
node -v
npm -v

---

Instalación y ejecución
1- Clonar el repositorio

git clone https://github.com/USUARIO/kubota-3d.git
cd kubota-3d

2- Instalar dependencias
npm install

3- Ejecutar en modo desarrollo
npm run dev

Vite mostrará una URL similar a:
http://localhost:5173

Ábrela en tu navegador.

---

Modo de uso básico
Al cargar la página se muestra el estado inicial
Al hacer clic en el cubo se ejecuta la animación de introducción
Se entra automáticamente a una sección
En las secciones:
Botones permiten navegar entre secciones
Explorrar más activa el modo exploración
En modo exploración:
El scroll controla páginas y efectos de zoom
Cada cierto número de páginas ocurre un giro vertical
El botón Volver regresa a la sección principal

Notas importantes
Las animaciones están controladas por estado, no por tiempo libre

El proyecto está pensado para extenderse fácilmente:
Nuevas secciones
Nuevos escenarios
Más páginas por escenario

---

El enfoque principal es investigación técnica y prototipado

---

Referencias
https://threejs.org
https://docs.pmnd.rs/react-three-fiber
https://docs.pmnd.rs/drei
https://greensock.com/gsap/
https://www.kubota.com/futurecube/

---

Proyecto desarrollado como parte de una Residencia Profesional, enfocado en la capacitación en desarrollo web 3D e interfaces inmersivas.

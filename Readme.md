Proyecto Frontend - Práctica Profesionalizante I (React)

Este es el repositorio del frontend para la materia Práctica Profesionalizante I, desarrollado con React, Vite y PrimeReact.

La aplicación consume una API de Flask (desarrollada por separado) para gestionar un "Miniblog", implementando autenticación JWT, gestión de roles y CRUDs completos para Posts y Reviews.

1. Integrantes del Grupo

Nombre Completo: Roy Scheurer

Usuario GitHub: RoyScc



2. Enlace al Backend (API Flask)

El backend de Flask que consume esta aplicación se encuentra en el siguiente repositorio:

➡️ Enlace al Repositorio del Backend: https://github.com/RoyScc/efi-miniblog/tree/dev

3. Guía de Instalación y Ejecución

Para correr este proyecto de frontend, sigue estos pasos:

Pre-requisitos

Tener el Backend Corriendo: Asegúrate de haber clonado, instalado y ejecutado el proyecto de la API de Flask (del enlace anterior). La API debe estar corriendo (generalmente en http://localhost:5000).

Tener Node.js: Asegúrate de tener instalado Node.js (v18 o superior) y npm.

Instalación del Frontend

Clonar el repositorio:

git clone git@github.com:RoyScc/efi-pp-js.git


Entrar a la carpeta del proyecto:

cd efi-pp-js


Instalar dependencias:
(Esto instalará react, primereact, axios, jwt-decode, etc.)

npm install


Ejecutar el proyecto:
(Esto iniciará el servidor de desarrollo de Vite, generalmente en http://localhost:5173)

npm run dev


¡Listo! Abre tu navegador en la URL que te indica la terminal (ej. http://localhost:5173) para ver la aplicación.

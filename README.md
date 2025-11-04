# PachangApp 🏐⚽️🏀

---

## ¡Tu próximo partido está a un clic de distancia!

**PachangApp** es una plataforma web diseñada para conectar a deportistas y organizar partidos de forma fácil y rápida. Piensa en un "BlaBlaCar" o "Tinder" pero enfocado exclusivamente en el deporte: nuestra misión es que nunca te quedes sin jugar.

### El Concepto

¿Cansado de no encontrar gente para un partido de fútbol? ¿Te apetece jugar al pádel pero no tienes con quién? PachangApp soluciona este problema. La plataforma permite a los usuarios:

**Crear Partidos:** Organiza un partido de cualquier deporte, establece la fecha, hora, lugar y las plazas disponibles.

**Buscar y Unirse:** Explora partidos cerca de ti, filtra por deporte o ubicación y apúntate al que más te guste.

**Competir y Conectar:** Conoce a otros jugadores de tu zona, crea una comunidad y sube en el ranking local.

### ✨ Características (en desarrollo)

Este prototipo inicial sienta las bases para las siguientes funcionalidades:

**Inicio:** Vista principal con un resumen de la actividad (partidos cercanos, top jugadores, últimas reseñas).

**Gestión de Partidos:** Funcionalidad completa para crear, buscar y unirse a partidos.

**Perfiles de Usuario:** Cada jugador tendrá su perfil con estadísticas, deportes favoritos y reseñas de otros jugadores.

**Ranking:** Un sistema de clasificación para fomentar la competición amistosa.

**Búsqueda de Canchas:** (Futura funcionalidad) Un directorio para encontrar y reservar instalaciones deportivas.

### 📁 Estructura del Proyecto

Este repositorio está organizado de la siguiente manera:
```
/
|-- src/
|   |-- index.html     # Estructura principal de la web
|   |-- style.css      # Hoja de estilos (CSS)
|   |-- app.js         # Lógica de la aplicación (JavaScript)
|
|-- tests/
|   |-- app.test.js    # Pruebas unitarias para la lógica de la app
|
|-- .gitignore
|-- package.json
|-- README.md          # ¡Estás aquí!

```




---

## 🚀 Flujo de Integración y Despliegue (CI/CD)

Este repositorio está configurado con un pipeline de CI/CD usando **GitHub Actions** para desplegar automáticamente la aplicación web en un bucket de **AWS S3**.

### Estrategia de Ramas (Git Flow)

Se utiliza una metodología Git Flow simplificada:
* `main`: La rama de producción. Lo que está aquí, está desplegado.
* `dev`: La rama de integración. Aquí se fusionan las nuevas características.
* `feature/despliegue-s3`: Ramas temporales para desarrollar nuevas funcionalidades 

### Pipeline de GitHub Actions

El workflow se encuentra en `.github/workflows/deploy.yml` y se puede disparar manualmente (usando `workflow_dispatch`) desde la pestaña "Actions" de GitHub.

El pipeline consta de 3 jobs (tareas) secuenciales:


#### 1. Job: `test` (Instalar y Probar)

1.  **Clona** el repositorio.
2.  **Configura Node.js** (versión 22.x).
3.  **Instala dependencias** usando `npm ci` (una versión rápida y segura de `npm install`).
4.  **Ejecuta Pruebas Unitarias** con `npm test`.
> **Importante:** Si las pruebas de Jest fallan, el job `test` falla, y todo el pipeline se detiene. Los jobs `build` y `deploy` no se ejecutarán.

#### 2. Job: `build` (Construir Artefactos)
Este job solo se ejecuta si `test` ha tenido éxito (`needs: test`). Su trabajo es preparar los archivos para el despliegue.
1.  **Instala dependencias** (`npm ci`).
2.  **Genera Documentación** (`npm run docs`) usando JSDoc, creando una carpeta `docs/`.
3.  **Empaqueta el Sitio Web:** Crea un "artefacto" (un .zip) llamado `static-site` a partir del contenido de la carpeta `src/`.
4.  **Empaqueta la Documentación:** Crea un artefacto llamado `documentation` a partir de la carpeta `docs/`.

#### 3. Job: `deploy` (Desplegar en AWS S3)
Este job solo se ejecuta si `build` ha tenido éxito (`needs: build`). Es el paso de despliegue continuo (CD).
1.  **Configura Credenciales de AWS:** Se autentica de forma segura con AWS usando los Secrets del repositorio (incluyendo el `AWS_SESSION_TOKEN` temporal del laboratorio).
2.  **Descarga los Artefactos:** Descarga los archivos `static-site` y `documentation` creados en el job anterior.
3.  **Sincroniza el Sitio Web:** Sube el contenido del artefacto `static-site` a la **raíz** del bucket S3 (`http://pachangapp01.s3-website-us-east-1.amazonaws.com`).
4.  **Sincroniza la Documentación:** Sube el contenido del artefacto `documentation` a la carpeta `/docs` dentro del bucket S3 (`http://pachangapp01.s3-website-us-east-1.amazonaws.com/docs/index.html`).

### URLs Finales

* **Página Web Principal:** `http://pachangapp01.s3-website-us-east-1.amazonaws.com`
* **Documentación del Código:** `http://pachangapp01.s3-website-us-east-1.amazonaws.com/docs/index.html`

---

### Datos

**Nombre del bucket:** pachangapp01

---

### Imagen de la Web principal del Bucket S3 Activo.

![alt text](image-2.png)
### Imagen del docs/index.html del bucket S3 Activo.
![alt text](image.png)


---

## Ejercicio 2: Ahora vamos a hacer lo mismo pero con una instancia EC2 

## Despliegue en EC2 con GitHub Actions

Este segundo pipeline de CI/CD despliega la misma aplicación web (HTML, CSS, JS) en una instancia **AWS EC2** que ejecuta un servidor web **Nginx**.



### Infraestructura de AWS (EC2)

El destino de este despliegue es una instancia EC2 configurada de la siguiente manera:
* **Instancia:** `t2.micro` ejecutando **Ubuntu Server 22.04 LTS**.
* **Servidor Web:** **Nginx** se instala y se inicia automáticamente en el arranque de la instancia mediante un script de **User Data**.
* **Grupos de Seguridad:** Se configura un grupo de seguridad para permitir el tráfico entrante en:
    * **Puerto 80 (HTTP):** Para que los usuarios puedan ver el sitio web.
    * **Puerto 22 (SSH):** Para que GitHub Actions pueda conectarse y copiar los archivos.
* **Permisos:** El script de User Data también ajusta los permisos de la carpeta `/var/www/html` para permitir que el usuario `ubuntu` (utilizado por GitHub Actions) pueda escribir en ella.

### Pipeline de GitHub Actions (`deploy-ec2.yml`)

Este flujo, definido en `.github/workflows/deploy-ec2.yml`, reutiliza la misma lógica de CI (jobs `test` y `build`) que el despliegue en S3, pero cambia el job de despliegue.

#### 1. Job: `test` (Instalar y Probar)
*Igual que hice en el 1*
Se ejecutan las pruebas unitarias con `npm test`. Si fallan, el pipeline se detiene.

#### 2. Job: `build` (Construir Artefactos)
*Igual que hice en el 1*
Se generan y empaquetan los tres artefactos: `static-site` (de `src/`), `documentation` (de `docs/`) e `images-folder` (de `images/`).

#### 3. Job: `deploy` (Desplegar en AWS EC2)
Este job se ejecuta solo si `build` ha tenido éxito (`needs: build`).
1.  **Descarga los Artefactos:** Recupera los tres artefactos (`static-site`, `documentation`, `images-folder`) del job anterior.
2.  **Configura SSH:** Carga la clave privada (`EC2_KEY`) en el agente SSH de la máquina virtual de GitHub. Esto permite que los siguientes comandos se autentiquen en la instancia EC2.
3.  **Copia los Archivos (SCP/SSH):**
    * Se conecta a la instancia EC2 usando `ssh` y `scp`.
    * Crea las carpetas `/docs` e `/images` si no existen.
    * Copia el contenido de `static-site` a `/var/www/html/` (la raíz del servidor Nginx).
    * Copia el contenido de `documentation` a `/var/www/html/docs/`.
    * Copia el contenido de `images-folder` a `/var/www/html/images/`.

### Secrets Requeridos (para EC2)

Además de los secrets de AWS del laboratorio este workflow requiere los siguientes secrets de GitHub:
* `EC2_HOST`: El DNS público de la instancia EC2 (ej. `ec2-98-89-44-18.compute-1.amazonaws.com`).
* `EC2_USER`: El usuario para la conexión SSH (`ubuntu`).
* `EC2_KEY`: La clave SSH privada (formato `.pem`) necesaria para autenticarse esta en el apartado de datos ya que es muy larga.

### URLs Finales

* **Página Web Principal:** `http://ec2-98-89-44-18.compute-1.amazonaws.com/`
* **Documentación del Código:** `http://ec2-98-89-44-18.compute-1.amazonaws.com/docs/index.html`



### Web
![alt text](image-3.png)

### Documentacion
![alt text](image-4.png)




---

## Datos
**EC2_USER:** ubuntu
**PEM:** 
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAxBQy4G+L72NjqBZbrkDob3VLcNfUtsScJokNuva1dLJsro59
yMqhPhx3e1n58F80n3Py9eMLWB3WA9RJTSbvmjZTHKhXMB3MdZBtVJLbFkIOo9li
kl1GVppymTs0mgmAtUzxeuTRcSuTYlFFRIMIOYir2EUSZEDKKeSKLS1TPDVvnJjI
47rdeF4WJwSa9T56HDAE26CY9BjDe6+0M7VfXfD6a2aGtNWiiJT7TZiVrINkAF1w
3NfK8pMBVyjgCHOC+yCWE01sI6y3d5DWKjmxVkvqfnpwh1NAPOOJCXdzPmQmb9w4
+V3/6dhlQ/8yRFlhQAg5Kg5tx7/Mn4EBMgocxQIDAQABAoIBAQCGrfUQMa4lfNgb
wVexxgWhYSizVpxV+Y/j7CmRLRoQEOoTr+33+C5usjDjejbyAwLrL0JH4G6PVNcG
hE7g/oh/HSdTPNG+TAl/Cvf9qm1vyWmy44MQU58XpzhlxcPotfRBE5ueNQMjP7IZ
SwdP+sywcA7RGwh58gKqab77LvHIHRwC4RdlodGKfiK3AUp4t1MwmmdfIj5s+3cG
FrsKkKRSW1YPDcuX9EXHN0PoFwlpla7DW0rxafe/vYCGAeMDGZj4lA5/nTUIfqqU
Ae8pg1KElf6CwrP6wfuLvlFTg12z32fKqEI8s4ygmVHzCN5UR7drXVrhr1jZJZME
TOmWS6qVAoGBAOmZC8GN0ntJ1KRenCZxvD3HbVJpolZ5lxfYhsJ3XYRAHKLcj7/6
KOdU24eLkfvwb1adLbTxA/JGf9Cwpz1QAqaBc7loH6lwXMYg/rbiwS+SiYHpwof4
GoU5SI/eMQ3v3sFhFIrXtH1la6TO26k7orhRrW/WY0k2FV7gPpDy1WG7AoGBANbi
CuRBC/AH2xX0RB5DxSNTZ1XtHPRzoyNszhgE1NbxOP5ml8t6sO4GIDicdTQ5WF5A
Jgk55inLCJURhZrjug7gzB4FEDf3yoOakqxAYz44hZddEHNhzL/2nIInEX/xeEnD
96Iu79JrL60Rj4Mc76sDFcMSJy88KM3bpj7vDVN/AoGBAMoFaBtecdfaBCKbB+Rf
nHK5VBxf6ttqkHc49WKdJK1JXPqkUVWwHUvjIXBaDkiaqU9445yGi+kte0CaZigq
WAB0GAcSu78nw7Q9uMul03k2++D0rx40PYtV/SEfAcGR303SjZd98UQ5QBzqISJ8
xr8tNBdyi683LMg+mx10RYIdAoGBAJGf8v2pT2vGByWjup5AE1PTbA6BeMP5si+J
x0njzFI2fAd8g5a0eT92C1QSRCO2UTregmhyQpdEL3bGvyKu/iKjGfGmQM2NMkNp
98iggiFisLZZrZJkTxwxBvP1ghiRDpH/Ks1Qvdp+JXtGkVmrvIjKuG7Q2JlcTdLk
7o9r9j4FAoGAZnT1n5tWlux2hfKzXhx3DoJqEmJsipVgAnKEtV/dzJqE58ROkJ1h
BapZMXQrpyO3iaC0bnbdeY3Cp0owpxHSsU/2V/BA92kFzTfH6Qm1Xu/ZQiLoTZ/s
kTcWHQFvT/uKT6K2RolamrKVFrf9VDvJUAQuHqEvJvlmkndzcgmm/7c=
-----END RSA PRIVATE KEY-----

```

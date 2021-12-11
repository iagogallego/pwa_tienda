# FRONTEND IMPLEMENTADO CON ANGULAR

Descripción de funcionalidades del frontend.

## EJECUCIÓN DEL PROYECTO

### Inicialización del frontend

Se procederá a la descarga de todas las dependencias del proyecto mediante:

```bash
npm install
```

Para ejecutar el proyecto, usaremos:
```bash
ng serve -o
```

## ANEXOS

### Descarga de la dependencia de Angular y creación de un proyecto

Debemos descargar la dependencia de Angular para comenzar el proyecto:
```bash
npm i @angular/cli -g
```

Para la inicialización del frontend se ha partido de una aplicación genérica de Angular creada a partir de:

```bash
ng new frontendAngular
```

### Desarrollo del frontend

Se crearon componentes (para las vistas) o servicios (para las llamadas a contratos) dentro del proyecto mediante:

```bash
ng generate component components/nft
ng generate service services/nft
```

Se partió de una hoja de estilos basada en BootStrap, BootSwatch, cuyo archivo CSS es añadido en el fichero de inicio angular.json:

```bash
npm i bootswatch
```
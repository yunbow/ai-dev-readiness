# Contribuir a AI-Driven Development Readiness

Gracias por su interés en contribuir. Las contribuciones a este proyecto son bienvenidas.

## Cómo contribuir

### Informes de errores y solicitudes de funciones

- Utilice [GitHub Issues](https://github.com/yunbow/ai-dev-readiness/issues)
- Incluya los pasos de reproducción, el comportamiento esperado y el comportamiento real en la medida de lo posible

### Pull Requests

1. Haga un Fork del repositorio
2. Cree una rama de trabajo
3. Realice los cambios
4. Haga commit con un mensaje que describa claramente el cambio
5. Abra un Pull Request

### Configuración del entorno de desarrollo

```bash
cd app
npm ci
npm run dev
```

### Antes de enviar

Antes de enviar un Pull Request, asegúrese de que todo lo siguiente se ejecute correctamente.

```bash
cd app           # Ir al directorio de la app
npm run build   # Verificación de tipos + build
npm run test    # Pruebas unitarias (Vitest)
```

Si modifica la lógica de diagnóstico (`app/src/domain/assessment/`), verifique la coherencia con la especificación en `docs/design/01-scoring-spec.md` y añada pruebas unitarias según sea necesario.

### Internacionalización (i18n)

Los textos de la interfaz se gestionan en `app/src/i18n/locales/{ja,en,zh-CN,ko,es}.json`. Al añadir o cambiar texto, actualice los 5 archivos de idioma al mismo tiempo. El japonés (`ja.json`) es la referencia para la traducción.

## Código de conducta

Por favor, contribuya con respeto, de forma constructiva y de manera que este proyecto siga siendo acogedor para todos.

---

Languages: [English](../../../CONTRIBUTING.md) | [日本語](../ja/CONTRIBUTING.md) | [简体中文](../zh-CN/CONTRIBUTING.md) | [한국어](../ko/CONTRIBUTING.md) | Español

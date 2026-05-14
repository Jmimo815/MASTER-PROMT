# Flujo de Procesos: PROMT MASTER SENA PMS

Este documento describe la arquitectura lógica y el flujo de datos de la aplicación mediante diagramas de flujo.

---

## 1. Flujo de Experiencia del Usuario (UX)

Describe el camino que sigue el usuario desde que abre la aplicación hasta que obtiene su prompt refinado.

```mermaid
graph TD
    A[Inicio: Usuario abre PMS] --> B[Entrada de Datos]
    B --> C{¿Qué desea hacer?}
    
    C -->|Analizar| D[Click en 'Analizar Precisión']
    C -->|Refinar| E[Click en 'Aplicar Mejora']
    
    D --> F[Validación de Campos]
    F --> G[Llamada a Motor Gemini]
    G --> H[Visualización de Dashboard de Análisis]
    H --> I[Usuario revisa puntaje y sugerencias]
    I --> E
    
    E --> J[Llamada a Motor Gemini de Refinamiento]
    J --> K[Visualización de Prompt Refinado]
    K --> L[Click en 'Copiar Prompt']
    L --> M[Fin: Prompt listo para usar en chat de IA]
```

---

## 2. Flujo de Procesamiento del Motor de IA (Backend-Logic)

Detalla cómo se estructuran las peticiones hacia el modelo **Gemini 3-Flash**.

```mermaid
flowchart LR
    subgraph Entrada
    T[Tarea]
    R[Rol]
    F[Formato]
    C[Contexto]
    Te[Técnica]
    end

    Entrada --> P[Constructor de Prompt del Sistema]
    
    subgraph Procesamiento_IA
    P --> |Análisis| A_IA[IA evalúa coherencia y completitud]
    P --> |Refinamiento| R_IA[IA aplica técnica estratégica: CoT, Zero, Few]
    end
    
    A_IA --> Res_A[JSON: Precision, Feedbacks, Suggestions]
    R_IA --> Res_R[JSON: Content, Explanation]
```

---

## 3. Estados de la Interfaz de Usuario (UI States)

Muestra cómo cambia la pantalla según la interacción del usuario y el tema seleccionado.

```mermaid
stateDiagram-v2
    [*] --> Standby: App Cargada
    
    state Standby {
        [*] --> ModoOscuro
        ModoOscuro --> ModoClaro: Click Toggle (Toggle con Blur)
        ModoClaro --> ModoOscuro: Click Toggle (Toggle con Blur)
    }
    
    Standby --> Procesando: Al hacer Click en botones
    Procesando --> Resultados: Respuesta de IA exitosa
    Resultados --> Standby: Al limpiar inputs
    
    state Resultados {
        AnalysisDashboard: Muestra circular de precisión
        RefinedOutput: Muestra prompt con resaltado sintáctico
    }
```

---

## 4. Descripción de Componentes Clave

| Componente | Función |
| :--- | :--- |
| **Input Handler** | Captura Tarea, Rol, Formato y Contexto. |
| **Technique Selector** | Permite alternar entre arquitecturas de prompting. |
| **Gemini Service** | Módulo de comunicación con el modelo `gemini-3-flash-preview`. |
| **Animation Engine** | Controla las transiciones de `motion` (blur, fade, scale). |
| **Clipboard Sync** | Gestiona el copiado de texto al portapapeles del sistema. |

---
*Documento generado por el Sistema de Meta-Ingeniería v2.4*

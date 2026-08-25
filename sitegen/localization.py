"""Spanish counterparts and the English legal page.

The public URL structure stays stable: every English path has the same path
under ``/es``.  Copy is authored here rather than machine-translated at
runtime so metadata, headings and product language remain deliberate.
"""

from copy import deepcopy


BASE = "https://develo.software"


def _es_path(path: str) -> str:
    return "/es/" if path == "/" else "/es" + path


def _crumbs(path: str, current: str, parent: tuple[str, str] | None = None):
    items = []
    if parent:
        items.append((parent[0], BASE + _es_path(parent[1])))
    items.append((current, BASE + _es_path(path)))
    return items


def _links(items):
    return {"t": "links", "items": [
        {"label": label, "href": href, "note": note}
        for label, href, note in items
    ]}


def _grid(items, cols=3):
    return {"t": "grid", "cols": cols, "items": [
        {"title": title, "body": body, **({"href": href} if href else {})}
        for title, body, href in items
    ]}


def _service(
    path,
    title,
    description,
    h1,
    intro,
    needs,
    capabilities,
    method,
    related,
    cta,
    faq=None,
):
    faq = faq or []
    schema = ["service"] + (["faq"] if faq else [])
    sections = [
        {"t": "h2", "text": "Qué resolvemos"},
        {"t": "list", "items": needs},
        {"t": "h2", "text": "Capacidades"},
        _grid(capabilities, 3),
        {"t": "h2", "text": "Cómo lo implementamos"},
        {"t": "p", "html": method},
    ]
    if faq:
        sections += [{"t": "h2", "text": "Preguntas frecuentes"}, {"t": "faq"}]
    sections += [
        {"t": "h2", "text": "Soluciones relacionadas"},
        _links(related),
        {"t": "cta", "title": cta[0], "body": cta[1]},
    ]
    return {
        "path": _es_path(path),
        "lang": "es",
        "title": title,
        "description": description,
        "h1": h1,
        "intro": intro,
        "crumbs": _crumbs(path, h1, ("Soluciones", "/solutions/")),
        "schema": schema,
        "faq": [{"q": question, "a": answer} for question, answer in faq],
        "sections": sections,
    }


SERVICE_PAGES = [
    _service(
        "/solutions/custom-software-development/",
        "Desarrollo de Software a Medida para Empresas | Develo",
        "Develo diseña y desarrolla software a medida, plataformas SaaS, backoffices y productos multitenant altamente escalables para empresas.",
        "Desarrollo de Software a Medida",
        "Diseñamos productos digitales alrededor de la operación real de cada empresa: desde el descubrimiento y la arquitectura hasta producción, medición y evolución continua.",
        [
            "Procesos críticos fragmentados entre planillas, herramientas aisladas y tareas manuales",
            "Productos digitales que deben integrarse con sistemas, usuarios y reglas existentes",
            "Plataformas multitenant y productos altamente escalables con seguridad desde el diseño",
        ],
        [
            ("Descubrimiento", "Alcance, riesgos, flujos, métricas y prioridades antes de construir.", None),
            ("Arquitectura", "APIs, datos, seguridad, permisos e infraestructura preparados para crecer.", None),
            ("Producto", "Interfaces claras, backoffices operables y experiencias consistentes.", None),
            ("Entrega", "PoC, MVP e iteraciones cortas con validación de negocio.", None),
            ("Escala", "Multi-tenancy, observabilidad, rendimiento y automatización de despliegues.", None),
            ("Evolución", "Soporte, métricas y mejoras sobre evidencia de uso real.", None),
        ],
        "Trabajamos por etapas verificables: exploración de la necesidad, diseño de la prueba de concepto, desarrollo del MVP y mantenimiento. Cada decisión técnica se vincula con un resultado operativo.",
        [
            ("Integraciones API", "/solutions/api-integrations/", "Conecte el producto con su ecosistema"),
            ("Inteligencia artificial", "/solutions/artificial-intelligence/", "Incorpore IA donde genere valor medible"),
            ("Casos de éxito", "/case-studies/", "Implementaciones reales de Develo"),
        ],
        ("Construyamos el producto correcto", "Cuéntenos el problema, los usuarios y las restricciones. Le propondremos un primer paso concreto."),
    ),
    _service(
        "/solutions/artificial-intelligence/",
        "Desarrollo de Inteligencia Artificial para Empresas | Develo",
        "Aplicaciones de inteligencia artificial, RAG, LLMs, automatización y modelos sobre Amazon Bedrock integrados con datos y sistemas de negocio.",
        "Inteligencia Artificial para Empresas",
        "Convertimos modelos de IA en sistemas útiles, seguros y medibles que trabajan con el conocimiento, las herramientas y las reglas de su organización.",
        [
            "Conocimiento distribuido que cuesta encontrar, mantener y aplicar",
            "Decisiones o tareas repetitivas que requieren contexto de negocio",
            "Prototipos de IA que necesitan seguridad, evaluación y operación en producción",
        ],
        [
            ("RAG", "Respuestas sustentadas en conocimiento actualizado y fuentes verificables.", None),
            ("LLMs", "Selección, evaluación y fine-tuning cuando mejora resultados medibles.", None),
            ("Agentes", "Uso de herramientas, MCP y supervisión humana para ejecutar flujos.", None),
            ("Bedrock", "Modelos fundacionales y controles gestionados sobre AWS.", None),
            ("Evaluación", "Calidad, seguridad, latencia y costo observados de extremo a extremo.", None),
            ("Integración", "IA conectada con APIs, datos, canales y permisos existentes.", None),
        ],
        "Comenzamos con un caso de uso y una métrica. Diseñamos el contexto, evaluamos modelos y fuentes, incorporamos guardrails y desplegamos una arquitectura observable sobre AWS.",
        [
            ("Agentes de IA", "/solutions/ai-agents/", "Agentes gobernados que usan herramientas"),
            ("d-ialog", "/solutions/d-ialog/", "IA conversacional para operaciones de clientes"),
            ("Tecnologías", "/technologies/", "AWS, Bedrock, MCP, RAG y fine-tuning"),
        ],
        ("Lleve la IA a producción", "Definamos un caso de uso concreto, una evaluación y un camino seguro hacia producción."),
    ),
    _service(
        "/solutions/ai-agents/",
        "Desarrollo de Agentes de IA para Empresas | Develo",
        "Agentes de inteligencia artificial con herramientas, MCP, guardrails, permisos y supervisión humana para automatizar operaciones empresariales.",
        "Agentes de Inteligencia Artificial para Empresas",
        "Construimos agentes que no solo responden: consultan sistemas, aplican reglas y ejecutan acciones autorizadas con trazabilidad completa.",
        [
            "Operaciones que requieren consultar varias fuentes antes de actuar",
            "Equipos saturados por solicitudes repetitivas y coordinación manual",
            "Necesidad de automatizar sin perder permisos, control ni evidencia",
        ],
        [
            ("Herramientas y APIs", "Acciones acotadas sobre sistemas internos y externos.", None),
            ("MCP", "Catálogos de herramientas con contratos y contexto explícitos.", None),
            ("Guardrails", "Validaciones, límites y políticas antes de cada ejecución.", None),
            ("Supervisión humana", "Aprobación o escalamiento cuando el riesgo lo exige.", None),
            ("Memoria y RAG", "Contexto confiable, conocimiento dinámico y fuentes visibles.", None),
            ("Observabilidad", "Trazas, métricas, evaluaciones, latencia y costo por flujo.", None),
        ],
        "Modelamos cada agente como un sistema gobernado: identidad, permisos, herramientas, memoria, validaciones y estados de error. Probamos primero los límites y recién después ampliamos su autonomía.",
        [
            ("Develo Multi-Agent", "/solutions/develomultiagent/", "Orquestación de equipos de agentes especializados"),
            ("Integraciones API", "/solutions/api-integrations/", "Herramientas conectadas con sistemas reales"),
            ("Intervan", "/case-studies/intervan/", "Copiloto y backoffice escalables para más de 1.000 usuarios"),
        ],
        ("Diseñemos un agente que pueda operar", "Partamos de una tarea delimitada, sus permisos y el resultado que debe producir."),
        [
            ("¿Qué diferencia a un agente de IA de un chatbot?", "Un agente puede usar herramientas, consultar sistemas y ejecutar pasos para alcanzar un objetivo; un chatbot tradicional se limita principalmente a responder."),
            ("¿Cómo se controlan sus acciones?", "Mediante permisos mínimos, guardrails, confirmaciones explícitas, supervisión humana y trazabilidad de cada herramienta utilizada."),
            ("¿Puede integrarse con nuestros sistemas?", "Sí. Se conecta mediante APIs, MCP y adaptadores específicos, respetando las reglas y credenciales de cada organización."),
        ],
    ),
    _service(
        "/solutions/customer-service-automation/",
        "Automatización de Atención al Cliente con IA | Develo",
        "Automatice atención al cliente con inteligencia artificial, conocimiento dinámico, integraciones y escalamiento humano en todos sus canales.",
        "Automatización de Atención al Cliente con IA",
        "Unificamos conversaciones, conocimiento y operación para resolver más consultas con consistencia, fuentes confiables y derivación humana cuando corresponde.",
        [
            "Volumen creciente de consultas repetitivas en varios canales",
            "Respuestas inconsistentes o difíciles de actualizar entre equipos",
            "Poca visibilidad sobre demanda, calidad, fuentes y oportunidades de mejora",
        ],
        [
            ("Omnicanal", "WhatsApp, marketplaces y canales digitales en una misma operación.", None),
            ("Conocimiento", "RAG con documentos, videos, fuentes y reindexación automática.", None),
            ("Escalamiento", "Derivación a personas con contexto y reglas configurables.", None),
            ("Métricas", "Cobertura, respuesta, tiempos, temas y documentación entregada.", None),
            ("Backoffice", "Conversaciones, usuarios, permisos, configuración y reportes.", None),
            ("Acciones", "Consultas y operaciones seguras sobre sistemas mediante MCP.", None),
        ],
        "Mapeamos consultas, fuentes y criterios de derivación. Luego validamos respuestas, integramos los canales y habilitamos un backoffice para que el equipo gestione conocimiento, configuración y métricas.",
        [
            ("d-ialog", "/solutions/d-ialog/", "Producto de IA conversacional de Develo"),
            ("IA para WhatsApp", "/solutions/ai-for-whatsapp/", "Atención automatizada en WhatsApp"),
            ("IA para marketplaces", "/solutions/marketplace-automation/", "Consultas y operaciones de ecommerce"),
        ],
        ("Mejore su operación de atención", "Identifiquemos las consultas de mayor volumen y una métrica concreta para el primer lanzamiento."),
    ),
    _service(
        "/solutions/ai-for-whatsapp/",
        "Agentes de IA para Atención por WhatsApp | Develo",
        "Automatice la atención por WhatsApp con agentes de IA, conocimiento propio, integraciones, fuentes verificables y derivación a operadores humanos.",
        "Automatice la Atención por WhatsApp con IA",
        "Creamos agentes de WhatsApp que responden con conocimiento de la empresa, consultan sistemas y transfieren la conversación con todo su contexto cuando hace falta una persona.",
        [
            "Consultas repetitivas que ocupan gran parte del tiempo del equipo",
            "Picos de demanda fuera del horario de atención o en campañas",
            "Información distribuida que produce respuestas lentas o inconsistentes",
        ],
        [
            ("WhatsApp Business", "Integración mediante las APIs oficiales de Meta.", None),
            ("Respuesta con fuentes", "RAG sobre documentos y conocimiento actualizado.", None),
            ("Derivación humana", "Escalamiento con historial, intención y datos relevantes.", None),
            ("Integraciones", "CRM, ERP, ecommerce, tickets y sistemas internos.", None),
            ("Métricas", "Volumen, resolución, tiempos, temas y calidad de respuesta.", None),
            ("Gobierno", "Permisos, guardrails, auditoría y protección de datos.", None),
        ],
        "Definimos intenciones, fuentes, tono y criterios de escalamiento. Probamos la precisión con conversaciones reales, conectamos WhatsApp mediante Meta y entregamos métricas para mejorar continuamente.",
        [
            ("d-ialog", "/solutions/d-ialog/", "Conversaciones, conocimiento, métricas y configuración"),
            ("Atención al cliente", "/solutions/customer-service-automation/", "Automatización omnicanal con IA"),
            ("Integraciones API", "/solutions/api-integrations/", "Conecte el agente con su operación"),
        ],
        ("Automatice WhatsApp con control", "Revisemos su volumen, sus fuentes y el primer conjunto de consultas a resolver."),
        [
            ("¿La solución usa la API oficial de WhatsApp?", "Sí. Implementamos la integración mediante WhatsApp Business y las APIs oficiales de Meta."),
            ("¿Puede responder con información de nuestra empresa?", "Sí. La base de conocimiento dinámica utiliza documentos y fuentes autorizadas, con referencias visibles cuando corresponde."),
            ("¿Qué ocurre cuando la IA no debe responder?", "La conversación se deriva a un operador humano con contexto, historial y el motivo del escalamiento."),
            ("¿Se puede integrar con un CRM o sistema de tickets?", "Sí. Conectamos APIs y eventos para consultar datos, crear casos y mantener la trazabilidad."),
        ],
    ),
    _service(
        "/solutions/marketplace-automation/",
        "Automatización de Marketplaces y Ecommerce con IA | Develo",
        "Automatice preguntas, catálogo y operaciones de marketplaces y ecommerce con IA conectada a productos, stock, pedidos y políticas comerciales.",
        "Automatización de Marketplaces y Ecommerce con IA",
        "Conectamos IA, catálogo y operación para responder compradores con precisión y reducir tareas manuales sin perder control comercial.",
        [
            "Preguntas repetidas sobre productos, compatibilidad, stock y entrega",
            "Catálogos extensos que cambian entre canales y requieren respuestas consistentes",
            "Operaciones manuales entre marketplace, ecommerce, ERP y atención al cliente",
        ],
        [
            ("Preguntas de compradores", "Respuestas basadas en catálogo, políticas y contexto de publicación.", None),
            ("Catálogo", "Normalización de atributos, contenido y conocimiento de producto.", None),
            ("Pedidos", "Consulta de estado y automatización de flujos posventa.", None),
            ("Integraciones", "Marketplaces, ecommerce, ERP, CRM y logística.", None),
            ("Supervisión", "Reglas comerciales y revisión humana para casos sensibles.", None),
            ("Analítica", "Temas, cobertura, conversión y oportunidades del catálogo.", None),
        ],
        "Partimos de las publicaciones y preguntas reales, identificamos fuentes confiables y reglas comerciales, y conectamos la automatización con los sistemas que contienen stock, pedidos y clientes.",
        [
            ("IA para Mercado Libre", "/solutions/ai-for-mercado-libre/", "Automatización especializada para vendedores"),
            ("Integraciones API", "/solutions/api-integrations/", "Ecosistemas conectados de ecommerce"),
            ("Distriland", "/case-studies/tecnoland-distriland/", "Experiencia digital integrada para ecommerce"),
        ],
        ("Convierta consultas en una operación escalable", "Seleccione un canal, un catálogo y una métrica para validar el impacto rápidamente."),
    ),
    _service(
        "/solutions/ai-for-mercado-libre/",
        "Automatización con IA para Vendedores de Mercado Libre | Develo",
        "Automatice preguntas de compradores en Mercado Libre con IA conectada al catálogo, las publicaciones y las reglas comerciales de su empresa.",
        "Automatice Preguntas de Mercado Libre con IA",
        "Respondemos preguntas de compradores con información específica de cada publicación, políticas del vendedor y supervisión para proteger la calidad comercial.",
        [
            "Alto volumen de preguntas antes de la compra",
            "Respuestas que requieren cruzar publicaciones, variantes y políticas",
            "Demoras que afectan la experiencia del comprador y la conversión",
        ],
        [
            ("Contexto de publicación", "Producto, atributos, variantes y condiciones en cada respuesta.", None),
            ("Políticas", "Reglas comerciales, tono y límites configurables.", None),
            ("Catálogo", "Conocimiento dinámico sincronizado con fuentes autorizadas.", None),
            ("Escalamiento", "Revisión humana ante incertidumbre o casos sensibles.", None),
            ("Integración", "APIs de Mercado Libre y sistemas internos del vendedor.", None),
            ("Métricas", "Volumen, cobertura, tiempos y temas sin respuesta.", None),
        ],
        "Analizamos preguntas históricas y publicaciones, definimos reglas de respuesta y validamos la precisión antes de automatizar. La solución conserva registro de fuentes, decisiones y escalamiento.",
        [
            ("Automatización de marketplaces", "/solutions/marketplace-automation/", "Una estrategia para todos sus canales"),
            ("d-ialog", "/solutions/d-ialog/", "Operación conversacional y métricas"),
            ("Integraciones API", "/solutions/api-integrations/", "Conexión con catálogo y sistemas"),
        ],
        ("Responda más rápido y con precisión", "Evaluemos sus preguntas reales y definamos una prueba controlada sobre un conjunto de publicaciones."),
    ),
    _service(
        "/solutions/api-integrations/",
        "Desarrollo de Integraciones API y Sistemas | Develo",
        "Integramos APIs, CRM, ERP, ecommerce, marketplaces, datos y sistemas internos con arquitecturas seguras, observables y escalables.",
        "Desarrollo de Integraciones API y Sistemas",
        "Conectamos productos y operaciones para que los datos fluyan con contratos claros, seguridad, trazabilidad y tolerancia a fallos.",
        [
            "Información duplicada o inconsistente entre sistemas",
            "Tareas manuales para mover datos y coordinar procesos",
            "Integraciones frágiles sin monitoreo, reintentos ni responsables claros",
        ],
        [
            ("APIs", "Diseño e implementación de contratos REST, eventos y webhooks.", None),
            ("Sistemas empresariales", "CRM, ERP, tickets, pagos, logística y backoffices.", None),
            ("Ecommerce", "Tiendas, marketplaces, catálogo, stock y pedidos.", None),
            ("Datos", "Validación, transformación, identidad y consistencia.", None),
            ("Seguridad", "Autenticación, autorización, secretos y mínimo privilegio.", None),
            ("Operación", "Observabilidad, reintentos, alertas y auditoría.", None),
        ],
        "Definimos el sistema responsable de cada dato, los contratos y los escenarios de falla. Implementamos pruebas de integración, idempotencia, monitoreo y un despliegue gradual.",
        [
            ("Software a medida", "/solutions/custom-software-development/", "Productos conectados desde su arquitectura"),
            ("Agentes de IA", "/solutions/ai-agents/", "Herramientas seguras para agentes"),
            ("Tecnologías", "/technologies/", "Infraestructura y patrones de implementación"),
        ],
        ("Conectemos su operación", "Mapeemos los sistemas, eventos y datos críticos para diseñar una integración mantenible."),
    ),
]


SPANISH_PAGES = [
    {
        "path": "/es/solutions/",
        "lang": "es",
        "title": "Soluciones de Software e Inteligencia Artificial | Develo",
        "description": "Explore software a medida, agentes de IA, automatización de atención, WhatsApp, marketplaces, integraciones y productos de Develo.",
        "h1": "Soluciones de Software e Inteligencia Artificial",
        "intro": "Diseñamos y operamos productos digitales que resuelven problemas concretos: software a medida, inteligencia artificial y automatización conectada con la realidad de cada empresa.",
        "crumbs": _crumbs("/solutions/", "Soluciones"),
        "schema": ["service"],
        "sections": [
            _grid([
                ("Software a medida", "Plataformas, SaaS, backoffices y productos altamente escalables.", "/solutions/custom-software-development/"),
                ("Inteligencia artificial", "RAG, LLMs, Amazon Bedrock y automatización aplicada.", "/solutions/artificial-intelligence/"),
                ("Agentes de IA", "Agentes con herramientas, MCP, permisos y supervisión humana.", "/solutions/ai-agents/"),
                ("Atención al cliente", "Conversaciones, conocimiento, métricas y escalamiento.", "/solutions/customer-service-automation/"),
                ("IA para WhatsApp", "Atención automatizada mediante las APIs oficiales de Meta.", "/solutions/ai-for-whatsapp/"),
                ("Marketplaces", "Preguntas, catálogo y operaciones conectadas con ecommerce.", "/solutions/marketplace-automation/"),
                ("IA para Mercado Libre", "Respuestas específicas por publicación y reglas comerciales.", "/solutions/ai-for-mercado-libre/"),
                ("Integraciones API", "CRM, ERP, ecommerce, datos y sistemas internos conectados.", "/solutions/api-integrations/"),
            ], 4),
            {"t": "h2", "text": "Productos Develo"},
            _grid([
                ("d-ialog", "IA conversacional para atención y operaciones de clientes.", "/solutions/d-ialog/"),
                ("Develo Multi-Agent", "Orquestación de equipos de agentes especializados.", "/solutions/develomultiagent/"),
            ], 2),
            {"t": "callout", "title": "Una arquitectura, no una demostración aislada", "body": "Cada solución incluye seguridad, integración, observabilidad y una forma clara de medir calidad, costo e impacto."},
            {"t": "cta", "title": "¿Qué necesita resolver?", "body": "Cuéntenos el problema y le propondremos el alcance más pequeño que permita validar valor real."},
        ],
    },
    {
        "path": "/es/solutions/d-ialog/",
        "lang": "es",
        "title": "Agentes de IA para WhatsApp y Atención al Cliente | d-ialog",
        "description": "d-ialog es la plataforma de IA conversacional de Develo para WhatsApp, marketplaces y atención al cliente con backoffice, métricas y MCP.",
        "h1": "Automatice la Atención con Agentes de Inteligencia Artificial",
        "intro": "d-ialog by Develo combina conversaciones, conocimiento dinámico, automatización y supervisión humana en una plataforma multitenant preparada para operar a escala.",
        "crumbs": _crumbs("/solutions/d-ialog/", "d-ialog", ("Soluciones", "/solutions/")),
        "schema": ["software", "faq"],
        "software": {
            "name": "d-ialog",
            "description": "Plataforma de IA conversacional para atención al cliente y operaciones digitales.",
            "features": [
                "Conversaciones omnicanal", "Base de conocimiento dinámica", "Métricas configurables",
                "Backoffice multitenant", "Herramientas MCP", "Supervisión humana",
            ],
        },
        "faq": [
            {"q": "¿Qué es d-ialog?", "a": "Es la plataforma de IA conversacional de Develo para automatizar atención y operaciones con conocimiento, métricas y control humano."},
            {"q": "¿Puede conectarse con sistemas de la empresa?", "a": "Sí. Integra APIs y herramientas MCP con permisos, confirmaciones y trazabilidad."},
            {"q": "¿Cómo se actualiza el conocimiento?", "a": "El backoffice permite cargar documentos y videos, administrar fuentes y reindexar la base sin depender de desarrollo."},
            {"q": "¿Está preparado para múltiples organizaciones?", "a": "Sí. Su arquitectura multitenant aísla usuarios, reglas, configuración y conocimiento por organización."},
        ],
        "sections": [
            {"t": "product_showcase"},
            {"t": "h2", "text": "Una operación conversacional completa"},
            _grid([
                ("Conversaciones", "Bandeja operativa, búsqueda, filtros, fuentes y derivación humana.", None),
                ("Conocimiento", "Documentos, videos, RAG y actualización dinámica desde el backoffice.", None),
                ("Métricas", "Volumen, cobertura, tiempos, calidad, temas y documentación entregada.", None),
                ("Configuración", "Usuarios, roles, organizaciones, reglas, canales y reportes.", None),
                ("MCP", "Consultas y acciones gobernadas sobre sistemas de negocio.", None),
                ("Escala", "Arquitectura multitenant y productos altamente escalables sobre AWS.", None),
            ], 3),
            {"t": "h2", "text": "Canales y casos de uso"},
            _grid([
                ("WhatsApp", "Atención mediante las APIs oficiales de Meta y escalamiento con contexto.", "/solutions/ai-for-whatsapp/"),
                ("Marketplaces", "Preguntas, catálogo, pedidos y políticas comerciales.", "/solutions/marketplace-automation/"),
                ("Copilotos internos", "Conocimiento, procedimientos y acciones para equipos empresariales.", "/case-studies/intervan/"),
            ], 3),
            {"t": "h2", "text": "Diseñado para control y mejora continua"},
            {"t": "list", "items": [
                "Fuentes visibles y respuestas evaluables",
                "Guardrails, permisos y confirmación para acciones sensibles",
                "Supervisión humana y trazabilidad de extremo a extremo",
                "Configuración operable sin depender de cambios de código",
                "Observabilidad de calidad, latencia, costo y uso",
            ]},
            {"t": "h2", "text": "Preguntas frecuentes"},
            {"t": "faq"},
            {"t": "h2", "text": "Casos de éxito"},
            _links([
                ("Intervan", "/case-studies/intervan/", "Copiloto y backoffice para más de 1.000 usuarios"),
                ("Tecnoland y Distriland", "/case-studies/tecnoland-distriland/", "Experiencia digital conectada para servicios y ecommerce"),
            ]),
            {"t": "cta", "title": "Vea cómo d-ialog puede operar en su empresa", "body": "Revisemos canales, fuentes, integraciones y una primera métrica de éxito."},
        ],
    },
    {
        "path": "/es/solutions/develomultiagent/",
        "lang": "es",
        "title": "Plataforma de Orquestación Multiagente | Develo Multi-Agent",
        "description": "Develo Multi-Agent coordina agentes de IA especializados con herramientas, memoria, permisos, evaluación, observabilidad y supervisión humana.",
        "h1": "Develo Multi-Agent: Orquestación de Equipos de Agentes de IA",
        "intro": "Organice agentes especializados como un sistema: cada uno con responsabilidades, contexto y herramientas claras, coordinados mediante flujos observables y gobernados.",
        "crumbs": _crumbs("/solutions/develomultiagent/", "Develo Multi-Agent", ("Soluciones", "/solutions/")),
        "schema": ["software"],
        "software": {
            "name": "Develo Multi-Agent",
            "description": "Plataforma para orquestar equipos gobernados de agentes de inteligencia artificial.",
            "features": ["Agentes especializados", "Enrutamiento", "MCP", "Memoria", "Evaluaciones", "Supervisión humana"],
        },
        "sections": [
            {"t": "h2", "text": "Cuándo usar varios agentes"},
            {"t": "p", "html": "Un flujo multiagente es útil cuando el problema combina dominios, herramientas o controles diferentes. La especialización reduce contexto innecesario y permite evaluar cada responsabilidad por separado."},
            {"t": "h2", "text": "Capacidades"},
            _grid([
                ("Especialización", "Roles, instrucciones, memoria y herramientas acotadas por agente.", None),
                ("Orquestación", "Enrutamiento, coordinación, estados y recuperación de errores.", None),
                ("Gobierno", "Permisos, guardrails, aprobación humana y auditoría.", None),
                ("Herramientas MCP", "Contratos claros para consultar o modificar sistemas.", None),
                ("Evaluación", "Calidad, consistencia y seguridad medidas por tarea.", None),
                ("Observabilidad", "Trazas completas de decisiones, herramientas, latencia y costo.", None),
            ], 3),
            {"t": "h2", "text": "Soluciones relacionadas"},
            _links([
                ("Agentes de IA", "/solutions/ai-agents/", "Diseño y desarrollo de agentes gobernados"),
                ("Tecnologías", "/technologies/", "AWS, Bedrock, MCP y observabilidad"),
                ("Integraciones API", "/solutions/api-integrations/", "Conecte agentes con la operación"),
            ]),
            {"t": "cta", "title": "Diseñemos la coordinación correcta", "body": "Identifiquemos responsabilidades, herramientas y puntos de control antes de ampliar la autonomía."},
        ],
    },
    {
        "path": "/es/technologies/",
        "lang": "es",
        "title": "Tecnologías: AWS, Bedrock, Agentes, MCP y LLMs | Develo",
        "description": "La arquitectura de Develo: AWS, Amazon Bedrock, agentes autónomos, Model Context Protocol, RAG, vectores, fine-tuning y observabilidad.",
        "h1": "Las Tecnologías con las que Construye Develo",
        "intro": "Elegimos tecnología por confiabilidad, seguridad y valor operativo. Estas son las piezas que usamos para llevar software e inteligencia artificial a producción.",
        "crumbs": _crumbs("/technologies/", "Tecnologías"),
        "schema": ["service"],
        "sections": [
            {"t": "h2", "text": "AWS"},
            {"t": "p", "html": "Diseñamos infraestructura segura y escalable sobre <strong>AWS</strong>: cómputo, almacenamiento, redes, identidad, eventos, observabilidad y despliegues automatizados."},
            {"t": "h2", "text": "Amazon Bedrock y LLMs"},
            {"t": "p", "html": "Usamos <strong>Amazon Bedrock</strong> para acceder a modelos fundacionales con controles empresariales. Evaluamos calidad, latencia y costo antes de seleccionar o cambiar un LLM."},
            {"t": "h2", "text": "Agentes autónomos y MCP"},
            {"t": "p", "html": "Construimos <strong>agentes autónomos</strong> con herramientas explícitas mediante <strong>Model Context Protocol (MCP)</strong>, permisos mínimos, guardrails, confirmaciones y supervisión humana."},
            {"t": "h2", "text": "RAG, búsqueda vectorial y conocimiento"},
            {"t": "p", "html": "Combinamos <strong>Retrieval-Augmented Generation (RAG)</strong>, embeddings, bases vectoriales, reranking y fuentes visibles para responder con conocimiento dinámico y verificable."},
            {"t": "h2", "text": "Fine-tuning de LLMs"},
            {"t": "p", "html": "Aplicamos <strong>fine-tuning de LLMs</strong> solo cuando una evaluación demuestra que supera a instrucciones, ejemplos o RAG para el comportamiento requerido."},
            {"t": "h2", "text": "Evaluación y observabilidad"},
            {"t": "p", "html": "Registramos trazas, calidad, seguridad, latencia, costo y uso. Las evaluaciones automáticas y humanas convierten el desempeño de IA en una métrica operable."},
            {"t": "h2", "text": "Dónde aplicamos esta arquitectura"},
            _links([
                ("d-ialog", "/solutions/d-ialog/", "IA conversacional multitenant"),
                ("Agentes de IA", "/solutions/ai-agents/", "Herramientas y flujos gobernados"),
                ("Software a medida", "/solutions/custom-software-development/", "Productos preparados para escalar"),
            ]),
            {"t": "cta", "title": "Diseñemos una arquitectura adecuada", "body": "La mejor tecnología es la que reduce riesgo y mejora un resultado concreto."},
        ],
    },
    {
        "path": "/es/industries/ecommerce-retail/",
        "lang": "es",
        "title": "IA y Software a Medida para Ecommerce y Retail | Develo",
        "description": "Software, agentes de IA y automatización para ecommerce y retail: WhatsApp, marketplaces, catálogo, pedidos, atención e integraciones.",
        "h1": "IA y Software a Medida para Ecommerce y Retail",
        "intro": "Conectamos atención, catálogo y operación para que marcas y vendedores respondan mejor, automaticen tareas y escalen sin fragmentar la experiencia del cliente.",
        "crumbs": _crumbs("/industries/ecommerce-retail/", "Ecommerce y retail", ("Industrias", "/industries/ecommerce-retail/")),
        "schema": ["service"],
        "sections": [
            {"t": "h2", "text": "Problemas que resolvemos"},
            {"t": "list", "items": [
                "Preguntas repetitivas por WhatsApp y marketplaces",
                "Información de producto inconsistente entre canales",
                "Procesos manuales entre catálogo, stock, pedidos y posventa",
                "Poca visibilidad sobre demanda y oportunidades de conversión",
            ]},
            {"t": "h2", "text": "Soluciones"},
            _grid([
                ("IA para WhatsApp", "Atención con conocimiento e integración operativa.", "/solutions/ai-for-whatsapp/"),
                ("Marketplaces", "Preguntas y operaciones conectadas con catálogo y pedidos.", "/solutions/marketplace-automation/"),
                ("Software a medida", "Plataformas, backoffices y experiencias específicas.", "/solutions/custom-software-development/"),
            ], 3),
            {"t": "h2", "text": "Implementación real"},
            {"t": "p", "html": "Vea cómo Tecnoland y Distriland integraron servicio, ecommerce y experiencia digital con soluciones construidas por Develo."},
            _links([("Caso Tecnoland y Distriland", "/case-studies/tecnoland-distriland/", "Una experiencia de cliente digital conectada")]),
            {"t": "cta", "title": "Conecte su experiencia de ecommerce", "body": "Comencemos por el canal y el proceso con mayor impacto operativo."},
        ],
    },
]


SPANISH_PAGES += [
    {
        "path": "/es/case-studies/",
        "lang": "es",
        "title": "Casos de Éxito y Resultados de Clientes | Develo",
        "description": "Casos de éxito de Develo: productos de software e inteligencia artificial implementados para Intervan, Tecnoland y Distriland.",
        "h1": "Casos de Éxito: Proyectos Reales, Resultados Medibles",
        "intro": "Mostramos el problema, la solución y la arquitectura detrás de implementaciones que hoy operan en empresas reales.",
        "crumbs": _crumbs("/case-studies/", "Casos de éxito"),
        "schema": [],
        "sections": [
            {"t": "grid", "cols": 2, "items": [
                {
                    "title": "Intervan",
                    "body": "Copiloto empresarial y backoffice multitenant con MCP, conocimiento dinámico, métricas y capacidad para más de 1.000 usuarios.",
                    "href": "/case-studies/intervan/",
                    "image": "/assets/case-studies/intervan-cover.jpeg",
                    "image_alt": "Intervan",
                    "image_width": 2050,
                    "image_height": 780,
                },
                {
                    "title": "Tecnoland y Distriland",
                    "body": "Experiencia digital conectada para servicios tecnológicos y ecommerce, desde la atención hasta la operación.",
                    "href": "/case-studies/tecnoland-distriland/",
                    "image": "/assets/case-studies/distriland.png",
                    "image_alt": "Distriland",
                    "image_width": 202,
                    "image_height": 66,
                },
            ]},
            {"t": "cta", "title": "¿Qué resultado necesita construir?", "body": "Revisemos su operación y definamos un primer alcance verificable."},
        ],
    },
    {
        "path": "/es/case-studies/tecnoland-distriland/",
        "lang": "es",
        "title": "Caso Tecnoland y Distriland: Soluciones Digitales | Develo",
        "description": "Cómo Develo ayudó a Tecnoland y Distriland a conectar atención, ecommerce y operaciones en una experiencia digital coherente y escalable.",
        "h1": "Tecnoland y Distriland: una Experiencia Digital Construida",
        "intro": "Dos negocios relacionados necesitaban una experiencia clara para clientes y una operación capaz de acompañar el crecimiento sin sumar fricción manual.",
        "crumbs": _crumbs("/case-studies/tecnoland-distriland/", "Tecnoland y Distriland", ("Casos de éxito", "/case-studies/")),
        "schema": ["article"],
        "sections": [
            {"t": "brand", "src": "/assets/case-studies/distriland.png", "alt": "Distriland", "width": 202, "height": 66, "caption": "Ecommerce y servicios tecnológicos"},
            {"t": "h2", "text": "Desafío"},
            {"t": "p", "html": "Tecnoland y Distriland necesitaban ordenar la experiencia de clientes entre servicios, catálogo, consultas y operación digital, manteniendo una identidad consistente y capacidad de evolución."},
            {"t": "h2", "text": "Solución"},
            {"t": "list", "items": [
                "Experiencias digitales diseñadas alrededor de los recorridos reales de clientes",
                "Integración entre contenido, consultas y procesos comerciales",
                "Arquitectura mantenible para incorporar nuevas funciones y canales",
                "Medición y evolución continua a partir del uso",
            ]},
            {"t": "h2", "text": "Tecnología"},
            {"t": "p", "html": "La solución combina desarrollo web, APIs e infraestructura administrada para entregar una experiencia rápida, consistente y preparada para crecer."},
            {"t": "h2", "text": "Resultados"},
            {"t": "list", "items": [
                "Una presencia digital coherente entre las marcas",
                "Menos fricción para encontrar información y avanzar en una consulta",
                "Una base técnica que permite iterar sin reconstruir la operación",
            ]},
            {"t": "h2", "text": "Soluciones relacionadas"},
            _links([
                ("Ecommerce y retail", "/industries/ecommerce-retail/", "IA y software para comercio digital"),
                ("Software a medida", "/solutions/custom-software-development/", "Productos diseñados alrededor del negocio"),
                ("Integraciones API", "/solutions/api-integrations/", "Canales y sistemas conectados"),
            ]),
            {"t": "cta", "title": "Construyamos una experiencia conectada", "body": "Identifiquemos dónde pierde tiempo el cliente y dónde lo pierde la operación."},
        ],
    },
    {
        "path": "/es/case-studies/intervan/",
        "lang": "es",
        "title": "Caso Intervan: Copiloto Empresarial y Backoffice de IA | Develo",
        "description": "Caso Intervan: copiloto y backoffice multitenant para más de 1.000 usuarios, con MCP, conocimiento dinámico, métricas y configuración.",
        "h1": "Intervan: un Copiloto Empresarial Diseñado para Operar y Escalar",
        "intro": "Intervan necesitaba convertir un copiloto funcional en un producto operable por su propio equipo, seguro entre organizaciones y preparado para más de 1.000 usuarios.",
        "crumbs": _crumbs("/case-studies/intervan/", "Intervan", ("Casos de éxito", "/case-studies/")),
        "schema": ["article"],
        "sections": [
            {"t": "brand", "src": "/assets/case-studies/intervan-cover.jpeg", "alt": "Intervan", "width": 2050, "height": 780, "caption": "Software empresarial y operaciones para organismos públicos"},
            {"t": "h2", "text": "Necesidad"},
            {"t": "p", "html": "El copiloto ya respondía consultas, derivaba tickets y utilizaba conocimiento de distintos módulos. Intervan aún dependía de Develo para actualizarlo y no contaba con la visibilidad, los controles ni los canales necesarios para producción."},
            {"t": "h2", "text": "Solución"},
            _grid([
                ("Copiloto para más de 1.000 usuarios", "Arquitectura multitenant que aísla el contexto, las reglas y la documentación de cada organización.", None),
                ("Backoffice operativo", "Conversaciones, intervención humana, métricas configurables, reportes, usuarios, roles y reglas.", None),
                ("Base de conocimiento dinámica", "Documentos y videos transcritos, reindexación automática y evolución de RAG sin intervención de desarrollo.", None),
                ("Acciones mediante MCP", "Catálogo gobernado que conecta el copiloto con el sistema de Intervan, con confirmación y trazabilidad.", None),
            ], 2),
            {"t": "h2", "text": "Arquitectura"},
            {"t": "list", "items": [
                "Infraestructura AWS resiliente y preparada para escala horizontal",
                "Contexto, reglas y conocimiento multitenant por organización",
                "Panel de conversaciones, métricas, configuración, reportes y exportaciones",
                "Herramientas MCP sobre las APIs del sistema de Intervan para consultas y acciones acotadas",
                "Supervisión humana, notificaciones, escalamiento e integración opcional con osTicket",
                "WhatsApp Business mediante las APIs de Meta y la misma capa RAG gobernada",
            ]},
            {"t": "h2", "text": "Resultado operativo"},
            {"t": "p", "html": "Intervan puede gestionar conocimiento, revisar la calidad del servicio y controlar el copiloto desde su propio backoffice. El producto puede pasar de responder a ejecutar flujos aprobados, conservando permisos y evidencia de auditoría en cada acción."},
            {"t": "h2", "text": "Soluciones relacionadas"},
            _links([
                ("d-ialog", "/solutions/d-ialog/", "El producto de IA conversacional detrás de la implementación"),
                ("Agentes de IA", "/solutions/ai-agents/", "Agentes gobernados conectados con sistemas"),
                ("Tecnologías", "/technologies/", "AWS, Bedrock, MCP, RAG y observabilidad"),
            ]),
            {"t": "cta", "title": "Convierta un copiloto en una operación", "body": "Diseñemos conocimiento, controles, métricas e integraciones para que el producto pueda escalar."},
        ],
    },
]


ENGLISH_TERMS = {
    "path": "/terms-and-conditions/",
    "lang": "en",
    "title": "Terms and Conditions | Develo",
    "description": "Terms and Conditions for the Develo website, including permitted use, services, intellectual property, liability and applicable jurisdiction.",
    "h1": "Terms and Conditions",
    "intro": "Welcome to the Develo website. By accessing this site or using our services, you agree to these Terms and Conditions. If you disagree with any provision, please do not use the site.",
    "crumbs": [("Terms and Conditions", BASE + "/terms-and-conditions/")],
    "schema": [],
    "sections": [
        {"t": "h2", "text": "1. Nature of the agreement"},
        {"t": "p", "html": "These Terms and Conditions constitute a legal agreement between you, the user, and Develo. They establish the rules and limitations governing use of the website and the relationship between the parties."},
        {"t": "h2", "text": "2. Scope"},
        {"t": "p", "html": "This site is intended for companies, organizations and professionals seeking software development or technology services in a business-to-business context."},
        {"t": "h2", "text": "3. Permitted use"},
        {"t": "list", "items": [
            "Use the site only for lawful and professional purposes",
            "Do not damage, overload or interfere with operation of the site",
            "Do not access accounts, systems or networks without authorization",
            "We may suspend access when these terms are breached",
        ]},
        {"t": "h2", "text": "4. Services"},
        {"t": "p", "html": "Develo provides custom software development, technology consulting and digital solutions. We may modify, suspend or discontinue aspects of the website or our services without prior notice."},
        {"t": "h2", "text": "5. Intellectual property"},
        {"t": "p", "html": "Website content, including text, images, logos and software, belongs to Develo or its respective owners. It may not be reproduced, distributed or modified without express authorization."},
        {"t": "h2", "text": "6. Disclaimer"},
        {"t": "p", "html": "The site and its content are provided as is. Develo does not warrant that the site will be free from errors, interruptions or viruses, and is not responsible for decisions based on information published here."},
        {"t": "h2", "text": "7. Limitation of liability"},
        {"t": "p", "html": "To the extent permitted by applicable law, Develo is not liable for direct, indirect, incidental or consequential damages arising from use of the website or services."},
        {"t": "h2", "text": "8. Changes to these terms"},
        {"t": "p", "html": "We may update these Terms and Conditions at any time. Changes take effect when published on this page, which users should review periodically."},
        {"t": "h2", "text": "9. Governing law and jurisdiction"},
        {"t": "p", "html": "This agreement is governed by the laws of the Argentine Republic. The parties submit disputes to the ordinary courts of the Autonomous City of Buenos Aires."},
        {"t": "h2", "text": "10. Contact"},
        {"t": "p", "html": "For questions about these Terms and Conditions, contact <a href='mailto:info@develo.ar'>info@develo.ar</a>."},
    ],
}


def localize_pages(source_pages: list[dict]) -> list[dict]:
    """Normalize the legacy legal route and append every reciprocal locale."""
    english = [deepcopy(page) for page in source_pages if page["lang"] == "en"]
    spanish_home = deepcopy(next(page for page in source_pages if page["path"] == "/es/"))
    spanish_terms = deepcopy(next(
        page for page in source_pages
        if page["path"] == "/terms-and-conditions/" and page["lang"] == "es"
    ))
    spanish_terms["path"] = "/es/terms-and-conditions/"
    spanish_terms["crumbs"] = [
        ("Términos y condiciones", BASE + "/es/terms-and-conditions/")
    ]

    localized = SERVICE_PAGES + SPANISH_PAGES
    expected_spanish = {_es_path(page["path"]) for page in english if page["path"] != "/"}
    actual_spanish = {page["path"] for page in localized}
    missing = expected_spanish - actual_spanish
    if missing:
        raise ValueError(f"Missing authored Spanish pages: {sorted(missing)}")

    return english + [deepcopy(ENGLISH_TERMS), spanish_home] + localized + [spanish_terms]


SPANISH_PAGES += [
    {
        "path": "/es/insights/",
        "lang": "es",
        "title": "Contenido sobre IA e Ingeniería de Software | Develo",
        "description": "Análisis prácticos de Develo sobre agentes de IA, LLMs, automatización, arquitectura y desarrollo de productos digitales en producción.",
        "h1": "Contenido: Conocimiento Técnico de Proyectos Reales",
        "intro": "Publicamos decisiones, patrones y aprendizajes que surgen al construir software e inteligencia artificial para operaciones reales.",
        "crumbs": _crumbs("/insights/", "Contenido"),
        "schema": [],
        "sections": [
            _grid([
                ("Agentes de IA frente a chatbots tradicionales", "Diferencias en herramientas, autonomía, memoria, control y casos de uso.", "/insights/ai-agents-vs-chatbots/"),
            ], 1),
            {"t": "h2", "text": "Temas que investigamos"},
            {"t": "list", "items": [
                "Arquitecturas de agentes y sistemas multiagente",
                "RAG, bases de conocimiento, evaluación y fine-tuning",
                "Automatización de atención y operaciones digitales",
                "Diseño de productos, APIs, seguridad y escalabilidad",
            ]},
            {"t": "cta", "title": "Aplique estas ideas a su operación", "body": "Conversemos sobre el problema, las restricciones y una forma concreta de validarlo."},
        ],
    },
    {
        "path": "/es/insights/ai-agents-vs-chatbots/",
        "lang": "es",
        "title": "Agentes de IA vs. Chatbots: Diferencias Clave | Develo",
        "description": "Diferencias entre agentes de inteligencia artificial y chatbots tradicionales: herramientas, autonomía, memoria, guardrails y casos de uso.",
        "h1": "Agentes de IA vs. Chatbots Tradicionales: ¿Cuál es la Diferencia?",
        "intro": "Ambos conversan, pero no tienen el mismo alcance. La diferencia decisiva está en lo que pueden hacer, cómo usan contexto y qué controles requieren.",
        "crumbs": _crumbs("/insights/ai-agents-vs-chatbots/", "Agentes de IA vs. chatbots", ("Contenido", "/insights/")),
        "schema": ["article"],
        "sections": [
            {"t": "h2", "text": "Qué hace un chatbot tradicional"},
            {"t": "p", "html": "Un chatbot sigue árboles, intenciones o respuestas predefinidas. Funciona bien en recorridos estables, pero pierde capacidad cuando debe combinar información, decidir entre herramientas o completar varios pasos."},
            {"t": "h2", "text": "Qué hace un agente de IA"},
            {"t": "p", "html": "Un agente interpreta un objetivo, recupera contexto, selecciona herramientas y ejecuta pasos para producir un resultado. Esa capacidad exige permisos, evaluación y trazabilidad."},
            {"t": "h2", "text": "Comparación"},
            _grid([
                ("Alcance", "El chatbot responde; el agente también puede consultar y actuar.", None),
                ("Contexto", "El agente combina memoria, conocimiento dinámico y estado del flujo.", None),
                ("Integración", "El agente utiliza APIs o MCP como herramientas explícitas.", None),
                ("Control", "Guardrails, permisos y supervisión crecen con la autonomía.", None),
                ("Evaluación", "Se mide el resultado completo, no solo la calidad del texto.", None),
                ("Operación", "Las trazas muestran decisiones, fuentes, herramientas y errores.", None),
            ], 3),
            {"t": "h2", "text": "Cuándo elegir cada enfoque"},
            {"t": "list", "items": [
                "Use un chatbot para flujos simples, determinísticos y con pocas variaciones",
                "Use un agente cuando deba consultar sistemas, combinar fuentes o completar tareas",
                "Empiece con autonomía acotada y amplíela solo cuando las evaluaciones lo justifiquen",
            ]},
            {"t": "h2", "text": "Gobierno antes que autonomía"},
            {"t": "p", "html": "Un agente útil no es el que intenta hacer todo. Es el que conoce sus límites, solicita confirmación cuando corresponde y deja evidencia de cada decisión y herramienta."},
            _links([
                ("Desarrollo de agentes de IA", "/solutions/ai-agents/", "Diseño, herramientas y gobierno"),
                ("Develo Multi-Agent", "/solutions/develomultiagent/", "Coordinación de agentes especializados"),
            ]),
            {"t": "cta", "title": "Elija el nivel correcto de autonomía", "body": "Partamos del resultado esperado, los riesgos y las herramientas que el sistema necesita."},
        ],
    },
    {
        "path": "/es/about/",
        "lang": "es",
        "title": "Acerca de Develo: Software e IA en Buenos Aires | Develo",
        "description": "Conozca a Develo, empresa de software e inteligencia artificial de Buenos Aires especializada en productos, agentes y automatización sobre AWS.",
        "h1": "Acerca de Develo",
        "intro": "Somos una empresa de ingeniería de software e inteligencia artificial de Buenos Aires, Argentina. Diseñamos y construimos tecnología que mejora operaciones y experiencias digitales.",
        "crumbs": _crumbs("/about/", "Nosotros"),
        "schema": [],
        "sections": [
            {"t": "h2", "text": "Quiénes somos"},
            {"t": "p", "html": "Develo reúne ingeniería, producto y visión de negocio para convertir necesidades complejas en sistemas claros, operables y preparados para evolucionar."},
            {"t": "h2", "text": "Qué construimos"},
            {"t": "list", "items": [
                "Software a medida, plataformas SaaS y backoffices",
                "Aplicaciones de inteligencia artificial y sistemas RAG",
                "Agentes autónomos, copilotos y automatización de operaciones",
                "Productos para atención, WhatsApp, marketplaces y ecommerce",
            ]},
            {"t": "h2", "text": "Nuestra experiencia"},
            _grid([
                ("Arquitectura", "Sistemas seguros, multitenant, observables y altamente escalables.", None),
                ("Inteligencia artificial", "Amazon Bedrock, LLMs, RAG, fine-tuning, agentes y MCP.", None),
                ("Producto", "Descubrimiento, UX, métricas, entrega iterativa y evolución.", None),
            ], 3),
            {"t": "h2", "text": "Cómo trabajamos"},
            {"t": "p", "html": "Exploramos la necesidad, diseñamos una prueba de concepto, desarrollamos un MVP que genere valor y mantenemos el producto con métricas y aprendizaje continuo."},
            {"t": "h2", "text": "Con quiénes trabajamos"},
            {"t": "p", "html": "Trabajamos con empresas que necesitan modernizar una operación, lanzar un producto o incorporar IA con controles reales. Nuestros casos con Intervan, Tecnoland y Distriland muestran ese enfoque."},
            _links([
                ("Casos de éxito", "/case-studies/", "Proyectos, arquitectura y resultados"),
                ("Tecnologías", "/technologies/", "La base técnica de nuestras soluciones"),
                ("Soluciones", "/solutions/", "Todo lo que construimos"),
            ]),
            {"t": "cta", "title": "Trabajemos sobre un problema concreto", "body": "Una conversación breve alcanza para definir si podemos aportar valor y cuál sería el siguiente paso."},
        ],
    },
    {
        "path": "/es/contact/",
        "lang": "es",
        "title": "Contacto Develo: Agendar una Reunión | Develo",
        "description": "Contacte a Develo para desarrollar software, agentes de IA y automatización. Escríbanos o agende una reunión desde Buenos Aires, Argentina.",
        "h1": "Construyamos Juntos la Solución Correcta",
        "intro": "Cuéntenos el problema, los usuarios y las restricciones. Le responderemos con una pregunta útil o un siguiente paso concreto, no con una propuesta genérica.",
        "crumbs": _crumbs("/contact/", "Contacto"),
        "schema": [],
        "sections": [
            {"t": "h2", "text": "Cómo contactarnos"},
            _grid([
                ("Email", "<a href='mailto:info@develo.ar'>info@develo.ar</a> — respondemos dentro de un día hábil.", None),
                ("Teléfono y WhatsApp", "<a href='tel:+541132090851'>+54 11 3209-0851</a>", None),
                ("Ubicación", "Buenos Aires, Argentina; trabajamos en LATAM y de forma remota.", None),
            ], 3),
            {"t": "h2", "text": "Cuéntenos sobre su proyecto"},
            {"t": "form"},
            {"t": "h2", "text": "Qué ocurre después"},
            {"t": "list", "items": [
                "Una conversación breve para entender el problema y las restricciones",
                "Una propuesta escrita con alcance, arquitectura, tiempos y costos",
                "Un plan de prueba de concepto para la parte de mayor riesgo",
                "Sin compromiso: conservará una perspectiva técnica útil",
            ]},
            {"t": "h2", "text": "Buenos puntos de partida"},
            _links([
                ("Atención por WhatsApp", "/solutions/ai-for-whatsapp/", "Automatización con conocimiento y escalamiento"),
                ("Preguntas de Mercado Libre", "/solutions/ai-for-mercado-libre/", "Para vendedores activos"),
                ("Plataforma a medida", "/solutions/custom-software-development/", "Software construido desde cero"),
                ("Agentes para operaciones", "/solutions/ai-agents/", "Flujos autónomos con datos propios"),
            ]),
            {"t": "cta", "title": "Agende una reunión con Develo", "body": "Un correo es suficiente para comenzar."},
        ],
    },
    {
        "path": "/es/privacy-policy/",
        "lang": "es",
        "title": "Política de Privacidad | Develo",
        "description": "Cómo Develo recopila, utiliza, comparte, conserva y protege información personal de visitantes y clientes, y los derechos de sus titulares.",
        "h1": "Política de Privacidad",
        "intro": "En Develo valoramos la privacidad de visitantes y clientes. Esta política explica cómo tratamos y protegemos la información personal vinculada con nuestro sitio y nuestros servicios.",
        "crumbs": _crumbs("/privacy-policy/", "Política de privacidad"),
        "schema": [],
        "sections": [
            {"t": "h2", "text": "1. Información que recopilamos"},
            {"t": "p", "html": "Recopilamos la información que usted proporciona directamente —nombre, email, teléfono, empresa y contenido de consultas— y datos técnicos generados al utilizar el sitio, como navegador, dispositivo y páginas visitadas."},
            {"t": "h2", "text": "2. Cómo utilizamos la información"},
            {"t": "list", "items": [
                "Prestar y personalizar nuestros servicios",
                "Responder consultas comerciales y solicitudes de cotización",
                "Gestionar relaciones con clientes",
                "Enviar comunicaciones informativas o promocionales solo con consentimiento previo",
                "Mejorar el funcionamiento y la seguridad del sitio",
            ]},
            {"t": "h2", "text": "3. Información compartida con terceros"},
            {"t": "p", "html": "No vendemos ni alquilamos datos personales. Solo compartimos información con proveedores que apoyan operaciones técnicas o administrativas y con autoridades cuando una ley u orden judicial lo exige. Requerimos un tratamiento seguro y adecuado."},
            {"t": "h2", "text": "4. Sus derechos"},
            {"t": "p", "html": "Puede acceder, rectificar, actualizar o solicitar la eliminación de sus datos; oponerse a determinados tratamientos y retirar su consentimiento. Para ejercer estos derechos escriba a <a href='mailto:info@develo.ar'>info@develo.ar</a>."},
            {"t": "h2", "text": "5. Cookies y tecnologías similares"},
            {"t": "p", "html": "Este sitio puede utilizar cookies propias y de terceros para mejorar la experiencia, analizar tráfico y ofrecer contenido pertinente. Puede administrarlas desde su navegador; algunas funciones podrían verse afectadas si las desactiva."},
            {"t": "h2", "text": "6. Conservación y seguridad"},
            {"t": "p", "html": "Conservamos los datos solo durante el plazo necesario o exigido por ley. Aplicamos cifrado en tránsito, controles de acceso e infraestructura segura para protegerlos ante accesos no autorizados, pérdida o uso indebido."},
            {"t": "h2", "text": "7. Cambios y contacto"},
            {"t": "p", "html": "Podemos actualizar esta política. Los cambios rigen desde su publicación en esta página. Para consultas escriba a <a href='mailto:info@develo.ar'>info@develo.ar</a>."},
        ],
    },
]

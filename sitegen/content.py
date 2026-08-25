"""
Page content for the Develo website, as structured data.

Each page is a dict:
  path, lang, title, description, h1, intro,
  crumbs: [(name, url)] after Home (empty on home pages),
  schema: page-level schema keys (service / software / article / faq / website),
  software: {...} extra data for SoftwareApplication,
  hreflang: {lang: absolute url} (optional),
  sections: list of blocks.

Block types: p, h2, h3, list, grid, faq, code, callout, links, quote, cta.
"""

EMAIL = "info@develo.ar"
MAILTO = f"mailto:{EMAIL}?subject=Book%20a%20meeting%20with%20Develo"

M = "mailto:info@develo.ar"

PAGES = [
    # ------------------------------------------------------------------ HOME
    {
        "path": "/",
        "lang": "en",
        "title": "Custom Software & Artificial Intelligence Development | Develo",
        "description": (
            "Develo builds custom software, AI agents and automation for customer "
            "service, WhatsApp, marketplaces and digital operations. Buenos Aires, "
            "Argentina."
        ),
        "h1": "Custom Software, Automation & Artificial Intelligence for Businesses",
        "intro": (
            "Develo is a software engineering and artificial intelligence company "
            "based in Buenos Aires, Argentina. We design and build custom software, "
            "AI agents and automation platforms for customer service, WhatsApp, "
            "marketplaces and digital business operations — engineered on AWS with "
            "Amazon Bedrock."
        ),
        "crumbs": [],
        "schema": ["website"],
        "hreflang": {"en": "https://develo.software/", "es": "https://develo.software/es/",
                     "x-default": "https://develo.software/"},
        "sections": [
            {"t": "h2", "text": "What we do"},
            {"t": "grid", "cols": 3, "items": [
                {"title": "Custom Software Development",
                 "body": "Internal platforms, SaaS products, dashboards and digital tools engineered from scratch around your business.",
                 "href": "/solutions/custom-software-development/"},
                {"title": "Artificial Intelligence",
                 "body": "Applied AI: LLM applications, RAG systems, fine-tuned models and intelligent automation built on Amazon Bedrock.",
                 "href": "/solutions/artificial-intelligence/"},
                {"title": "AI Agents",
                 "body": "Autonomous agents that connect to your systems, answer customers and execute workflows with human oversight.",
                 "href": "/solutions/ai-agents/"},
            ]},
            {"t": "llm-viz", "variant": "home"},
            {"t": "h2", "text": "Our method: from insight to impact"},
            {"t": "grid", "cols": 4, "items": [
                {"title": "Need Exploration",
                 "body": "Start by analyzing customer insights to define the solution's scope."},
                {"title": "PoC Design",
                 "body": "Create and implement a proof of concept to showcase the approach and functionality."},
                {"title": "MVP Development",
                 "body": "Develop a product that brings business value, then iterate to refine it."},
                {"title": "Maintenance",
                 "body": "Long-term support to ensure sustainable results and an up-to-date product."},
            ]},
            {"t": "h2", "text": "Featured product: d-ialog by Develo"},
            {"t": "p", "html": (
                "<strong>d-ialog</strong> is our intelligent conversational "
                "management platform: AI-powered conversations, automations and "
                "customer operations across WhatsApp, marketplaces and digital "
                "channels — with real-time human supervision."
            )},
            {"t": "links", "items": [
                {"label": "Explore d-ialog", "href": "/solutions/d-ialog/",
                 "note": "AI conversations that drive results"},
                {"label": "Develo Multi-Agent", "href": "/solutions/develomultiagent/",
                 "note": "Orchestrate teams of specialized AI agents"},
            ]},
            {"t": "h2", "text": "Solutions by business problem"},
            {"t": "grid", "cols": 3, "items": [
                {"title": "Customer Service Automation",
                 "body": "Automate support across channels with AI that knows your business data.",
                 "href": "/solutions/customer-service-automation/"},
                {"title": "AI for WhatsApp",
                 "body": "AI agents for WhatsApp customer service with human escalation.",
                 "href": "/solutions/ai-for-whatsapp/"},
                {"title": "Marketplace Automation",
                 "body": "Automate marketplace questions, orders and seller operations.",
                 "href": "/solutions/marketplace-automation/"},
                {"title": "AI for Mercado Libre",
                 "body": "Automate buyer questions and product information on Mercado Libre.",
                 "href": "/solutions/ai-for-mercado-libre/"},
                {"title": "API & System Integrations",
                 "body": "Connect CRM, ERP, ecommerce, marketplaces and internal systems.",
                 "href": "/solutions/api-integrations/"},
                {"title": "All Solutions",
                 "body": "Browse the complete map of what Develo builds.",
                 "href": "/solutions/"},
            ]},
            {"t": "h2", "text": "Results, not promises"},
            {"t": "links", "items": [
                {"label": "Case Study: Tecnoland & Distriland", "href": "/case-studies/tecnoland-distriland/",
                 "note": "Digital customer experience for tech services and ecommerce"},
                {"label": "All Case Studies", "href": "/case-studies/", "note": "Real projects, measurable results"},
            ]},
            {"t": "h2", "text": "From our insights"},
            {"t": "links", "items": [
                {"label": "AI Agents vs Traditional Chatbots", "href": "/insights/ai-agents-vs-chatbots/",
                 "note": "When a chatbot is enough — and when you need an agent"},
            ]},
            {"t": "h2", "text": "Why choose Develo"},
            {"t": "p", "html": (
                "We are professionals in technology, marketing and business "
                "science focused on developing advanced solutions designed to "
                "enhance user experience across digital platforms."
            )},
            {"t": "grid", "cols": 3, "items": [
                {"title": "Smarter Tech",
                 "body": "Cutting-edge AI and software solutions tailored for seamless user experiences."},
                {"title": "Team Expertise",
                 "body": "A team of engineers and business minds, blending creativity with precision."},
                {"title": "Adaptive Solutions",
                 "body": "Flexible, scalable development tailored to your needs, evolving as your business grows."},
            ]},
            {"t": "cta",
             "title": "Ready to build the right solution together?",
             "body": "Let's connect and co-create the tech your business needs. Talk to Develo about custom software, AI agents and automation."},
        ],
    },

    # ------------------------------------------------------------ SOLUTIONS HUB
    {
        "path": "/solutions/",
        "lang": "en",
        "title": "Software & AI Solutions | Develo",
        "description": (
            "Explore Develo's solutions: custom software, artificial intelligence, "
            "AI agents, customer service automation, WhatsApp AI, marketplaces and "
            "API integrations."
        ),
        "h1": "Software and AI Solutions for Business",
        "intro": (
            "Every solution below exists as a dedicated landing page because "
            "these are the problems Develo actually solves for clients. Start "
            "from the one closest to your business."
        ),
        "crumbs": [("Solutions", "https://develo.software/solutions/")],
        "schema": [],
        "sections": [
            {"t": "grid", "cols": 3, "items": [
                {"title": "Custom Software Development",
                 "body": "Platforms, SaaS products and digital tools built from scratch.",
                 "href": "/solutions/custom-software-development/"},
                {"title": "Artificial Intelligence",
                 "body": "Applied AI with LLMs, RAG, fine-tuning and intelligent automation.",
                 "href": "/solutions/artificial-intelligence/"},
                {"title": "AI Agents",
                 "body": "Autonomous agents that use tools, access data and collaborate with teams.",
                 "href": "/solutions/ai-agents/"},
                {"title": "Customer Service Automation",
                 "body": "AI that answers customers, works your systems and escalates to humans.",
                 "href": "/solutions/customer-service-automation/"},
                {"title": "AI for WhatsApp",
                 "body": "Automate WhatsApp customer support with AI agents and human-in-the-loop.",
                 "href": "/solutions/ai-for-whatsapp/"},
                {"title": "Marketplace Automation",
                 "body": "Automate questions, orders and operations across marketplaces.",
                 "href": "/solutions/marketplace-automation/"},
                {"title": "AI for Mercado Libre",
                 "body": "Automate buyer questions and product information on Mercado Libre.",
                 "href": "/solutions/ai-for-mercado-libre/"},
                {"title": "API & System Integrations",
                 "body": "Connect CRM, ERP, ecommerce, payment providers and internal systems.",
                 "href": "/solutions/api-integrations/"},
            ]},
            {"t": "h2", "text": "Products"},
            {"t": "grid", "cols": 2, "items": [
                {"title": "d-ialog by Develo",
                 "body": "Intelligent conversational management across WhatsApp, marketplaces and digital channels.",
                 "href": "/solutions/d-ialog/"},
                {"title": "Develo Multi-Agent",
                 "body": "Orchestration platform for teams of specialized AI agents.",
                 "href": "/solutions/develomultiagent/"},
            ]},
            {"t": "callout",
             "title": "Not sure where to start?",
             "body": "Describe your business problem — customer service volume, marketplace questions, manual operations — and we'll map the fastest path to a proof of concept. <a href='/contact/'>Contact Develo</a>."},
            {"t": "cta",
             "title": "Let's scope your solution",
             "body": "Book a meeting and get a concrete proposal: scope, architecture, timeline and cost."},
        ],
    },

    # ------------------------------------------------- CUSTOM SOFTWARE
    {
        "path": "/solutions/custom-software-development/",
        "lang": "en",
        "title": "Custom Software Development for Businesses | Develo",
        "description": (
            "Develo designs and develops custom software, platforms, integrations "
            "and digital products tailored to complex business requirements."
        ),
        "h1": "Custom Software Development",
        "intro": (
            "Off-the-shelf tools fit generic workflows. When your business runs "
            "on complex or unique processes, Develo designs and develops custom "
            "software — platforms, internal tools and digital products — "
            "tailored to your exact requirements, deployed on AWS and built to "
            "evolve."
        ),
        "crumbs": [("Solutions", "https://develo.software/solutions/"),
                   ("Custom Software Development", "https://develo.software/solutions/custom-software-development/")],
        "schema": ["service"],
        "sections": [
            {"t": "h2", "text": "What we build"},
            {"t": "list", "items": [
                "Internal platforms and back offices for operations, support and finance teams",
                "SaaS and multi-tenant products, from MVP to scale",
                "Customer-facing web and mobile experiences",
                "Dashboards, reporting and data pipelines",
                "Automation of manual workflows and integrations between systems",
                "Re-architecture and modernization of legacy applications",
            ]},
            {"t": "h2", "text": "How we work"},
            {"t": "p", "html": (
                "We start with <strong>Need Exploration</strong>: analyzing your "
                "customers and processes to define scope. Then a "
                "<strong>PoC</strong> to validate the approach, an "
                "<strong>MVP</strong> that delivers business value fast, and "
                "long-term <strong>maintenance</strong> so the product keeps "
                "evolving. <a href='/about/'>Read more about our method</a>."
            )},
            {"t": "h2", "text": "Engineering standards"},
            {"t": "list", "items": [
                "Clean, SOLID architecture: modules with single responsibility, designed for change",
                "Automated testing and continuous delivery (CI/CD) on every change",
                "Production-grade infrastructure on AWS: containers, managed databases, CDN and monitoring",
                "Security by default: authentication, authorization, audit logs and data protection",
                "Documentation and knowledge transfer so your team owns the product",
            ]},
            {"t": "h2", "text": "Related solutions"},
            {"t": "links", "items": [
                {"label": "API & System Integrations", "href": "/solutions/api-integrations/",
                 "note": "Connect the software to the rest of your stack"},
                {"label": "Artificial Intelligence", "href": "/solutions/artificial-intelligence/",
                 "note": "Add LLM and agent capabilities to custom products"},
                {"label": "Our Technology Stack", "href": "/technologies/",
                 "note": "AWS, Bedrock, MCP and how we build"},
            ]},
            {"t": "cta",
             "title": "Describe the system your business needs",
             "body": "Send us the problem and we'll reply with an architecture proposal and a path to your MVP."},
        ],
    },

    # --------------------------------------------------------- ARTIFICIAL INTELLIGENCE
    {
        "path": "/solutions/artificial-intelligence/",
        "lang": "en",
        "title": "Artificial Intelligence Development for Business | Develo",
        "description": (
            "Develo designs and deploys applied AI: LLM applications, RAG "
            "systems, fine-tuned models, AI agents and automation built on AWS "
            "and Amazon Bedrock."
        ),
        "h1": "Artificial Intelligence for Business",
        "intro": (
            "Develo builds applied AI: systems that read documents, answer "
            "customers, make decisions with your operational data and execute "
            "workflows — on top of large language models running in AWS through "
            "Amazon Bedrock. No hype: each AI component is chosen because it "
            "measurably improves a business process."
        ),
        "crumbs": [("Solutions", "https://develo.software/solutions/"),
                   ("Artificial Intelligence", "https://develo.software/solutions/artificial-intelligence/")],
        "schema": ["service"],
        "sections": [
            {"t": "h2", "text": "What we build"},
            {"t": "grid", "cols": 2, "items": [
                {"title": "LLM applications",
                 "body": "Chat assistants, document analysis, content generation and decision support wired to your data."},
                {"title": "Retrieval-Augmented Generation (RAG)",
                 "body": "Systems that ground model answers in your documents, catalogs and databases — with citations and low hallucination."},
                {"title": "LLM fine-tuning",
                 "body": "Domain-specific models for tone, format and task accuracy when prompting and RAG are not enough."},
                {"title": "AI agents",
                 "body": "Autonomous agents with tool access that investigate, decide and act under guardrails."},
            ]},
            {"t": "h2", "text": "How we choose the right technique"},
            {"t": "p", "html": (
                "Most business problems need a combination: good prompts, "
                "retrieval over your data, evaluation harnesses, guardrails and "
                "human-in-the-loop checkpoints. Fine-tuning is one tool in the "
                "kit, not a starting point. <a href='/technologies/'>"
                "See how we combine RAG, fine-tuning and agents in our "
                "technology stack</a>."
            )},
            {"t": "h2", "text": "Production discipline"},
            {"t": "list", "items": [
                "Evaluation: regression test suites over real business cases, run on every model or prompt change",
                "Guardrails: input/output filtering, restricted tool permissions and audit logs",
                "Human-in-the-loop: escalation paths and supervision consoles for sensitive actions",
                "Observability: traces, costs and quality metrics per conversation and per agent",
                "Data privacy: your operational data stays inside your AWS tenancy",
            ]},
            {"t": "h2", "text": "Related"},
            {"t": "links", "items": [
                {"label": "AI Agents", "href": "/solutions/ai-agents/", "note": "Autonomous, tool-using AI"},
                {"label": "Customer Service Automation", "href": "/solutions/customer-service-automation/", "note": "The highest-ROI AI use case we ship"},
                {"label": "Technology Stack", "href": "/technologies/", "note": "AWS, Bedrock, MCP, fine-tuning"},
            ]},
            {"t": "cta",
             "title": "Bring us your AI use case",
             "body": "Tell us the process you want to improve; we'll map the LLM architecture, costs and a PoC timeline."},
        ],
    },

    # --------------------------------------------------------- AI AGENTS
    {
        "path": "/solutions/ai-agents/",
        "lang": "en",
        "title": "AI Agent Development for Businesses | Develo",
        "description": (
            "Build AI agents that connect to your systems, automate workflows, "
            "answer customers and collaborate with human teams."
        ),
        "h1": "Artificial Intelligence Agents for Business",
        "intro": (
            "An AI agent is a system that pursues a goal: it perceives context, "
            "reasons with a large language model, uses tools — APIs, databases, "
            "search, your business systems — and acts, with guardrails and "
            "human oversight. Develo designs, builds and operates AI agents for "
            "real business workflows."
        ),
        "crumbs": [("Solutions", "https://develo.software/solutions/"),
                   ("AI Agents", "https://develo.software/solutions/ai-agents/")],
        "schema": ["service", "faq"],
        "faq": [
            {"q": "What can an AI agent do that a chatbot cannot?",
             "a": "A chatbot matches intents to canned responses. An agent pursues a goal: it plans steps, calls APIs, reads your databases, adapts to new information and completes multi-step tasks such as checking an order, applying a policy and escalating to a human when needed."},
            {"q": "How do AI agents access our internal data safely?",
             "a": "Agents get scoped, read-mostly access through tool definitions — often exposed via the Model Context Protocol (MCP). Permissions, audit logs and guardrails restrict what each agent can do, and sensitive actions require human approval."},
            {"q": "What happens when an agent is not sure?",
             "a": "We design explicit human-in-the-loop checkpoints: confidence thresholds, policy rules and escalation paths route uncertain or high-stakes conversations to your operators, with full context attached."},
            {"q": "How do you measure agent quality?",
             "a": "Every agent ships with an evaluation suite: replayed business conversations checked for correctness, policy compliance and tone, run on every change to prompts, tools or models, plus production observability (traces, cost, escalation rate)."},
        ],
        "sections": [
            {"t": "h2", "text": "Capabilities we engineer"},
            {"t": "list", "items": [
                "Goal-driven planning with large language models (Amazon Bedrock)",
                "Tool calling: APIs, databases, search, CRM and ERP operations",
                "Retrieval-Augmented Generation over your documents and catalogs",
                "Memory: conversation state plus persistent business context",
                "Guardrails: policy filters, restricted permissions, sensitive-data handling",
                "Human-in-the-loop workflows with escalation and takeover",
                "Multi-agent orchestration with a supervisor pattern",
                "Observability: full traces, evaluation suites and cost monitoring",
            ]},
            {"t": "h2", "text": "Reference architecture"},
            {"t": "code", "text": (
                "Channel (WhatsApp / Web / Marketplace / API)\n"
                "        ↓\n"
                "Develo AI Layer (routing, context, guardrails)\n"
                "        ↓\n"
                "LLM Agent (Amazon Bedrock) — plans and calls tools\n"
                "        ↓\n"
                "Tools / MCP servers\n"
                "   ├── CRM      ├── Orders / Ecommerce\n"
                "   ├── Catalog  ├── Internal APIs\n"
                "        ↓\n"
                "Human operators (escalation, takeover, supervision)"
            )},
            {"t": "h2", "text": "Business use cases we ship"},
            {"t": "grid", "cols": 2, "items": [
                {"title": "Customer support agents",
                 "body": "Answer product, order and policy questions using live business data.",
                 "href": "/solutions/customer-service-automation/"},
                {"title": "WhatsApp agents",
                 "body": "24/7 conversational support with natural language and human escalation.",
                 "href": "/solutions/ai-for-whatsapp/"},
                {"title": "Marketplace agents",
                 "body": "Automate buyer questions and seller operations on marketplaces.",
                 "href": "/solutions/marketplace-automation/"},
                {"title": "Operational agents",
                 "body": "Internal copilots that run multi-step workflows across your systems."},
            ]},
            {"t": "h2", "text": "Frequently asked questions"},
            {"t": "faq", "ref": True},
            {"t": "h2", "text": "Related"},
            {"t": "links", "items": [
                {"label": "AI Agents vs Traditional Chatbots", "href": "/insights/ai-agents-vs-chatbots/", "note": "A technical comparison"},
                {"label": "Develo Multi-Agent", "href": "/solutions/develomultiagent/", "note": "Orchestrate teams of agents"},
                {"label": "Our Technology Stack", "href": "/technologies/", "note": "Bedrock, MCP, RAG, fine-tuning"},
            ]},
            {"t": "cta",
             "title": "Let's design your first AI agent",
             "body": "Pick one high-volume workflow and we'll prototype an agent that handles it end to end."},
        ],
    },

    # --------------------------------------------- CUSTOMER SERVICE AUTOMATION
    {
        "path": "/solutions/customer-service-automation/",
        "lang": "en",
        "title": "AI Customer Service Automation | Develo",
        "description": (
            "Develo automates customer service with AI agents that answer using "
            "your live data, work across channels and escalate to human "
            "operators when needed."
        ),
        "h1": "Customer Service Automation with AI",
        "intro": (
            "Customer service is where AI pays back fastest: high volume, "
            "repetitive questions, hard SLAs and expensive humans. Develo builds "
            "automation that answers customers with your live business data — "
            "orders, catalog, policies — and hands off to human operators exactly "
            "when it should."
        ),
        "crumbs": [("Solutions", "https://develo.software/solutions/"),
                   ("Customer Service Automation", "https://develo.software/solutions/customer-service-automation/")],
        "schema": ["service"],
        "sections": [
            {"t": "h2", "text": "The problems we solve"},
            {"t": "grid", "cols": 3, "items": [
                {"title": "Fragmented service",
                 "body": "Customers scattered across WhatsApp, marketplaces, web and email — with no single view of the conversation."},
                {"title": "Overloaded teams",
                 "body": "Support agents drowning in repetitive questions while complex cases wait."},
                {"title": "Generic bots",
                 "body": "Rule-based chatbots that frustrate customers and resolve nothing, because they can't see your business data."},
            ]},
            {"t": "h2", "text": "How the automation works"},
            {"t": "list", "items": [
                "Every channel (WhatsApp, marketplace, web, email) flows into a single conversational layer",
                "AI agents classify the request and answer with live data from your CRM, orders and catalog",
                "Policies and guardrails define what the AI may do on its own — and what needs a human",
                "Human operators see full context when they take over, and can supervise in real time",
                "Every conversation is tracked, measured and fed back to improve quality",
            ]},
            {"t": "h2", "text": "Results you can measure"},
            {"t": "list", "items": [
                "Higher percentage of conversations resolved without a human",
                "Lower first response time — seconds instead of hours",
                "Fewer manual hours spent reviewing and copying information",
                "Consistent answers in your brand voice, 24/7",
                "Real-time metrics: volume, resolution rate, escalation rate, satisfaction",
            ]},
            {"t": "h2", "text": "Products for this use case"},
            {"t": "links", "items": [
                {"label": "d-ialog by Develo", "href": "/solutions/d-ialog/",
                 "note": "Our conversational AI platform for WhatsApp, marketplaces and digital channels"},
                {"label": "AI for WhatsApp", "href": "/solutions/ai-for-whatsapp/",
                 "note": "WhatsApp customer service with AI agents"},
                {"label": "AI for Mercado Libre", "href": "/solutions/ai-for-mercado-libre/",
                 "note": "Marketplace question automation"},
            ]},
            {"t": "cta",
             "title": "Automate your customer service",
             "body": "Talk to Develo about automating your customer service with AI. We'll analyze your conversation volume and design the automation with you."},
        ],
    },

    # ------------------------------------------------- AI FOR WHATSAPP
    {
        "path": "/solutions/ai-for-whatsapp/",
        "lang": "en",
        "title": "AI Agents for WhatsApp Customer Service | Develo",
        "description": (
            "Integrate AI agents with WhatsApp to automate customer support, "
            "access business data and escalate conversations to human operators."
        ),
        "h1": "Automate WhatsApp Customer Service with AI",
        "intro": (
            "WhatsApp is where your customers already talk to you. Develo "
            "integrates AI agents into WhatsApp so your support team answers "
            "faster, resolves more, and scales without hiring: the AI handles "
            "the volume, your humans handle the exceptions."
        ),
        "crumbs": [("Solutions", "https://develo.software/solutions/"),
                   ("AI for WhatsApp", "https://develo.software/solutions/ai-for-whatsapp/")],
        "schema": ["service", "faq"],
        "faq": [
            {"q": "What can the WhatsApp AI agent answer for us?",
             "a": "Product information, prices, stock, order status, delivery times, return policies, store hours and FAQs — anything that can be answered from your catalog, CRM or order system. Anything else escalates to a human with full context."},
            {"q": "How does the AI access our business data?",
             "a": "Through scoped integrations: read access to your product catalog, orders and customer data via APIs or direct database connections, protected by guardrails and audit logs. The AI never sees more than its tools allow."},
            {"q": "Can customers still talk to a human?",
             "a": "Yes — human escalation is built in. You define the rules: low confidence, negative sentiment, premium customers or explicit requests route the conversation to an operator who takes over mid-chat with full history."},
            {"q": "How fast can we launch?",
             "a": "A working proof of concept typically ships in a few weeks: one channel, a set of real questions, and measurable resolution. From there we iterate toward full operation."},
            {"q": "Does this work beyond WhatsApp?",
             "a": "Yes. The same AI layer powers marketplaces (like Mercado Libre), web chat and email through d-ialog by Develo, so customers get consistent answers everywhere."},
        ],
        "sections": [
            {"t": "h2", "text": "Capabilities"},
            {"t": "list", "items": [
                "Automated customer support in natural language, in your brand voice",
                "Integration with your internal databases: catalog, orders, customers",
                "CRM integration so every answer reflects live business state",
                "Product and catalog queries, order-status queries, policy questions",
                "Human escalation and takeover with full conversation context",
                "Conversation tracking, analytics and quality reports",
                "Multiple AI agents specialized by topic or audience",
                "Guardrails and human-in-the-loop workflows for sensitive actions",
            ]},
            {"t": "h2", "text": "Architecture"},
            {"t": "code", "text": (
                "WhatsApp\n"
                "    ↓\n"
                "Develo AI Layer (routing, context, guardrails)\n"
                "    ↓\n"
                "LLM / Agent (Amazon Bedrock)\n"
                "    ↓\n"
                "Business Systems\n"
                "    ├── CRM\n"
                "    ├── ERP\n"
                "    ├── Ecommerce\n"
                "    ├── Database\n"
                "    └── Internal APIs"
            )},
            {"t": "h2", "text": "Use cases"},
            {"t": "grid", "cols": 3, "items": [
                {"title": "Order status",
                 "body": "'Where is my order?' answered instantly from your logistics data."},
                {"title": "Product questions",
                 "body": "Specs, compatibility, prices and stock — straight from your catalog."},
                {"title": "Pre-sale advice",
                 "body": "Guided recommendations that qualify leads and boost conversion."},
                {"title": "Returns & policies",
                 "body": "Consistent, policy-compliant answers to the questions that repeat most."},
                {"title": "Lead qualification",
                 "body": "Capture intent and details before a salesperson ever steps in."},
                {"title": "24/7 coverage",
                 "body": "Answers at night and on weekends, without overtime costs."},
            ]},
            {"t": "h2", "text": "Frequently asked questions"},
            {"t": "faq", "ref": True},
            {"t": "h2", "text": "The product behind it"},
            {"t": "links", "items": [
                {"label": "d-ialog by Develo", "href": "/solutions/d-ialog/",
                 "note": "The conversational AI platform that powers this automation"},
                {"label": "Customer Service Automation", "href": "/solutions/customer-service-automation/",
                 "note": "The bigger picture: every channel, one AI layer"},
                {"label": "Case Study: Tecnoland & Distriland", "href": "/case-studies/tecnoland-distriland/",
                 "note": "See a real implementation"},
            ]},
            {"t": "cta",
             "title": "Talk to Develo about automating your WhatsApp customer service",
             "body": "Send us a sample of the questions your customers ask. We'll show you what an AI agent resolves from day one."},
        ],
    },

    # ----------------------------------------------- MARKETPLACE AUTOMATION
    {
        "path": "/solutions/marketplace-automation/",
        "lang": "en",
        "title": "Marketplace & Ecommerce Automation with AI | Develo",
        "description": (
            "Automate marketplace questions, order status, returns and seller "
            "operations with AI agents that connect to your ecommerce stack."
        ),
        "h1": "Marketplace and Ecommerce Automation with AI",
        "intro": (
            "Selling on marketplaces means thousands of repetitive buyer "
            "questions: shipping times, compatibility, order status, returns. "
            "Develo builds AI agents that answer them with your live catalog and "
            "order data — protecting your seller rating and freeing your team "
            "for high-value work."
        ),
        "crumbs": [("Solutions", "https://develo.software/solutions/"),
                   ("Marketplace Automation", "https://develo.software/solutions/marketplace-automation/")],
        "schema": ["service"],
        "sections": [
            {"t": "h2", "text": "What we automate"},
            {"t": "grid", "cols": 2, "items": [
                {"title": "Buyer questions",
                 "body": "Product info, stock, prices, shipping and returns answered instantly, 24/7."},
                {"title": "Order status & logistics",
                 "body": "Live answers backed by your orders and tracking data."},
                {"title": "Returns management",
                 "body": "Policy-compliant guidance that reduces disputes and chargebacks."},
                {"title": "Seller operations",
                 "body": "Automated routines for listings, pricing, inventory sync and reporting."},
            ]},
            {"t": "h2", "text": "Why AI instead of canned replies"},
            {"t": "p", "html": (
                "Marketplace buyers ask the same question in a hundred ways, and "
                "they expect an accurate answer in seconds. Rule-based auto-"
                "replies fail on the variants; AI agents with access to your "
                "catalog and orders don't. The result: faster response times "
                "(a ranking factor on marketplaces), higher conversion and a "
                "better seller reputation."
            )},
            {"t": "h2", "text": "Related"},
            {"t": "links", "items": [
                {"label": "AI for Mercado Libre", "href": "/solutions/ai-for-mercado-libre/",
                 "note": "The largest marketplace in Latin America, specialized page"},
                {"label": "d-ialog by Develo", "href": "/solutions/d-ialog/",
                 "note": "Multi-channel conversational AI"},
                {"label": "Ecommerce & Retail", "href": "/industries/ecommerce-retail/",
                 "note": "All our ecommerce solutions in one place"},
            ]},
            {"t": "cta",
             "title": "Automate your marketplace operations",
             "body": "Tell us which marketplaces you sell on and we'll scope the automation with you."},
        ],
    },

    # ------------------------------------------------- AI FOR MERCADO LIBRE
    {
        "path": "/solutions/ai-for-mercado-libre/",
        "lang": "en",
        "title": "AI Automation for Mercado Libre Sellers | Develo",
        "description": (
            "Use artificial intelligence to automate marketplace questions, "
            "product information and customer service workflows on Mercado Libre."
        ),
        "h1": "Automate Mercado Libre Customer Questions with AI",
        "intro": (
            "Mercado Libre sellers receive hundreds of similar buyer questions "
            "every day. Develo uses artificial intelligence to automate those "
            "conversations: product information, shipping, order status and "
            "customer service — with answers grounded in your real catalog and "
            "orders, and escalation to your team when it matters."
        ),
        "crumbs": [("Solutions", "https://develo.software/solutions/"),
                   ("AI for Mercado Libre", "https://develo.software/solutions/ai-for-mercado-libre/")],
        "schema": ["service"],
        "sections": [
            {"t": "h2", "text": "What the AI automates"},
            {"t": "list", "items": [
                "Product questions: specs, compatibility, warranty, contents of the package",
                "Shipping questions: times, costs, carrier, pickup points",
                "Order status and tracking, straight from your operations data",
                "Returns and refund policy, answered consistently and compliantly",
                "Pre-sale recommendations and cross-selling from your catalog",
                "After-sale follow-ups that reduce disputes and improve your rating",
            ]},
            {"t": "h2", "text": "How it works"},
            {"t": "code", "text": (
                "Mercado Libre (buyer messages)\n"
                "    ↓\n"
                "Develo AI Layer\n"
                "    ├── Catalog sync (products, stock, prices)\n"
                "    ├── Orders & logistics data\n"
                "    └── Policies & brand tone\n"
                "    ↓\n"
                "AI Agent (Amazon Bedrock) answers in natural language\n"
                "    ↓\n"
                "Escalation to human sellers (with full context)"
            )},
            {"t": "h2", "text": "Business impact"},
            {"t": "list", "items": [
                "Faster response times — a key factor in marketplace ranking and buyer trust",
                "More questions answered with zero manual effort",
                "Fewer disputes and better seller reputation",
                "Consistent information, even when your catalog changes daily",
                "Your team focuses on exceptions and high-value customers",
            ]},
            {"t": "h2", "text": "Related"},
            {"t": "links", "items": [
                {"label": "Marketplace Automation", "href": "/solutions/marketplace-automation/",
                 "note": "Automation across all marketplaces"},
                {"label": "d-ialog by Develo", "href": "/solutions/d-ialog/",
                 "note": "The multi-channel platform behind the automation"},
                {"label": "Case Study: Tecnoland & Distriland", "href": "/case-studies/tecnoland-distriland/",
                 "note": "Real digital experience for tech ecommerce and services"},
            ]},
            {"t": "cta",
             "title": "Automate your Mercado Libre messages",
             "body": "Send us your top 10 buyer questions. We'll show you an AI agent answering all of them correctly."},
        ],
    },

    # --------------------------------------------------- API INTEGRATIONS
    {
        "path": "/solutions/api-integrations/",
        "lang": "en",
        "title": "API & System Integration Development | Develo",
        "description": (
            "Develo connects your systems: CRM, ERP, ecommerce, marketplaces, "
            "payments and internal APIs — with AI where it adds value."
        ),
        "h1": "API and System Integration Development",
        "intro": (
            "Modern businesses run on a stack of systems that rarely talk to "
            "each other. Develo designs and builds the integration layer: "
            "REST APIs, event-driven pipelines, webhooks and connectors between "
            "your CRM, ERP, ecommerce platform, marketplaces, payment providers "
            "and internal tools — so data flows once and stays consistent."
        ),
        "crumbs": [("Solutions", "https://develo.software/solutions/"),
                   ("API Integrations", "https://develo.software/solutions/api-integrations/")],
        "schema": ["service"],
        "sections": [
            {"t": "h2", "text": "What we integrate"},
            {"t": "list", "items": [
                "CRM and sales tools (customer 360°, pipelines, follow-ups)",
                "ERP and financial systems (orders, inventory, invoices)",
                "Ecommerce platforms and marketplaces (catalog, orders, stock sync)",
                "Payment providers and fraud/chargeback flows",
                "Logistics and carriers (tracking, labels, notifications)",
                "Internal systems and databases — including legacy ones",
            ]},
            {"t": "h2", "text": "Integration patterns we use"},
            {"t": "list", "items": [
                "REST and GraphQL APIs designed for your real use cases, documented and versioned",
                "Event-driven pipelines (webhooks, queues, pub/sub) for near-real-time sync",
                "Idempotent, retried and monitored data flows — no silent failures",
                "Model Context Protocol (MCP) servers that expose your systems as safe tools for AI agents",
                "Secrets management, per-partner credentials and audit logging",
            ]},
            {"t": "h2", "text": "Where AI meets integration"},
            {"t": "p", "html": (
                "An integration is the muscle; an <a href='/solutions/ai-agents/'>"
                "AI agent</a> is the brain. Once your systems are exposed as "
                "tools, agents can answer customer questions with live data, "
                "run operational workflows and surface anomalies. "
                "<a href='/technologies/'>See how MCP fits into our stack</a>."
            )},
            {"t": "h2", "text": "Related"},
            {"t": "links", "items": [
                {"label": "Custom Software Development", "href": "/solutions/custom-software-development/",
                 "note": "Build the systems, then connect them"},
                {"label": "Our Technology Stack", "href": "/technologies/",
                 "note": "AWS architecture for integrations at scale"},
            ]},
            {"t": "cta",
             "title": "Map your integrations",
             "body": "List the systems you use today and we'll draw the integration architecture — and what it costs."},
        ],
    },

    # ---------------------------------------------------------------- D-DIALOG
    {
        "path": "/solutions/d-ialog/",
        "lang": "en",
        "title": "AI Agents for WhatsApp, Marketplaces & Customer Service | d-ialog",
        "description": (
            "d-ialog by Develo is an AI conversational platform for WhatsApp, "
            "marketplaces and digital channels: fast, personalized answers with "
            "human escalation."
        ),
        "h1": "Automate Customer Service with Artificial Intelligence Agents",
        "intro": (
            "<strong>d-ialog by Develo</strong> is an intelligent conversational "
            "management platform that centralizes and supercharges communication "
            "between businesses and their customers — delivering fast, precise "
            "and personalized responses across multiple channels."
        ),
        "crumbs": [("Solutions", "https://develo.software/solutions/"),
                   ("d-ialog", "https://develo.software/solutions/d-ialog/")],
        "schema": ["software", "faq"],
        "software": {
            "name": "d-ialog",
            "description": (
                "Intelligent conversational management platform for customer "
                "service across WhatsApp, marketplaces and digital channels, "
                "with AI agents, human supervision and analytics."
            ),
            "features": [
                "Multi-channel conversation management",
                "AI agents with natural-language responses",
                "Business data integrations (CRM, orders, catalog)",
                "Real-time supervision and editing of AI conversations",
                "Human escalation and takeover",
                "Analytics and conversation tracking",
                "Continuous learning from every interaction",
            ],
        },
        "faq": [
            {"q": "What is d-ialog?",
             "a": "d-ialog by Develo is a conversational AI platform that manages customer communication across WhatsApp, marketplaces and digital channels. AI agents answer using your business data, humans supervise in real time and every conversation is tracked."},
            {"q": "Which channels does d-ialog support?",
             "a": "WhatsApp and marketplaces (including Mercado Libre), plus web and email channels. One AI layer, one supervision console, all channels."},
            {"q": "Can our team control what the AI says and does?",
             "a": "Yes. d-ialog provides real-time supervision: operators monitor AI conversations, edit responses before or after sending, define guardrails, and take over any conversation at any moment."},
            {"q": "Is our data private?",
             "a": "Conversations and business data are processed under your tenancy in the cloud, with scoped integrations and audit logs. d-ialog learns from your interactions to improve, without exposing your data to third parties."},
        ],
        "sections": [
            {"t": "h2", "text": "Why businesses choose d-ialog"},
            {"t": "grid", "cols": 2, "items": [
                {"title": "Faster, smarter support",
                 "body": "Instant, relevant responses in your brand's voice — no dead time."},
                {"title": "Scalability without losing control",
                 "body": "Handle multiple channels and users simultaneously without increasing operational costs."},
                {"title": "Real-time supervision & editing",
                 "body": "Monitor, tweak and optimize AI conversations from a single interface."},
                {"title": "Continuous learning",
                 "body": "d-ialog evolves with every interaction — improving quality and accuracy over time."},
            ]},
            {"t": "h2", "text": "Benefits"},
            {"t": "grid", "cols": 2, "items": [
                {"title": "Save operational time",
                 "body": "Fewer hours spent reviewing, more time focused on what really matters."},
                {"title": "Boost conversion and loyalty",
                 "body": "Customers get instant, clear answers that build trust."},
                {"title": "Scale without hiring",
                 "body": "Grow your business without sacrificing efficiency."},
                {"title": "Actionable data",
                 "body": "Real-time metrics to drive smarter decisions."},
            ]},
            {"t": "h2", "text": "What problem does d-ialog solve?"},
            {"t": "grid", "cols": 3, "items": [
                {"title": "Fragmented service",
                 "body": "Conversations scattered across channels become one managed, measurable flow."},
                {"title": "Overloaded teams",
                 "body": "AI absorbs the repetitive volume; humans handle what deserves a human."},
                {"title": "Generic bots",
                 "body": "Real AI that understands your business data instead of canned replies."},
            ]},
            {"t": "h2", "text": "How it works"},
            {"t": "code", "text": (
                "WhatsApp / Mercado Libre / Web / Email\n"
                "        ↓\n"
                "d-ialog conversational layer\n"
                "   ├── AI agents (Amazon Bedrock) + your business data\n"
                "   ├── Guardrails & brand tone\n"
                "   └── Real-time human supervision console\n"
                "        ↓\n"
                "Analytics: resolution, escalation, sentiment, volume"
            )},
            {"t": "h2", "text": "Frequently asked questions"},
            {"t": "faq", "ref": True},
            {"t": "h2", "text": "Explore the solutions d-ialog powers"},
            {"t": "links", "items": [
                {"label": "AI for WhatsApp", "href": "/solutions/ai-for-whatsapp/", "note": "WhatsApp customer service with AI agents"},
                {"label": "AI for Mercado Libre", "href": "/solutions/ai-for-mercado-libre/", "note": "Marketplace question automation"},
                {"label": "Case Study: Tecnoland & Distriland", "href": "/case-studies/tecnoland-distriland/", "note": "A real implementation"},
            ]},
            {"t": "cta",
             "title": "See d-ialog in action",
             "body": "Book a meeting and we'll run a live demo with questions from your own business."},
        ],
    },

    # ------------------------------------------------------- DEVELO MULTIAGENT
    {
        "path": "/solutions/develomultiagent/",
        "lang": "en",
        "title": "Multi-Agent Orchestration Platform | Develo Multi-Agent",
        "description": (
            "Develo Multi-Agent orchestrates teams of specialized AI agents with "
            "shared context, tool access via MCP and full observability for "
            "complex business workflows."
        ),
        "h1": "Develo Multi-Agent: Orchestration for Teams of AI Agents",
        "intro": (
            "When a workflow is too complex for a single AI agent, you need a "
            "team: specialized agents, each with its own tools, context and "
            "policies, coordinated by a supervisor. "
            "<strong>Develo Multi-Agent</strong> is our orchestration platform "
            "for exactly that."
        ),
        "crumbs": [("Solutions", "https://develo.software/solutions/"),
                   ("Develo Multi-Agent", "https://develo.software/solutions/develomultiagent/")],
        "schema": ["software"],
        "software": {
            "name": "Develo Multi-Agent",
            "description": (
                "Orchestration platform for teams of specialized AI agents: "
                "supervisor routing, shared context, MCP tool registry and "
                "observability for complex business workflows."
            ),
            "features": [
                "Supervisor and router patterns",
                "Specialized agents with scoped tools",
                "Shared context and persistent memory",
                "Model Context Protocol (MCP) tool registry",
                "Guardrails and human approval checkpoints",
                "Full observability: traces, cost and quality per agent",
            ],
        },
        "sections": [
            {"t": "h2", "text": "Why multi-agent?"},
            {"t": "p", "html": (
                "A single agent with 40 tools is a brittle agent: prompts "
                "collide, permissions blur, quality drops. Multi-agent "
                "orchestration splits responsibility — a <em>support agent</em> "
                "sees only support tools, a <em>billing agent</em> only billing "
                "data — while a supervisor routes work, enforces policies and "
                "escalates to humans."
            )},
            {"t": "h2", "text": "Capabilities"},
            {"t": "list", "items": [
                "Supervisor pattern: a coordinating agent decomposes goals and delegates",
                "Specialized agents with scoped tool access and dedicated guardrails",
                "Shared, persistent context so agents collaborate instead of repeating",
                "MCP-based tool registry: any system becomes a governed tool for any agent",
                "Human approval checkpoints for high-stakes actions",
                "Observability console: per-agent traces, costs, success and escalation rates",
                "Evaluation suites per agent, run on every change",
            ]},
            {"t": "h2", "text": "Reference architecture"},
            {"t": "code", "text": (
                "Goal / conversation\n"
                "        ↓\n"
                "Supervisor agent (routing, policy, escalation)\n"
                "        ├── Support agent   → CRM, orders tools\n"
                "        ├── Billing agent   → ERP, invoices tools\n"
                "        ├── Ops agent       → logistics, catalog tools\n"
                "        └── Human operators (approval & takeover)\n"
                "Shared context store · MCP tool registry · observability"
            )},
            {"t": "h2", "text": "Use cases"},
            {"t": "grid", "cols": 2, "items": [
                {"title": "Customer operations",
                 "body": "Support, billing and logistics agents working one conversation.",
                 "href": "/solutions/customer-service-automation/"},
                {"title": "Internal copilots",
                 "body": "Teams of agents that run multi-step operational workflows."},
                {"title": "Complex back-office automation",
                 "body": "Invoice reconciliation, exception handling, reporting."},
                {"title": "Research & analysis agents",
                 "body": "Specialized agents that gather, verify and summarize."},
            ]},
            {"t": "h2", "text": "Related"},
            {"t": "links", "items": [
                {"label": "AI Agents", "href": "/solutions/ai-agents/", "note": "The single-agent fundamentals"},
                {"label": "Our Technology Stack", "href": "/technologies/", "note": "Bedrock, MCP and how we build agents"},
                {"label": "d-ialog", "href": "/solutions/d-ialog/", "note": "Multi-agent customer conversation platform"},
            ]},
            {"t": "cta",
             "title": "Design your agent team",
             "body": "Tell us the workflow you want to automate and we'll propose the agent topology and a PoC plan."},
        ],
    },

    # ------------------------------------------------------------- TECHNOLOGIES
    {
        "path": "/technologies/",
        "lang": "en",
        "title": "Technologies: AWS, Bedrock, AI Agents, MCP & LLM Fine-Tuning | Develo",
        "description": (
            "The technology stack Develo engineers with: AWS, Amazon Bedrock, "
            "autonomous AI agents, Model Context Protocol (MCP), RAG and LLM "
            "fine-tuning."
        ),
        "h1": "The Technologies Develo Builds With",
        "intro": (
            "We are engineers first. This page documents the technology stack "
            "we actually build on — cloud infrastructure, large language models, "
            "agent architecture and the integration protocols that connect them."
        ),
        "crumbs": [("Technologies", "https://develo.software/technologies/")],
        "schema": ["service"],
        "hreflang": {"en": "https://develo.software/technologies/",
                     "es": "https://develo.software/es/technologies/",
                     "x-default": "https://develo.software/technologies/"},
        "sections": [
            {"t": "h2", "text": "AWS — our cloud foundation"},
            {"t": "p", "html": (
                "Everything Develo ships runs on <strong>AWS</strong>: "
                "containers (ECS/EKS) for applications, managed databases (RDS, "
                "DynamoDB, ElastiCache), S3 for data and artifacts, Lambda for "
                "event-driven work, CloudFront and Route 53 at the edge, and "
                "CloudWatch for monitoring. Our CI/CD pipelines deploy from "
                "source control on every change, with IaC for reproducible "
                "environments."
            )},
            {"t": "h2", "text": "Amazon Bedrock — hosted LLMs in the enterprise"},
            {"t": "p", "html": (
                "We run large language models through <strong>Amazon Bedrock</strong>: "
                "access to frontier models (Anthropic Claude, Llama and others) "
                "inside your own AWS tenancy, with data controls, guardrails "
                "and pay-per-use economics. Bedrock's knowledge bases and "
                "prompt management let us build RAG pipelines and governed "
                "prompt libraries without leaving the cloud."
            )},
            {"t": "h2", "text": "Autonomous AI agents"},
            {"t": "p", "html": (
                "Our flagship engineering focus is <strong>autonomous agents</strong>: "
                "systems that perceive context, plan, call tools, observe results "
                "and act toward a goal. We build the full agent stack — planning "
                "loops, memory, tool definitions, guardrails, evaluation "
                "harnesses and human-in-the-loop escalation — and orchestrate "
                "teams of specialized agents with supervisor patterns "
                "(see <a href='/solutions/develomultiagent/'>Develo "
                "Multi-Agent</a> and <a href='/solutions/ai-agents/'>AI "
                "Agents</a>)."
            )},
            {"t": "h2", "text": "Model Context Protocol (MCP)"},
            {"t": "p", "html": (
                "We adopt the <strong>Model Context Protocol (MCP)</strong>, "
                "the open standard for connecting LLMs and AI agents to tools "
                "and data. With MCP servers, your CRM, order system or internal "
                "API becomes a governed, versioned tool that any model or agent "
                "can use — with scoped permissions, audit logs and no custom "
                "glue code per model. MCP is how we keep agent capabilities "
                "interoperable and auditable as the ecosystem evolves."
            )},
            {"t": "h2", "text": "LLMs, RAG and fine-tuning"},
            {"t": "p", "html": (
                "We treat model choice as an engineering decision, not a "
                "religious one. Most products combine: strong base prompts, "
                "<strong>Retrieval-Augmented Generation (RAG)</strong> over "
                "your documents and operational data (vector search, hybrid "
                "retrieval, reranking, citations), and — where prompting and "
                "retrieval plateau — <strong>LLM fine-tuning</strong> for "
                "domain tone, format and task accuracy. Every choice is "
                "validated with evaluation suites on real business cases."
            )},
            {"t": "llm-viz", "variant": "tech"},
            {"t": "h2", "text": "Data & search layer"},
            {"t": "p", "html": (
                "Vector databases and embedding pipelines give our systems "
                "semantic access to catalogs, documents and history; hybrid "
                "search (vector + keyword + structured filters) keeps "
                "retrieval reliable. Data pipelines sync your systems in "
                "near-real-time so agents always answer with current state."
            )},
            {"t": "h2", "text": "How it fits together"},
            {"t": "code", "text": (
                "Channels (WhatsApp / Marketplace / Web / API)\n"
                "        ↓\n"
                "AWS (ECS · RDS · S3 · CloudFront · CloudWatch)\n"
                "        ↓\n"
                "Develo AI Layer\n"
                "   ├── Amazon Bedrock (LLMs + knowledge bases + guardrails)\n"
                "   ├── Agents & orchestration (single-agent · multi-agent)\n"
                "   ├── MCP servers → your systems (CRM · ERP · ecommerce · APIs)\n"
                "   └── RAG / vector search / fine-tuned models\n"
                "        ↓\n"
                "Human operators (supervision, approval, takeover)"
            )},
            {"t": "h2", "text": "Explore our solutions"},
            {"t": "links", "items": [
                {"label": "Artificial Intelligence", "href": "/solutions/artificial-intelligence/", "note": "Applied AI engineering"},
                {"label": "AI Agents", "href": "/solutions/ai-agents/", "note": "Autonomous, tool-using agents"},
                {"label": "API & System Integrations", "href": "/solutions/api-integrations/", "note": "The connections underneath"},
                {"label": "AI Agents vs Traditional Chatbots", "href": "/insights/ai-agents-vs-chatbots/", "note": "Technical deep-dive"},
            ]},
            {"t": "cta",
             "title": "Discuss architecture with our engineers",
             "body": "Bring your use case; we'll talk through models, architecture, costs and a PoC plan."},
        ],
    },

    {
        "path": "/es/technologies/",
        "lang": "es",
        "title": "Tecnologías: AWS, Bedrock, Agentes y Fine-Tuning | Develo",
        "description": (
            "Elegimos tecnología por confiabilidad y valor operativo: AWS, "
            "Amazon Bedrock, agentes autónomos, MCP, RAG y fine-tuning de LLMs."
        ),
        "h1": "Las Tecnologías con las que Construye Develo",
        "intro": (
            "Elegimos tecnología por confiabilidad, seguridad y valor operativo. "
            "Estas son las piezas que usamos para llevar software e inteligencia "
            "artificial a producción."
        ),
        "crumbs": [("Tecnologías", "https://develo.software/es/technologies/")],
        "schema": ["service"],
        "hreflang": {"en": "https://develo.software/technologies/",
                     "es": "https://develo.software/es/technologies/",
                     "x-default": "https://develo.software/technologies/"},
        "sections": [
            {"t": "h2", "text": "AWS"},
            {"t": "p", "html": (
                "Diseñamos infraestructura segura y escalable sobre "
                "<strong>AWS</strong>: cómputo, almacenamiento, redes, "
                "identidad, eventos, observabilidad y despliegues automatizados."
            )},
            {"t": "h2", "text": "Amazon Bedrock y LLMs"},
            {"t": "p", "html": (
                "Usamos <strong>Amazon Bedrock</strong> para acceder a modelos "
                "fundacionales con controles empresariales. Evaluamos calidad, "
                "latencia y costo antes de seleccionar o cambiar un LLM."
            )},
            {"t": "h2", "text": "Agentes autónomos y MCP"},
            {"t": "p", "html": (
                "Construimos <strong>agentes autónomos</strong> con herramientas "
                "explícitas mediante <strong>Model Context Protocol (MCP)</strong>, "
                "permisos mínimos, guardrails, confirmaciones y supervisión humana."
            )},
            {"t": "h2", "text": "RAG, búsqueda vectorial y conocimiento"},
            {"t": "p", "html": (
                "Combinamos <strong>Retrieval-Augmented Generation (RAG)</strong>, "
                "embeddings, bases vectoriales, reranking y fuentes visibles para "
                "responder con conocimiento dinámico y verificable."
            )},
            {"t": "h2", "text": "Fine-tuning de LLMs"},
            {"t": "p", "html": (
                "Aplicamos <strong>fine-tuning de LLMs</strong> solo cuando una "
                "evaluación demuestra que supera a instrucciones, ejemplos o RAG "
                "para el comportamiento requerido."
            )},
            {"t": "llm-viz", "variant": "tech"},
            {"t": "h2", "text": "Evaluación y observabilidad"},
            {"t": "p", "html": (
                "Registramos trazas, calidad, seguridad, latencia, costo y uso. "
                "Las evaluaciones automáticas y humanas convierten el desempeño "
                "de IA en una métrica operable."
            )},
            {"t": "h2", "text": "Dónde aplicamos esta arquitectura"},
            {"t": "links", "items": [
                {"label": "d-ialog", "href": "/solutions/d-ialog/",
                 "note": "IA conversacional multitenant"},
                {"label": "Agentes de IA", "href": "/solutions/ai-agents/",
                 "note": "Herramientas y flujos gobernados"},
                {"label": "Software a medida", "href": "/solutions/custom-software-development/",
                 "note": "Productos preparados para escalar"},
            ]},
            {"t": "cta",
             "title": "Diseñemos una arquitectura adecuada",
             "body": "La mejor tecnología es la que reduce riesgo y mejora un resultado concreto."},
        ],
    },

    # ----------------------------------------------------- INDUSTRIES / ECOMMERCE
    {
        "path": "/industries/ecommerce-retail/",
        "lang": "en",
        "title": "AI & Custom Software for Ecommerce and Retail | Develo",
        "description": (
            "Develo builds AI and custom software for ecommerce and retail: "
            "WhatsApp customer service, marketplace automation, Mercado Libre "
            "and order operations."
        ),
        "h1": "AI and Custom Software for Ecommerce and Retail",
        "intro": (
            "Ecommerce lives and dies on two things: response speed and "
            "operational efficiency. Develo works with ecommerce and retail "
            "companies to automate customer conversations, marketplace "
            "operations and internal workflows — so you sell more with the "
            "same team."
        ),
        "crumbs": [("Industries: Ecommerce & Retail", "https://develo.software/industries/ecommerce-retail/")],
        "schema": ["service"],
        "sections": [
            {"t": "h2", "text": "The challenges we solve"},
            {"t": "list", "items": [
                "Customer questions arriving on WhatsApp, marketplaces and web at all hours",
                "Repetitive buyer questions on marketplaces dragging down response-time metrics",
                "Order status, returns and warranty queries eating support hours",
                "Catalog and pricing changes that must be reflected in every answer",
                "Internal operations (inventory, pricing, reporting) that live in spreadsheets",
            ]},
            {"t": "h2", "text": "Solutions for ecommerce"},
            {"t": "grid", "cols": 2, "items": [
                {"title": "WhatsApp customer service with AI",
                 "body": "Instant answers about products, orders and deliveries, with human escalation.",
                 "href": "/solutions/ai-for-whatsapp/"},
                {"title": "Mercado Libre automation",
                 "body": "Automate buyer questions and product information to protect your seller rating.",
                 "href": "/solutions/ai-for-mercado-libre/"},
                {"title": "Marketplace automation",
                 "body": "Questions, orders, returns and seller operations, automated across marketplaces.",
                 "href": "/solutions/marketplace-automation/"},
                {"title": "Custom ecommerce platforms & integrations",
                 "body": "Internal tools, order management, catalog sync and APIs built around your operations.",
                 "href": "/solutions/custom-software-development/"},
            ]},
            {"t": "h2", "text": "Proof"},
            {"t": "p", "html": (
                "We built the digital customer experience for "
                "<strong>Tecnoland</strong> (tech services) and "
                "<strong>Distriland</strong> (tech ecommerce) — "
                "<a href='/case-studies/tecnoland-distriland/'>read the case "
                "study</a>."
            )},
            {"t": "cta",
             "title": "Grow your store without growing your costs",
             "body": "Tell us your channels and volume; we'll map the automation with the fastest return."},
        ],
    },

    # ---------------------------------------------------------- CASE STUDIES HUB
    {
        "path": "/case-studies/",
        "lang": "en",
        "title": "Case Studies & Client Results | Develo",
        "description": (
            "Real projects from Develo: digital customer experiences, AI "
            "automation and custom software for ecommerce, services and "
            "enterprise teams."
        ),
        "h1": "Case Studies: Real Projects, Measurable Results",
        "intro": (
            "Claims are cheap; implementations are not. Here we document real "
            "Develo projects: the client, the challenge, the architecture, the "
            "technology and the results."
        ),
        "crumbs": [("Case Studies", "https://develo.software/case-studies/")],
        "schema": [],
        "sections": [
            {"t": "grid", "cols": 2, "items": [
                {"title": "Tecnoland & Distriland — Digital Customer Experience",
                 "body": "Reinventing customer experience for a tech services company and a tech ecommerce brand: web experience, digital service channels and AI-powered conversations.",
                 "href": "/case-studies/tecnoland-distriland/"},
            ]},
            {"t": "callout",
             "title": "More case studies in progress",
             "body": "We publish a new detailed case study as projects mature. <a href='/contact/'>Contact us</a> for a confidential walk-through of relevant implementations."},
            {"t": "cta",
             "title": "Could your project be the next one?",
             "body": "Book a meeting and we'll show you how comparable projects were scoped and delivered."},
        ],
    },

    # ------------------------------------------------ CASE STUDY TEKNOLAND/DISTRILAND
    {
        "path": "/case-studies/tecnoland-distriland/",
        "lang": "en",
        "title": "Tecnoland & Distriland Digital Solutions Case Study | Develo",
        "description": (
            "How Develo helped Tecnoland and Distriland build a modern digital "
            "customer experience: web presence, digital service channels and "
            "AI-powered conversations."
        ),
        "h1": "Tecnoland & Distriland: A Digital Customer Experience, Built",
        "intro": (
            "Tecnoland and Distriland are part of the same tech ecosystem in "
            "Buenos Aires: Tecnoland offers professional technical services "
            "for electronic devices, Distriland sells technology products. "
            "Together they needed a modern digital presence and customer "
            "experience that could grow with the business."
        ),
        "crumbs": [("Case Studies", "https://develo.software/case-studies/"),
                   ("Tecnoland & Distriland", "https://develo.software/case-studies/tecnoland-distriland/")],
        "schema": ["article"],
        "sections": [
            {"t": "h2", "text": "Client"},
            {"t": "p", "html": (
                "Tecnoland and Distriland, Buenos Aires. Tecnoland is a "
                "technical service and repair company for consumer electronics; "
                "Distriland is an ecommerce channel for technology products. "
                "Both brands operate under the same group and share operations."
            )},
            {"t": "h2", "text": "Challenge"},
            {"t": "list", "items": [
                "Customer journeys (quote, tracking, purchase) were offline or fragmented across tools",
                "High volume of repetitive customer questions about services, products and orders",
                "Brand presence needed to scale without growing headcount",
                "The same group needed one coherent digital platform serving both brands",
            ]},
            {"t": "h2", "text": "Solution"},
            {"t": "p", "html": (
                "Develo designed and built the digital customer experience for "
                "both brands: modern web experiences for services and "
                "ecommerce, digital channels for customer interaction, and an "
                "AI conversational layer that answers customer questions using "
                "live catalog, service and order data — with human supervision "
                "and escalation. The platform was engineered to evolve, adding "
                "automation and AI capabilities over time."
            )},
            {"t": "h2", "text": "Technology"},
            {"t": "list", "items": [
                "Frontend: responsive, accessible web applications engineered for performance and SEO",
                "Backend: modular application architecture with well-defined APIs (SOLID design, clean separation of concerns)",
                "Integrations: catalog, orders and customer data connected through governed APIs",
                "AI: conversational agents on Amazon Bedrock with retrieval over business data and human-in-the-loop",
                "Infrastructure: AWS — containers, managed databases, object storage, CDN, monitoring",
                "Delivery: CI/CD from source control, automated tests, staged releases",
            ]},
            {"t": "h2", "text": "Results"},
            {"t": "list", "items": [
                "A single, coherent digital experience across both brands",
                "Faster response to customer questions, with higher share of conversations handled automatically",
                "Reduced manual workload on repetitive service and order queries",
                "A foundation for continuous automation: new channels and AI capabilities added without re-platforming",
                "The group recommends Develo as their technology partner",
            ]},
            {"t": "quote",
             "text": "Develo built the digital foundation that lets Tecnoland and Distriland grow their customer experience without growing their costs.",
             "cite": "Tecnoland & Distriland group"},
            {"t": "h2", "text": "Related"},
            {"t": "links", "items": [
                {"label": "AI for WhatsApp", "href": "/solutions/ai-for-whatsapp/", "note": "The conversational layer, in depth"},
                {"label": "Ecommerce & Retail", "href": "/industries/ecommerce-retail/", "note": "All our ecommerce solutions"},
                {"label": "d-ialog by Develo", "href": "/solutions/d-ialog/", "note": "The conversational AI platform"},
            ]},
            {"t": "cta",
             "title": "Want a project like this one?",
             "body": "Book a meeting and we'll map the scope, architecture and timeline for your business."},
        ],
    },

    # ----------------------------------------------------------------- INSIGHTS HUB
    {
        "path": "/insights/",
        "lang": "en",
        "title": "Insights: AI & Engineering Knowledge | Develo",
        "description": (
            "Technical articles from Develo's engineers: AI agents, RAG vs "
            "fine-tuning, WhatsApp automation, Mercado Libre AI and enterprise "
            "LLM architecture."
        ),
        "h1": "Insights: Technical Knowledge from Develo's Projects",
        "intro": (
            "We publish what we actually solve: engineering notes and technical "
            "comparisons from real projects — no generic 'what is AI' articles."
        ),
        "crumbs": [("Insights", "https://develo.software/insights/")],
        "schema": [],
        "sections": [
            {"t": "grid", "cols": 1, "items": [
                {"title": "AI Agents vs Traditional Chatbots: What's the Difference?",
                 "body": "Intent matching vs goal-driven action: when a chatbot is enough, when you need an agent, and how to architect both.",
                 "href": "/insights/ai-agents-vs-chatbots/"},
            ]},
            {"t": "h2", "text": "Topics we cover"},
            {"t": "list", "items": [
                "How to integrate AI with marketplaces (Mercado Libre and others)",
                "Automating customer service on WhatsApp with AI agents",
                "Human-in-the-loop AI customer service: patterns and architecture",
                "Connecting LLMs to enterprise systems safely (MCP, tool governance)",
                "RAG vs fine-tuning for enterprise AI applications",
                "Guardrails, evaluation and observability for production agents",
                "SaaS multi-tenancy: architecture, benefits and tradeoffs",
            ]},
            {"t": "cta",
             "title": "Have a technical question?",
             "body": "If it's a topic we solve daily, we're happy to talk about it. <a href='/contact/'>Contact us</a>."},
        ],
    },

    # ----------------------------------------------------- INSIGHT: AGENTS VS CHATBOTS
    {
        "path": "/insights/ai-agents-vs-chatbots/",
        "lang": "en",
        "title": "AI Agents vs Traditional Chatbots: What's the Difference? | Develo",
        "description": (
            "A technical comparison of AI agents and traditional chatbots: "
            "architecture, tool use, failure modes, cost, and how to choose the "
            "right one for your customer service."
        ),
        "h1": "AI Agents vs Traditional Chatbots: What's the Difference?",
        "intro": (
            "Both 'chat with your customers'. That's where the similarity ends. "
            "Here's the difference as we see it from building both in production."
        ),
        "crumbs": [("Insights", "https://develo.software/insights/"),
                   ("AI Agents vs Traditional Chatbots", "https://develo.software/insights/ai-agents-vs-chatbots/")],
        "schema": ["article"],
        "sections": [
            {"t": "h2", "text": "Traditional chatbot: intent → canned response"},
            {"t": "p", "html": (
                "A classic chatbot classifies the user's message into a known "
                "intent and returns a pre-written response or a fixed flow. It "
                "is cheap, predictable and fast to ship — and it works when the "
                "conversation space is small and stable: menus, simple FAQs, "
                "form collection."
            )},
            {"t": "h2", "text": "AI agent: goal → plan → tools → action"},
            {"t": "p", "html": (
                "An agent built on a large language model pursues a goal. It "
                "interprets free-form language, plans the steps, calls tools "
                "(your order system, catalog, CRM), observes the results, "
                "adapts and keeps going until the task is done — or decides it "
                "needs a human. Nothing is canned: answers are composed in "
                "real time from your live data."
            )},
            {"t": "h2", "text": "Side by side"},
            {"t": "grid", "cols": 2, "items": [
                {"title": "Chatbot",
                 "body": "Intent matching · fixed flows · static answers · fails on variants and edge cases · cheap to run · predictable behavior."},
                {"title": "AI agent",
                 "body": "Goal-driven · tool use · live answers from your data · adapts to variants and edge cases · higher run cost · needs guardrails and evaluation."},
            ]},
            {"t": "h2", "text": "Failure modes"},
            {"t": "list", "items": [
                "Chatbots fail silently: the user gets a wrong or useless canned answer and the flow ends",
                "Agents can hallucinate or over-act: that's why production agents ship with guardrails, scoped tools, audit logs and human-in-the-loop checkpoints",
                "Both need analytics: a chatbot's deflection metric and an agent's resolution/escalation rate tell you whether you're saving money or just moving the problem",
            ]},
            {"t": "h2", "text": "When to use which"},
            {"t": "list", "items": [
                "Start with a chatbot (or a small decision tree) when the question space is small and stable",
                "Move to an AI agent when you have many variants, live data dependencies (orders, catalog, stock) or multi-step tasks",
                "The winning pattern in production: agent for the long tail, human for the exceptions — not one or the other",
            ]},
            {"t": "h2", "text": "How Develo builds agents"},
            {"t": "p", "html": (
                "Our agents run on <a href='/technologies/'>Amazon "
                "Bedrock</a>, use retrieval over your business data, expose "
                "your systems as tools (increasingly via the Model Context "
                "Protocol) and ship with evaluation suites and observability. "
                "See <a href='/solutions/ai-agents/'>AI Agents for "
                "Business</a> or a concrete product: "
                "<a href='/solutions/d-ialog/'>d-ialog</a>."
            )},
            {"t": "cta",
             "title": "Not sure which you need?",
             "body": "Send us a week of real customer conversations and we'll tell you honestly what pattern fits."},
        ],
    },

    # --------------------------------------------------------------------- ABOUT
    {
        "path": "/about/",
        "lang": "en",
        "title": "About Develo: Custom Software & AI Company in Buenos Aires | Develo",
        "description": (
            "Develo is a Buenos Aires software and AI company. Who we are, what "
            "we build, our expertise, the technology we use (AWS, Bedrock, MCP) "
            "and how we work with clients."
        ),
        "h1": "About Develo",
        "intro": (
            "Develo is a software engineering and artificial intelligence "
            "company based in Buenos Aires, Argentina. We build custom "
            "software, AI agents and automation for businesses that want their "
            "digital operations to work as well as their teams do."
        ),
        "crumbs": [("About", "https://develo.software/about/")],
        "schema": [],
        "sections": [
            {"t": "h2", "text": "Who we are"},
            {"t": "p", "html": (
                "Develo is a team of engineers, data scientists and business "
                "specialists. We combine deep technical expertise with "
                "marketing and business understanding, which lets us ship "
                "solutions that are technically sound, market-ready and "
                "growth-focused. We work with companies in Argentina and across "
                "Latin America and internationally."
            )},
            {"t": "h2", "text": "What we build"},
            {"t": "list", "items": [
                "Custom software: platforms, SaaS products, internal tools and customer experiences",
                "Artificial intelligence: LLM applications, RAG systems and fine-tuned models",
                "AI agents: autonomous systems that use your data and tools to complete business tasks",
                "Automation and integrations: connecting CRM, ERP, ecommerce, marketplaces and internal systems",
                "Products: d-ialog (conversational AI) and Develo Multi-Agent (agent orchestration)",
            ]},
            {"t": "h2", "text": "Our expertise"},
            {"t": "grid", "cols": 3, "items": [
                {"title": "Software Engineering",
                 "body": "Clean architecture, testing, CI/CD and production-grade systems."},
                {"title": "Artificial Intelligence",
                 "body": "LLMs, RAG, fine-tuning, agents, evaluation and guardrails."},
                {"title": "Data",
                 "body": "Pipelines, vector search, analytics and the data products behind AI."},
                {"title": "Automation",
                 "body": "Replacing manual workflows with reliable, observable automation."},
                {"title": "Integrations",
                 "body": "APIs, event-driven architecture and MCP tool servers."},
                {"title": "Business",
                 "body": "Scope, prioritization and delivery aligned to commercial outcomes."},
            ]},
            {"t": "h2", "text": "Technology"},
            {"t": "p", "html": (
                "We build on <strong>AWS</strong>, run large language models "
                "via <strong>Amazon Bedrock</strong>, engineer "
                "<strong>autonomous AI agents</strong> with tool access over "
                "the <strong>Model Context Protocol (MCP)</strong>, and apply "
                "<strong>RAG and LLM fine-tuning</strong> where they "
                "measurably help. "
                "<a href='/technologies/'>Read the full technology stack</a>."
            )},
            {"t": "h2", "text": "How we work"},
            {"t": "grid", "cols": 4, "items": [
                {"title": "Need Exploration",
                 "body": "Analyze customer insights and business processes to define scope."},
                {"title": "PoC Design",
                 "body": "A proof of concept that validates the approach fast."},
                {"title": "MVP Development",
                 "body": "Ship business value early, then iterate."},
                {"title": "Maintenance",
                 "body": "Long-term support to keep the product current and improving."},
            ]},
            {"t": "h2", "text": "Industries"},
            {"t": "p", "html": (
                "We work most often with <a href='/industries/ecommerce-retail/'>"
                "ecommerce and retail</a> companies, services businesses and "
                "operations teams that need to scale digital customer "
                "experience without scaling headcount."
            )},
            {"t": "h2", "text": "Our clients"},
            {"t": "p", "html": (
                "Among others, the Tecnoland and Distriland group — see "
                "<a href='/case-studies/tecnoland-distriland/'>the case "
                "study</a> for the full story. <a href='/case-studies/'>"
                "Browse all case studies</a>."
            )},
            {"t": "cta",
             "title": "Let's talk",
             "body": "We're direct, technical and quick to respond. <a href='/contact/'>Contact Develo</a>."},
        ],
    },

    # ------------------------------------------------------------------- CONTACT
    {
        "path": "/contact/",
        "lang": "en",
        "title": "Contact Develo: Book a Meeting | Develo",
        "description": (
            "Contact Develo: custom software, AI agents and automation. Email "
            "info@develo.ar, call +54 11 3209-0851, or book a meeting from "
            "Buenos Aires, Argentina."
        ),
        "h1": "Let's Build the Right Solution Together",
        "intro": (
            "Tell us the problem — customer service volume, marketplace "
            "questions, a platform you need, a workflow that should not be "
            "manual — and we'll reply with a concrete next step."
        ),
        "crumbs": [("Contact", "https://develo.software/contact/")],
        "schema": [],
        "sections": [
            {"t": "h2", "text": "Ways to reach us"},
            {"t": "grid", "cols": 3, "items": [
                {"title": "Email",
                 "body": "<a href='mailto:info@develo.ar'>info@develo.ar</a> — we reply within one business day."},
                {"title": "Phone / WhatsApp",
                 "body": "<a href='tel:+541132090851'>+54 11 3209-0851</a>"},
                {"title": "Location",
                 "body": "Buenos Aires, Argentina (working across LATAM and remotely worldwide)"},
            ]},
            {"t": "h2", "text": "What happens after you write"},
            {"t": "list", "items": [
                "A short discovery call (30 min) to understand your problem and constraints",
                "A written proposal: scope, architecture, timeline and cost",
                "A proof-of-concept plan for the riskiest part of the solution",
                "No obligations — you leave with useful technical input either way",
            ]},
            {"t": "h2", "text": "Good topics to start with"},
            {"t": "links", "items": [
                {"label": "Automating WhatsApp customer service", "href": "/solutions/ai-for-whatsapp/", "note": "The most common starting point"},
                {"label": "Mercado Libre question automation", "href": "/solutions/ai-for-mercado-libre/", "note": "For active marketplace sellers"},
                {"label": "A custom platform or product", "href": "/solutions/custom-software-development/", "note": "Software built from scratch"},
                {"label": "AI agents for internal operations", "href": "/solutions/ai-agents/", "note": "Autonomous workflows with your data"},
            ]},
            {"t": "cta",
             "title": "Book a meeting with Develo",
             "body": "One email is enough to start."},
        ],
    },

    # ------------------------------------------------------------ PRIVACY POLICY
    {
        "path": "/privacy-policy/",
        "lang": "en",
        "title": "Privacy Policy | Develo",
        "description": (
            "How Develo collects, uses, shares and protects personal "
            "information from website visitors and clients, and the rights of "
            "data subjects."
        ),
        "h1": "Privacy Policy",
        "intro": (
            "At Develo we value the privacy of our visitors and clients. This "
            "Privacy Policy describes how we collect, use, share, store and "
            "protect the personal information of individuals who interact with "
            "our website or our services."
        ),
        "crumbs": [("Privacy Policy", "https://develo.software/privacy-policy/")],
        "schema": [],
        "sections": [
            {"t": "h2", "text": "1. Information we collect"},
            {"t": "p", "html": (
                "We collect information you provide directly (name, email, "
                "phone, company, and the content of your inquiries) and "
                "technical data generated automatically when you use the site "
                "(browser type, device, pages visited)."
            )},
            {"t": "h2", "text": "2. How we use your information"},
            {"t": "list", "items": [
                "To provide and personalize our services",
                "To respond to business inquiries and quotation requests",
                "To manage customer relationships",
                "To send informational or promotional communications (only with your prior consent)",
                "To improve the functionality and security of our website",
            ]},
            {"t": "h2", "text": "3. Sharing information with third parties"},
            {"t": "p", "html": (
                "We do not sell or rent personal data to third parties. We only "
                "share information with: service providers that assist us with "
                "technical or administrative operations (for example, hosting "
                "services or analytics platforms); and legal authorities, when "
                "required by law or by a court order. In all cases, we require "
                "these third parties to process personal data in a secure and "
                "appropriate manner."
            )},
            {"t": "h2", "text": "4. Your rights"},
            {"t": "p", "html": (
                "As the data subject, you have the right to: access your "
                "personal data; request the correction or update of inaccurate "
                "information; request the deletion of your personal data; "
                "object to the processing of your data for certain purposes; "
                "and withdraw your consent at any time. To exercise these "
                "rights, contact us at <a href='mailto:info@develo.ar'>"
                "info@develo.ar</a>."
            )},
            {"t": "h2", "text": "5. Cookies and similar technologies"},
            {"t": "p", "html": (
                "This website uses first-party and third-party cookies to "
                "improve the user experience, analyze website traffic and "
                "provide personalized content. You can manage or disable "
                "cookies through your browser settings; some features may not "
                "work correctly if cookies are disabled."
            )},
            {"t": "h2", "text": "6. Data retention and security"},
            {"t": "p", "html": (
                "We keep personal data only as long as needed for the purposes "
                "described in this policy or as required by law. We apply "
                "technical and organizational measures — encryption in "
                "transit, access controls and secure infrastructure — to "
                "protect your data against unauthorized access, loss or "
                "misuse."
            )},
            {"t": "h2", "text": "7. Changes to this policy"},
            {"t": "p", "html": (
                "We may update this Privacy Policy from time to time. Changes "
                "take effect when published on this page. Questions: "
                "<a href='mailto:info@develo.ar'>info@develo.ar</a>."
            )},
        ],
    },

    # ------------------------------------------------------ TERMS & CONDITIONS
    {
        "path": "/terms-and-conditions/",
        "lang": "es",
        "title": "Términos y Condiciones | Develo",
        "description": (
            "Términos y Condiciones de uso del sitio web de Develo: ámbito de "
            "aplicación, uso permitido, servicios, propiedad intelectual y "
            "jurisdicción."
        ),
        "h1": "Términos y Condiciones",
        "intro": (
            "Bienvenido al sitio web de Develo. Al acceder a este sitio y/o "
            "utilizar nuestros servicios, usted acepta los presentes Términos y "
            "Condiciones de uso. Si no está de acuerdo con alguna de las "
            "disposiciones aquí establecidas, le solicitamos que no utilice el "
            "sitio."
        ),
        "crumbs": [("Términos y Condiciones", "https://develo.software/terms-and-conditions/")],
        "schema": [],
        "sections": [
            {"t": "h2", "text": "1. Naturaleza del acuerdo"},
            {"t": "p", "html": (
                "Estos Términos y Condiciones (“T&C”) constituyen un acuerdo "
                "legal entre usted (el usuario) y Develo, y establecen las "
                "reglas y limitaciones que rigen el uso del sitio y la "
                "relación entre las partes."
            )},
            {"t": "h2", "text": "2. Ámbito de aplicación"},
            {"t": "p", "html": (
                "Este sitio está destinado exclusivamente a empresas, "
                "organizaciones y profesionales que buscan contratar servicios "
                "de desarrollo de software o soluciones tecnológicas (modelo "
                "B2B)."
            )},
            {"t": "h2", "text": "3. Uso permitido del sitio"},
            {"t": "list", "items": [
                "Utilizar el sitio únicamente con fines lícitos y profesionales",
                "No llevar a cabo actividades que puedan dañar, sobrecargar o afectar el funcionamiento del sitio",
                "No acceder sin autorización a cuentas, sistemas o redes conectadas al sitio",
                "Nos reservamos el derecho de suspender o cancelar el acceso a quienes incumplan estos términos",
            ]},
            {"t": "h2", "text": "4. Servicios ofrecidos"},
            {"t": "p", "html": (
                "Develo proporciona servicios de desarrollo de software a "
                "medida, consultoría tecnológica y soluciones digitales. Nos "
                "reservamos el derecho de modificar, suspender o discontinuar "
                "cualquier aspecto del sitio web o de nuestros servicios sin "
                "preaviso."
            )},
            {"t": "h2", "text": "5. Propiedad intelectual"},
            {"t": "p", "html": (
                "Todos los contenidos del sitio (textos, imágenes, logotipos, "
                "software, etc.) son propiedad exclusiva de Develo o de sus "
                "respectivos titulares. Queda prohibida su reproducción, "
                "distribución o modificación sin autorización expresa."
            )},
            {"t": "h2", "text": "6. Exclusión de garantía"},
            {"t": "p", "html": (
                "Este sitio y sus contenidos se proporcionan “tal como están”. "
                "Develo no garantiza que el sitio esté libre de errores, "
                "interrupciones o virus. No asumimos responsabilidad por "
                "decisiones tomadas en base a la información contenida en este "
                "sitio."
            )},
            {"t": "h2", "text": "7. Limitación de responsabilidad"},
            {"t": "p", "html": (
                "Develo no será responsable por daños directos, indirectos, "
                "incidentales o consecuentes derivados del uso del sitio web o "
                "de los servicios, en la medida permitida por la legislación "
                "aplicable."
            )},
            {"t": "h2", "text": "8. Modificaciones de los términos"},
            {"t": "p", "html": (
                "Nos reservamos el derecho de actualizar o modificar estos "
                "Términos y Condiciones en cualquier momento. Las "
                "modificaciones entran en vigor a partir de su publicación en "
                "esta página. Se recomienda revisarlos periódicamente."
            )},
            {"t": "h2", "text": "9. Ley aplicable y jurisdicción"},
            {"t": "p", "html": (
                "Este acuerdo se rige por las leyes de la República Argentina. "
                "En caso de controversia, las partes se someten a la "
                "jurisdicción de los tribunales ordinarios de la Ciudad "
                "Autónoma de Buenos Aires."
            )},
            {"t": "h2", "text": "10. Contacto"},
            {"t": "p", "html": (
                "Para consultas relacionadas con estos Términos y Condiciones, "
                "comuníquese con nosotros en <a "
                "href='mailto:info@develo.ar'>info@develo.ar</a>."
            )},
        ],
    },

    # ---------------------------------------------------------- SPANISH HOME
    {
        "path": "/es/",
        "lang": "es",
        "title": "Desarrollo de Software e Inteligencia Artificial | Develo",
        "description": (
            "Develo desarrolla software a medida, agentes de IA y "
            "automatización para atención al cliente, WhatsApp, marketplaces y "
            "operaciones digitales. Buenos Aires, Argentina."
        ),
        "h1": "Desarrollo de Software, Automatización e Inteligencia Artificial para Empresas",
        "intro": (
            "Develo es una empresa de ingeniería de software e inteligencia "
            "artificial con sede en Buenos Aires, Argentina. Diseñamos y "
            "construimos software a medida, agentes de IA y plataformas de "
            "automatización para atención al cliente, WhatsApp, marketplaces y "
            "operaciones digitales — ingenierizados en AWS con Amazon Bedrock."
        ),
        "crumbs": [],
        "schema": [],
        "hreflang": {"en": "https://develo.software/", "es": "https://develo.software/es/",
                     "x-default": "https://develo.software/"},
        "sections": [
            {"t": "h2", "text": "Qué hacemos"},
            {"t": "grid", "cols": 3, "items": [
                {"title": "Desarrollo de Software a Medida",
                 "body": "Plataformas, productos SaaS, dashboards y herramientas digitales diseñadas desde cero para su negocio.",
                 "href": "/solutions/custom-software-development/"},
                {"title": "Inteligencia Artificial",
                 "body": "IA aplicada: aplicaciones LLM, sistemas RAG, modelos fine-tuned y automatización inteligente sobre Amazon Bedrock.",
                 "href": "/solutions/artificial-intelligence/"},
                {"title": "Agentes de IA",
                 "body": "Agentes autónomos que se conectan a sus sistemas, responden a clientes y ejecutan flujos con supervisión humana.",
                 "href": "/solutions/ai-agents/"},
            ]},
            {"t": "llm-viz", "variant": "home"},
            {"t": "h2", "text": "Nuestro método: del conocimiento al impacto"},
            {"t": "grid", "cols": 4, "items": [
                {"title": "Exploración de la Necesidad",
                 "body": "Comenzamos analizando los insights del cliente para definir el alcance de la solución."},
                {"title": "Diseño de PoC",
                 "body": "Creamos e implementamos una prueba de concepto para mostrar el enfoque y la funcionalidad."},
                {"title": "Desarrollo de MVP",
                 "body": "Desarrollamos un producto que aporta valor comercial y luego lo iteramos para perfeccionarlo."},
                {"title": "Mantenimiento",
                 "body": "Soporte a largo plazo para garantizar resultados sostenibles y un producto actualizado."},
            ]},
            {"t": "h2", "text": "Producto destacado: d-ialog by Develo"},
            {"t": "p", "html": (
                "<strong>d-ialog</strong> es nuestra plataforma de gestión "
                "conversacional inteligente: conversaciones, automatizaciones y "
                "operaciones de cliente impulsadas por IA en WhatsApp, "
                "marketplaces y canales digitales, con supervisión humana en "
                "tiempo real."
            )},
            {"t": "links", "items": [
                {"label": "Conocer d-ialog", "href": "/solutions/d-ialog/",
                 "note": "Conversaciones de IA que generan resultados"},
                {"label": "Develo Multi-Agent", "href": "/solutions/develomultiagent/",
                 "note": "Orquestación de equipos de agentes de IA especializados"},
            ]},
            {"t": "h2", "text": "Soluciones por problema de negocio"},
            {"t": "grid", "cols": 3, "items": [
                {"title": "Automatización de Atención al Cliente",
                 "body": "Automatice el soporte en todos los canales con IA que conoce sus datos.",
                 "href": "/solutions/customer-service-automation/"},
                {"title": "IA para WhatsApp",
                 "body": "Agentes de IA para atención al cliente en WhatsApp con escalado a humanos.",
                 "href": "/solutions/ai-for-whatsapp/"},
                {"title": "Automatización de Marketplaces",
                 "body": "Automatice preguntas, pedidos y operaciones en marketplaces.",
                 "href": "/solutions/marketplace-automation/"},
                {"title": "IA para Mercado Libre",
                 "body": "Automatice preguntas de compradores e información de productos.",
                 "href": "/solutions/ai-for-mercado-libre/"},
                {"title": "Integraciones API y Sistemas",
                 "body": "Conecte CRM, ERP, ecommerce, marketplaces y sistemas internos.",
                 "href": "/solutions/api-integrations/"},
                {"title": "Todas las Soluciones",
                 "body": "Explore el mapa completo de lo que Develo construye.",
                 "href": "/solutions/"},
            ]},
            {"t": "h2", "text": "Resultados, no promesas"},
            {"t": "p", "html": (
                "Mostramos el trabajo. Cómo ayudamos a Tecnoland y Distriland a "
                "reinventar su experiencia de cliente digital."
            )},
            {"t": "links", "items": [
                {"label": "Caso de Estudio: Tecnoland & Distriland", "href": "/case-studies/tecnoland-distriland/",
                 "note": "Experiencia de cliente digital para servicios tech y ecommerce"},
                {"label": "Todos los Casos de Estudio", "href": "/case-studies/", "note": "Proyectos reales, resultados medibles"},
            ]},
            {"t": "h2", "text": "Por qué elegir Develo"},
            {"t": "p", "html": (
                "Somos profesionales en tecnología, marketing y ciencias "
                "empresariales enfocados en desarrollar soluciones avanzadas "
                "diseñadas para mejorar la experiencia de usuario en diversas "
                "plataformas digitales."
            )},
            {"t": "grid", "cols": 3, "items": [
                {"title": "Tecnología más inteligente",
                 "body": "Soluciones de software e inteligencia artificial de vanguardia para experiencias de usuario perfectas."},
                {"title": "Experiencia del equipo",
                 "body": "Un equipo de ingenieros y mentes empresariales que combinan creatividad con precisión."},
                {"title": "Soluciones adaptativas",
                 "body": "Desarrollo flexible y escalable adaptado a sus necesidades, que evoluciona con su negocio."},
            ]},
            {"t": "cta",
             "title": "¿Listo para construir la solución adecuada juntos?",
             "body": "Conectemos y co-creemos la tecnología que su negocio necesita."},
        ],
    },
]

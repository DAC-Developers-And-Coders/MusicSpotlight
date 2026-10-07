# MusicSpotlight (Web Crawler + API)

Web Scraper integrado a um banco de dados não relacional e a uma API criada para fornecer informações para o dashboard Front-End.

---

## 🛠️ Tecnologias Utilizadas

### **Back-end & API**
* **Python 3.13+**
* **FastAPI**
* **MongoDB** (via PyMongo)

### **Crawler & Data Ingestion**
* **Scrapy** (Framework de crawling e web scraping)
* **Curl_cffi** / Bibliotecas de requisições avançadas para bypass de bloqueios

### **Web e Front-End**
* **React Native**
* **Next.js**
* **Tailwind CSS**

---

## 📂 Estrutura do Projeto

```text
├── back-end
|    ├── api/
|    │   ├── api_requirements.txt
|    │   ├── controller.py
|    │   ├── main.py
|    │   ├── service.py
|    │   ├── Model/
|    │   │   ├── Database.py
|    │   │   └── Items.py
|    │   └── Routers/
|    │       ├── albums.py
|    │       ├── artists.py
|    │       ├── tracks.py
|    │       └── all.py
|    │
|    └──musicrawling/
|       ├── crawler_requirements.txt
|       ├── scrapy.cfg
|       └── musicrawling/
|           ├── items.py
|           ├── middlewares.py
|           ├── pipelines.py
|           ├── settings.py
|           └── spiders/
|               ├── chart_spider.py
|               └── tag_spider.py
|
└── front-end
    └── crawler-project/
       ├── public/
       |   └── assets/
       |       ├── fonts/
       |       └── images/
       └── src/
           ├── app/
           |   ├── layout.js
           |   └── page.js
           ├── components/
           |   ├── Graphic.js
           |   ├── Header.js
           |   └── Hero.js
           └── data/
               └── musicData.js

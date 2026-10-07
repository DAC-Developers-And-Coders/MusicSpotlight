# 🎵 MusicSpotlight

Web Scraper integrado a um banco de dados não relacional, uma API REST e um dashboard Front-End para visualização de informações musicais.

O projeto utiliza dados do **Last.fm**, coletados através de spiders desenvolvidos com Scrapy, armazenados em MongoDB e disponibilizados por uma API desenvolvida com FastAPI.

---

## 🧩 Funcionamento

O MusicSpotlight é dividido em três partes principais:

```text
Last.fm
   │
   ▼
┌─────────────────────┐
│      Crawler        │
│ Scrapy + curl_cffi  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│      MongoDB        │
│   music_crawler     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│        API          │
│       FastAPI       │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│      Dashboard      │
│ Next.js + React     │
└─────────────────────┘
```

O crawler coleta rankings gerais e informações relacionadas a tags musicais. Os dados são armazenados nas coleções `tracks`, `artists` e `albums`.

A API consulta o MongoDB e disponibiliza os dados em formato JSON para consumo pelo Front-End.

---

## 🛠️ Tecnologias Utilizadas

### Back-end & API

- Python 3.13+
- FastAPI
- Uvicorn
- Pydantic
- PyMongo
- MongoDB

### Crawler & Data Ingestion

- Scrapy
- curl_cffi
- PyMongo

### Front-End

- Next.js 16
- React 19
- Tailwind CSS 4
- Recharts

---

## 📂 Estrutura do Projeto

```text
├── back-end/
│   ├── api/
│   │   ├── api_requirements.txt
│   │   ├── controller.py
│   │   ├── main.py
│   │   ├── service.py
│   │   │
│   │   ├── Model/
│   │   │   ├── Database.py
│   │   │   └── Items.py
│   │   │
│   │   └── Routers/
│   │       ├── albums.py
│   │       ├── artists.py
│   │       ├── tracks.py
│   │       └── all.py
│   │
│   └── musicrawling/
│       ├── crawler_requirements.txt
│       ├── scrapy.cfg
│       │
│       └── musicrawling/
│           ├── items.py
│           ├── middlewares.py
│           ├── pipelines.py
│           ├── settings.py
│           │
│           └── spiders/
│               ├── chart_spider.py
│               └── tag_spider.py
│
├── front-end/
│   └── crawler-project/
│       ├── public/
│       │   └── assets/
│       │       ├── fonts/
│       │       └── images/
│       │
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.js
│       │   │   └── page.js
│       │   │
│       │   ├── components/
│       │   │   ├── Graphic.js
│       │   │   ├── Header.js
│       │   │   └── Hero.js
│       │   │
│       │   └── data/
│       │       └── musicData.js
│       │
│       ├── package.json
│       └── ...
│
└── README.md
```

---

# 🕷️ Crawler

O crawler está localizado em:

```text
back-end/musicrawling/
```

Ele utiliza **Scrapy** para realizar a coleta e **curl_cffi** para realizar requisições HTTP simulando um navegador.

O projeto possui dois spiders.

## `charts`

Spider responsável por coletar os rankings gerais do Last.fm.

```bash
scrapy crawl charts
```

Ele coleta:

- Top Tracks
- Top Artists
- New Releases

As informações coletadas incluem dados como:

- posição no ranking;
- nome;
- artista;
- capa/imagem;
- URL;
- URL do artista;
- horário da coleta.

O spider utiliza como página inicial:

```text
https://www.last.fm/charts
```

---

## `tags`

Spider responsável por coletar informações relacionadas a tags musicais.

```bash
scrapy crawl tags
```

A partir das tags principais encontradas no Last.fm, o crawler também identifica tags relacionadas e coleta:

- Top Tracks por tag;
- Top Artists por tag;
- Top Albums por tag.

Além das tags encontradas automaticamente, o projeto possui algumas tags adicionais configuradas manualmente.

O spider utiliza como página inicial:

```text
https://www.last.fm/music
```

Durante a execução, são exibidas informações sobre a quantidade de tags encontradas e processadas:

```text
Initial tags: ...
Related tags: ...
Processed tags: ...
```

---

# 🗄️ Banco de Dados

O projeto utiliza **MongoDB** através do PyMongo.

Por padrão, a conexão utiliza:

```text
mongodb://localhost:27017
```

O banco utilizado é:

```text
music_crawler
```

As principais collections são:

```text
tracks
artists
albums
```

O crawler cria um índice único utilizando:

```text
url + chart + tag
```

Isso evita a inserção duplicada de um mesmo registro para uma determinada categoria e tag.

Os dados também passam por pipelines de:

1. Validação;
2. Normalização;
3. Remoção de duplicatas em memória;
4. Persistência no MongoDB.

---

# 🚀 Instalação

## Pré-requisitos

Antes de executar o projeto, certifique-se de possuir:

- Python 3.13 ou superior;
- Node.js;
- npm;
- MongoDB.

---

# 🐍 Instalação do Crawler

Entre na pasta:

```bash
cd back-end/musicrawling
```

Crie um ambiente virtual:

```bash
python -m venv .venv
```

### Windows

```bash
.venv\Scripts\activate
```

### Linux/macOS

```bash
source .venv/bin/activate
```

Instale as dependências:

```bash
pip install -r crawler_requirements.txt
```

---

## Executando o Crawler

Com o MongoDB em execução:

### Rankings gerais

```bash
scrapy crawl charts
```

### Tags musicais

```bash
scrapy crawl tags
```

Os dados serão armazenados automaticamente no banco:

```text
music_crawler
```

---

# ⚡ Instalação da API

Entre na pasta:

```bash
cd back-end/api
```

Crie um ambiente virtual:

```bash
python -m venv .venv
```

### Windows

```bash
.venv\Scripts\activate
```

### Linux/macOS

```bash
source .venv/bin/activate
```

Instale as dependências:

```bash
pip install -r api_requirements.txt
```

---

# ▶️ Subindo a API

Na pasta `back-end/api`, execute:

```bash
uvicorn main:app --reload
```

A API estará disponível em:

```text
http://localhost:8000
```

A documentação interativa do FastAPI pode ser acessada em:

```text
http://localhost:8000/docs
```

---

# 🌐 Instalação do Front-End

Entre na pasta:

```bash
cd front-end/crawler-project
```

Instale as dependências:

```bash
npm install
```

Instale a biblioteca de Gráfico:

```bash
npm install recharts
```

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

O dashboard estará disponível, por padrão, em:

```text
http://localhost:3000
```

---

# 🔌 API

A API foi desenvolvida utilizando FastAPI e possui rotas separadas para:

- Tracks;
- Artists;
- Albums;
- All.

---

## 🎵 Tracks

### GET `/tracks`

Retorna as 10 músicas mais populares do ranking geral.

```text
GET /tracks
```

### GET `/tracks/{tag}`

Retorna as músicas mais populares de uma determinada tag.

Exemplo:

```text
GET /tracks/rock
```

---

## 🎤 Artists

### GET `/artists`

Retorna os 10 artistas mais populares do ranking geral.

```text
GET /artists
```

### GET `/artists/{tag}`

Retorna os artistas mais populares de uma determinada tag.

Exemplo:

```text
GET /artists/metal
```

---

## 💿 Albums

### GET `/albums`

Retorna os 10 lançamentos mais recentes do ranking geral.

```text
GET /albums
```

### GET `/albums/{tag}`

Retorna os principais álbuns de uma determinada tag.

Exemplo:

```text
GET /albums/rock
```

---

# 🔎 Consulta Geral

A rota `/all` permite consultar todos os registros disponíveis de uma determinada categoria.

### Álbuns

```text
GET /all/AL
```

### Artistas

```text
GET /all/AR
```

### Tracks

```text
GET /all/TR
```

Os parâmetros disponíveis são:

| Parâmetro | Conteúdo |
|---|---|
| `AL` | Álbuns |
| `AR` | Artistas |
| `TR` | Tracks |

Caso seja informado um parâmetro inválido, a API retorna:

```text
400 Bad Request
```

---

# 📦 Modelos de Dados

## Track

```json
{
  "rank": 1,
  "name": "Nome da música",
  "artist": "Nome do artista",
  "cover": "URL da capa",
  "url": "URL da música",
  "artist_url": "URL do artista",
  "chart": "top_tracks",
  "time": "2026-10-07T00:00:00",
  "tag": "rock"
}
```

## Artist

```json
{
  "rank": 1,
  "name": "Nome do artista",
  "image": "URL da imagem",
  "listeners": 1000000,
  "url": "URL do artista",
  "chart": "top_artists",
  "time": "2026-10-07T00:00:00",
  "tag": "rock"
}
```

## Album

```json
{
  "rank": 1,
  "name": "Nome do álbum",
  "artist": "Nome do artista",
  "cover": "URL da capa",
  "listeners": 1000000,
  "url": "URL do álbum",
  "artist_url": "URL do artista",
  "chart": "top_albums",
  "time": "2026-10-07T00:00:00",
  "tag": "rock"
}
```

---

# 🖥️ Dashboard

O Front-End foi desenvolvido utilizando **Next.js**, **React**, **Tailwind CSS** e **Recharts**.

A aplicação possui componentes responsáveis pela apresentação dos dados coletados, incluindo:

- Header;
- Hero;
- Gráficos;
- Rankings musicais;
- Filtros por tag.

A estrutura principal está localizada em:

```text
front-end/crawler-project/src/
```

---

# 🔄 Fluxo dos Dados

O funcionamento completo do sistema pode ser resumido da seguinte forma:

```text
1. Last.fm
      ↓
2. Scrapy Spider
      ↓
3. Validation Pipeline
      ↓
4. Normalize Pipeline
      ↓
5. Duplicate Pipeline
      ↓
6. MongoDB
      ↓
7. FastAPI
      ↓
8. Next.js Dashboard
```

Os dados são coletados pelo crawler e normalizados antes de serem persistidos no MongoDB. A API consulta o banco e transforma os registros em modelos Pydantic antes de disponibilizá-los ao Front-End.

---

# ⚠️ Observações

O projeto foi desenvolvido para fins **educacionais**.

O crawler utiliza:

```text
USER_AGENT = musicrawling (educational project)
```

Além disso, o Scrapy está configurado para respeitar `robots.txt`, utilizar apenas uma requisição concorrente por domínio e aplicar um intervalo entre requisições.

Recomenda-se respeitar os termos de uso e as políticas do serviço utilizado durante qualquer execução do crawler.

---

# 👨‍💻 Equipe

- **ANDRÉ VICTOR GONÇALVES NASCIMENTO** — RM 570567
- **DAVI DIAS DE SOUZA FREITAS** — RM 574089
- **DAVID MIKAEL DIAS DA SILVA** — RM 571637
- **GABRIEL NOVAGA PEREIRA** — RM 573196
- **MATHEUS MONTEIRO DA SILVA** — RM 573842

---

# 📚 Referências

- [Last.fm](https://www.last.fm/)
- [Scrapy](https://scrapy.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [MongoDB](https://www.mongodb.com/)
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)

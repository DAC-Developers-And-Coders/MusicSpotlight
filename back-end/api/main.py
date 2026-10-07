from Routers.all import router as all
from Routers.tracks import router as tr
from Routers.albums import router as al
from Routers.artists import router as ar

from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

import service

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    service.database.close()

app = FastAPI(
    title="Music API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(tr)
app.include_router(ar)
app.include_router(al)
app.include_router(all)
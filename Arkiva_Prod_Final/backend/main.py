import os
import shutil
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, Float, Boolean, Text, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL manquant dans le fichier .env")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True)
    full_name = Column(String)
    role = Column(String, default="operateur")

class Folder(Base):
    __tablename__ = "folders"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reference = Column(String, unique=True)
    client_name = Column(String)
    nss = Column(String)
    status = Column(String, default="open")
    retention_years = Column(Integer, default=10)

class Document(Base):
    __tablename__ = "documents"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    folder_id = Column(UUID(as_uuid=True), ForeignKey("folders.id"))
    file_name = Column(String)
    doc_type = Column(String, default="Inconnu")
    summary = Column(Text)
    confidence_score = Column(Float, default=0.0)
    needs_validation = Column(Boolean, default=False)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True))
    action = Column(String)
    entity_id = Column(String)
    cryptographic_hash = Column(String)

class CopilotQuery(BaseModel):
    query: str

app = FastAPI(title="Arkiva API", version="1.0")

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/var/lib/arkiva/uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/api/health")
def healthcheck():
    return {"status": "ok"}

@app.post("/api/capture/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="Aucun fichier reçu")
    safe_filename = os.path.basename(file.filename)
    base, ext = os.path.splitext(safe_filename)
    counter = 1
    while os.path.exists(os.path.join(UPLOAD_DIR, safe_filename)):
        safe_filename = f"{base}_{counter}{ext}"
        counter += 1
    file_location = os.path.join(UPLOAD_DIR, safe_filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"status": "success", "filename": safe_filename, "message": "Traitement IA en attente."}

@app.post("/api/copilot/ask")
async def ask_copilot(request: CopilotQuery):
    user_query = request.query.lower()
    if "nss manquant" in user_query:
        return {"response": "J'ai trouvé 2 dossiers avec un NSS manquant cette semaine."}
    return {"response": "Je peux rechercher des dossiers ou vérifier les anomalies."}

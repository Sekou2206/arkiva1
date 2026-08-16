import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, Float, Boolean, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import sessionmaker, declarative_base, Session
import uuid

# ==========================================
# 1. CONFIGURATION BASE DE DONNÉES
# ==========================================
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/arkiva_db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================================
# 2. MODÈLES DE DONNÉES (SQLAlchemy)
# ==========================================
class Folder(Base):
    __tablename__ = "folders"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reference = Column(String, unique=True, index=True)
    client_name = Column(String)
    nss = Column(String)
    status = Column(String, default="open")

class Document(Base):
    __tablename__ = "documents"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    folder_id = Column(UUID(as_uuid=True), ForeignKey("folders.id"))
    file_name = Column(String)
    doc_type = Column(String, default="Inconnu")
    ocr_text = Column(Text)
    summary = Column(Text)
    confidence_score = Column(Float, default=0.0)
    needs_validation = Column(Boolean, default=False)

# ==========================================
# 3. SCHÉMAS PYDANTIC (Pour l'API)
# ==========================================
class CopilotQuery(BaseModel):
    query: str

# ==========================================
# 4. INIT FASTAPI & MIDDLEWARE
# ==========================================
app = FastAPI(title="Arkiva API Beta", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ==========================================
# 5. ROUTES API (Capture & Copilote)
# ==========================================
@app.get("/")
def read_root():
    return {"status": "Arkiva API is running"}

@app.post("/api/capture/upload")
async def upload_document(file: UploadFile = File(...)):
    """Reçoit un document scanné, le sauvegarde localement."""
    if not file:
        raise HTTPException(status_code=400, detail="Aucun fichier reçu")
    
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "status": "success",
        "filename": file.filename,
        "message": "Document reçu. Traitement IA en attente."
    }

@app.post("/api/copilot/ask")
async def ask_copilot(request: CopilotQuery):
    """Simule une réponse du copilote IA."""
    user_query = request.query.lower()
    
    if "nss manquant" in user_query:
        return {"response": "J'ai trouvé 2 dossiers avec un NSS manquant cette semaine : Dossier 123 et Dossier 456."}
    elif "dupont" in user_query:
        return {"response": "Le dossier de Mme Dupont contient 3 pièces. Le dernier courrier date du 15/10/2023."}
    else:
        return {"response": "Je n'ai pas compris la requête. Je peux rechercher des dossiers ou vérifier les NSS manquants."}

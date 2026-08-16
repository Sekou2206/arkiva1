CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(100) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    nss VARCHAR(15),
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    folder_id UUID REFERENCES folders(id),
    file_name VARCHAR(255) NOT NULL,
    doc_type VARCHAR(50) DEFAULT 'Inconnu',
    ocr_text TEXT,
    summary TEXT,
    confidence_score FLOAT DEFAULT 0.0,
    needs_validation BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

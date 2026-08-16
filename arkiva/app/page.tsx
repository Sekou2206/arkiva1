"use client";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Tableau de bord");
  const [documents, setDocuments] = useState([
    { id: "DOC-001", ref: "2023-456", type: "Courrier", client: "Dupont Jean", date: "15/10/2023", status: "Attente", badge: "bg-yellow-100 text-yellow-800", nss: "1 23 45 678 901", summary: "Demande de prise en charge pour soin dentaire." },
    { id: "DOC-002", ref: "2023-457", type: "Formulaire", client: "Martin Marie", date: "15/10/2023", status: "Archivé", badge: "bg-green-100 text-green-800", nss: "2 87 12 345 678", summary: "Formulaire de consentement signé." },
  ]);
  const [logs, setLogs] = useState([
    { user: "admin@arkiva", action: "CONNEXION", doc: "Système", time: "16:00:01" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fonction pour ajouter une ligne au journal d'audit
  const addLog = (action, docId) => {
    const now = new Date();
    const time = now.toLocaleTimeString('fr-FR');
    setLogs(prev => [{ user: "admin@arkiva", action, doc: docId, time }, ...prev]);
  };

  // Simuler la numérisation et l'OCR
  const handleSimulateScan = () => {
    setIsLoading(true);
    addLog("NUMERISATION_DEBUT", "Nouveau Lot");
    
    setTimeout(() => {
      const newDoc = {
        id: `DOC-${Math.floor(Math.random() * 10000)}`,
        ref: `2023-${Math.floor(Math.random() * 1000)}`,
        type: ["Courrier", "Formulaire", "Identité"][Math.floor(Math.random() * 3)],
        client: ["Bernard Sophie", "Durand Paul", "Lefevre Luc"][Math.floor(Math.random() * 3)],
        date: new Date().toLocaleDateString('fr-FR'),
        status: "Attente",
        badge: "bg-yellow-100 text-yellow-800",
        nss: "1 99 88 77 660 55",
        summary: "Document analysé par l'IA. En attente de vérification humaine (ISO 9001)."
      };
      setDocuments(prev => [newDoc, ...prev]);
      setIsLoading(false);
      addLog("OCR_IA_TERMINE", newDoc.id);
      setActiveTab("Tableau de bord");
    }, 2500); // Simule un traitement IA de 2.5 secondes
  };

  // Valider un document
  const validateDoc = (id) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: "Archivé", badge: "bg-green-100 text-green-800" } : d));
    addLog("VALIDATION_HUMAINE", id);
    setSelectedDoc(null);
  };

  // Filtrer les documents pour la recherche
  const filteredDocs = documents.filter(doc => 
    doc.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.ref.includes(searchQuery) || 
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menu = ["Tableau de bord", "Dossiers", "Numérisation", "Recherche", "Emplacements", "Bordereaux", "Journal", "Paramètres"];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-56 bg-slate-800 text-white flex flex-col">
        <div className="p-4 text-lg font-bold border-b border-slate-700">Arkiva GED</div>
        <nav className="flex-1 py-4">
          {menu.map((item) => (
            <button 
              key={item} 
              onClick={() => setActiveTab(item)}
              className={`w-full text-left block py-2.5 px-5 text-sm transition-all ${activeTab === item ? 'bg-blue-600 border-l-4 border-blue-800' : 'hover:bg-slate-700'}`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="p-4 text-xs text-slate-500 border-t border-slate-700">
          Version Beta<br/>Conforme ISO 9001 · 27001
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white p-4 border-b flex justify-between items-center shadow-sm sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-slate-800">{activeTab}</h1>
          {activeTab === "Tableau de bord" && (
            <button onClick={() => setActiveTab("Numérisation")} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">+ Nouveau Lot</button>
          )}
          {activeTab === "Dossiers" && (
            <button onClick={handleSimulateScan} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">+ Nouveau Dossier</button>
          )}
        </header>

        <div className="p-6">
          {/* TABLEAU DE BORD */}
          {activeTab === "Tableau de bord" && (
            <div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded border shadow-sm"><h3 className="text-xs text-gray-500 uppercase font-medium">Documents Totaux</h3><p className="text-2xl font-bold mt-1 text-gray-800">{documents.length}</p></div>
                <div className="bg-white p-4 rounded border shadow-sm"><h3 className="text-xs text-gray-500 uppercase font-medium">En cours</h3><p className="text-2xl font-bold mt-1 text-blue-600">{documents.filter(d => d.status === "Attente").length}</p></div>
                <div className="bg-white p-4 rounded border shadow-sm"><h3 className="text-xs text-gray-500 uppercase font-medium">Archivés</h3><p className="text-2xl font-bold mt-1 text-green-600">{documents.filter(d => d.status === "Archivé").length}</p></div>
                <div className="bg-white p-4 rounded border shadow-sm"><h3 className="text-xs text-gray-500 uppercase font-medium">Erreurs</h3><p className="text-2xl font-bold mt-1 text-red-600">0</p></div>
              </div>

              <div className="bg-white rounded border shadow-sm">
                <div className="p-4 border-b font-semibold text-slate-700 text-sm">Derniers documents numérisés</div>
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 text-gray-500 text-left"><th className="p-3 font-medium">Référence</th><th className="p-3 font-medium">Type</th><th className="p-3 font-medium">Client</th><th className="p-3 font-medium">Date</th><th className="p-3 font-medium">Statut</th></tr></thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} onClick={() => setSelectedDoc(doc)} className="border-b hover:bg-blue-50 cursor-pointer transition-colors">
                        <td className="p-3 text-blue-600 font-medium">{doc.ref}</td><td className="p-3">{doc.type}</td><td className="p-3">{doc.client}</td><td className="p-3">{doc.date}</td>
                        <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-bold ${doc.badge}`}>{doc.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DOSSIERS */}
          {activeTab === "Dossiers" && (
            <div className="bg-white p-6 rounded border shadow-sm">
              <h2 className="text-lg font-bold mb-4">Gestion des Dossiers (ISO 15489)</h2>
              <p className="text-sm text-gray-600 mb-4">Cliquez sur un dossier pour voir les détails et le valider.</p>
              <div className="grid grid-cols-2 gap-4">
                {documents.map(doc => (
                  <div key={doc.id} onClick={() => setSelectedDoc(doc)} className="p-4 border rounded hover:shadow-md cursor-pointer transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-blue-700">{doc.ref}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${doc.badge}`}>{doc.status}</span>
                    </div>
                    <p className="text-sm font-medium">{doc.client}</p>
                    <p className="text-xs text-gray-500 mt-1">{doc.type} - {doc.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NUMÉRISATION */}
          {activeTab === "Numérisation" && (
            <div className="bg-white p-6 rounded border shadow-sm">
              <h2 className="text-lg font-bold mb-4">Numérisation & Contrôle Qualité (ISO 9001 & 19005)</h2>
              <div className={`border-2 border-dashed rounded-lg p-10 text-center mb-6 transition-colors ${isLoading ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                {isLoading ? (
                  <div>
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"></div>
                    <p className="text-blue-600 font-medium">Traitement IA en cours... (OCR, Redressement, PDF/A)</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-500 mb-4">Simulez l'envoi d'un document scanné</p>
                    <button onClick={handleSimulateScan} className="bg-blue-600 text-white px-6 py-3 rounded text-sm font-medium hover:bg-blue-700">Lancer la numérisation simulée</button>
                  </div>
                )}
              </div>
              <div className="p-4 border rounded bg-green-50">
                <h3 className="font-semibold text-sm mb-2 text-green-800">Contrôles Automatiques</h3>
                <ul className="text-sm space-y-1 text-green-700">
                  <li>✓ Conversion PDF/A (ISO 19005)</li>
                  <li>✓ Détection DataMatrix</li>
                  <li>✓ Extraction NSS & Nom (IA)</li>
                </ul>
              </div>
            </div>
          )}

          {/* RECHERCHE */}
          {activeTab === "Recherche" && (
            <div className="bg-white p-6 rounded border shadow-sm">
              <h2 className="text-lg font-bold mb-4">Recherche Documentaire</h2>
              <div className="flex gap-4 mb-6">
                <input 
                  type="text" 
                  placeholder="Tapez un nom, une référence ou un type..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div className="space-y-2">
                {filteredDocs.length > 0 ? (
                  filteredDocs.map(doc => (
                    <div key={doc.id} onClick={() => setSelectedDoc(doc)} className="p-3 border rounded hover:bg-gray-50 cursor-pointer flex justify-between">
                      <span>{doc.client} <span className="text-xs text-gray-500">({doc.type})</span></span>
                      <span className="text-blue-600 font-medium">{doc.ref}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Aucun résultat trouvé.</p>
                )}
              </div>
            </div>
          )}

          {/* EMPLEMENTS */}
          {activeTab === "Emplacements" && (
            <div className="bg-white p-6 rounded border shadow-sm">
              <h2 className="text-lg font-bold mb-4">Emplacements Physiques</h2>
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-gray-500 text-left"><th className="p-3 font-medium">Rayonnage</th><th className="p-3 font-medium">Boîte</th><th className="p-3 font-medium">Dossier Lié</th><th className="p-3 font-medium">Statut</th></tr></thead>
                <tbody>
                  <tr className="border-b"><td className="p-3">A1</td><td className="p-3">B12</td><td className="p-3 text-blue-600">{documents[0]?.ref || "N/A"}</td><td className="p-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">En attente</span></td></tr>
                  <tr className="border-b"><td className="p-3">B4</td><td className="p-3">C03</td><td className="p-3 text-blue-600">{documents[1]?.ref || "N/A"}</td><td className="p-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Archivé</span></td></tr>
                </tbody>
              </table>
            </div>
          )}

          {/* BORDEREAUX */}
          {activeTab === "Bordereaux" && (
            <div className="bg-white p-6 rounded border shadow-sm">
              <h2 className="text-lg font-bold mb-4">Bordereaux de Destruction (Sort Final)</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 border rounded bg-red-50">
                  <div><span className="font-medium">Lot #001</span><br/><span className="text-xs text-gray-500">1 dossier prêt pour destruction</span></div>
                  <button onClick={() => alert("Bordereau PDF générée ! (Simulation)")} className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">Générer Bordereau</button>
                </div>
              </div>
            </div>
          )}

          {/* JOURNAL */}
          {activeTab === "Journal" && (
            <div className="bg-white p-6 rounded border shadow-sm">
              <h2 className="text-lg font-bold mb-4">Journal d'Audit (ISO 27001)</h2>
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-gray-500 text-left"><th className="p-3 font-medium">Utilisateur</th><th className="p-3 font-medium">Action</th><th className="p-3 font-medium">Cible</th><th className="p-3 font-medium">Heure</th></tr></thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-xs">{log.user}</td><td className="p-3 font-medium text-blue-600">{log.action}</td><td className="p-3">{log.doc}</td><td className="p-3 text-gray-500">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PARAMÈTRES */}
          {activeTab === "Paramètres" && (
            <div className="bg-white p-6 rounded border shadow-sm">
              <h2 className="text-lg font-bold mb-4">Sécurité & Confidentialité (ISO 27001 & 27701)</h2>
              <div className="space-y-4">
                <div className="p-4 border rounded flex justify-between items-center">
                  <div><h3 className="font-semibold text-sm">Double Authentification (MFA)</h3><p className="text-xs text-gray-500">Obligatoire pour tous les comptes administrateurs</p></div>
                  <button className="w-12 h-6 bg-blue-600 rounded-full relative"><span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span></button>
                </div>
                <div className="p-4 border rounded flex justify-between items-center">
                  <div><h3 className="font-semibold text-sm">Chiffrement AES-256</h3><p className="text-xs text-gray-500">Données au repos chiffrées</p></div>
                  <button className="w-12 h-6 bg-blue-600 rounded-full relative"><span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span></button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALE DE DÉTAIL DU DOCUMENT */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setSelectedDoc(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Détail du Document : {selectedDoc.ref}</h2>
              <button onClick={() => setSelectedDoc(null)} className="text-gray-500 hover:text-gray-800 text-xl">x</button>
            </div>
            <div className="p-6 flex gap-6">
              <div className="w-1/3 bg-gray-100 rounded flex items-center justify-center h-48">
                <span className="text-gray-400 text-sm">Aperçu PDF/A</span>
              </div>
              <div className="flex-1 space-y-3">
                <div><span className="text-xs text-gray-500 uppercase">Client</span><p className="font-medium">{selectedDoc.client}</p></div>
                <div><span className="text-xs text-gray-500 uppercase">Type</span><p className="font-medium">{selectedDoc.type}</p></div>
                <div><span className="text-xs text-gray-500 uppercase">NSS</span><p className="font-medium font-mono">{selectedDoc.nss}</p></div>
                <div><span className="text-xs text-gray-500 uppercase">Résumé IA</span><p className="text-sm bg-blue-50 p-2 rounded">{selectedDoc.summary}</p></div>
                <div><span className="text-xs text-gray-500 uppercase">Statut</span><p><span className={`px-2 py-1 rounded text-xs font-bold ${selectedDoc.badge}`}>{selectedDoc.status}</span></p></div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button onClick={() => setSelectedDoc(null)} className="px-4 py-2 border rounded text-sm hover:bg-gray-50">Fermer</button>
              {selectedDoc.status === "Attente" && (
                <button onClick={() => validateDoc(selectedDoc.id)} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">Valider et Archiver</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

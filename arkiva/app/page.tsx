"use client";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Tableau de bord");

  const menu = [
    "Tableau de bord", 
    "Dossiers", 
    "Numérisation", 
    "Recherche", 
    "Emplacements", 
    "Bordereaux", 
    "Journal", 
    "Paramètres"
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-56 bg-slate-800 text-white flex flex-col">
        <div className="p-4 text-lg font-bold border-b border-slate-700">Arkiva GED</div>
        <nav className="flex-1 py-4">
          {menu.map((item) => (
            <button 
              key={item} 
              onClick={() => setActiveTab(item)}
              className={`w-full text-left block py-2.5 px-5 text-sm ${activeTab === item ? 'bg-blue-600 border-l-4 border-blue-800' : 'hover:bg-slate-700'}`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="p-4 text-xs text-slate-500 border-t border-slate-700">
          Conforme ISO 9001 · 27001<br/>ISO 15489 · 27701 · 19005
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="bg-white p-4 border-b flex justify-between items-center shadow-sm">
          <h1 className="text-lg font-semibold text-slate-800">{activeTab}</h1>
          {activeTab === "Tableau de bord" && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">+ Nouveau Lot</button>
          )}
        </header>

        {/* Content */}
        <div className="p-6">
          {activeTab === "Tableau de bord" && <DashboardView />}
          {activeTab === "Dossiers" && <DossiersView />}
          {activeTab === "Numérisation" && <NumerisationView />}
          {activeTab === "Recherche" && <RechercheView />}
          {activeTab === "Emplacements" && <EmplacementsView />}
          {activeTab === "Bordereaux" && <BordereauxView />}
          {activeTab === "Journal" && <JournalView />}
          {activeTab === "Paramètres" && <ParametresView />}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// VUES DES ONGLETS
// ==========================================

function DashboardView() {
  const stats = [
    { title: "Documents Totaux", value: "12 540", color: "text-gray-800" },
    { title: "En cours de traitement", value: "4", color: "text-blue-600" },
    { title: "En attente de validation", value: "12", color: "text-yellow-600" },
    { title: "Erreurs OCR / IA", value: "2", color: "text-red-600" },
  ];
  const documents = [
    { ref: "2023-456", type: "Courrier Entrant", client: "Dupont Jean", date: "15/10/2023", status: "Attente", badge: "bg-yellow-100 text-yellow-800" },
    { ref: "2023-457", type: "Formulaire", client: "Martin Marie", date: "15/10/2023", status: "Archivé", badge: "bg-green-100 text-green-800" },
  ];
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-4 rounded border shadow-sm">
            <h3 className="text-xs text-gray-500 uppercase font-medium">{stat.title}</h3>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded border shadow-sm">
        <div className="p-4 border-b font-semibold text-slate-700 text-sm">Derniers documents numérisés</div>
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-gray-500 text-left"><th className="p-3 font-medium">Référence</th><th className="p-3 font-medium">Type</th><th className="p-3 font-medium">Client</th><th className="p-3 font-medium">Date</th><th className="p-3 font-medium">Statut</th></tr></thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.ref} className="border-b hover:bg-gray-50">
                <td className="p-3 text-blue-600">{doc.ref}</td><td className="p-3">{doc.type}</td><td className="p-3">{doc.client}</td><td className="p-3">{doc.date}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-bold ${doc.badge}`}>{doc.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DossiersView() {
  return (
    <div className="bg-white p-6 rounded border shadow-sm">
      <h2 className="text-lg font-bold mb-4">Gestion des Dossiers (ISO 15489)</h2>
      <p className="text-sm text-gray-600 mb-4">Gestion du cycle de vie, métadonnées, conservation et sort final des archives.</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded bg-gray-50">
          <h3 className="font-semibold text-sm mb-2">Cycle de vie actif</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• Création et classement maîtrisés</li>
            <li>• Métadonnées indexées (NSS, Nom, Date)</li>
            <li>• Statut : Ouvert / Clos / Archivé</li>
          </ul>
        </div>
        <div className="p-4 border rounded bg-gray-50">
          <h3 className="font-semibold text-sm mb-2">Durée de conservation</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• 5 ans (Dossiers salariés)</li>
            <li>• 10 ans (Dossiers clients)</li>
            <li>• 30 ans (Actes de naissance)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function NumerisationView() {
  return (
    <div className="bg-white p-6 rounded border shadow-sm">
      <h2 className="text-lg font-bold mb-4">Numérisation & Contrôle Qualité (ISO 9001 & 19005)</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center mb-6">
        <p className="text-gray-500 mb-2">Glissez-déposez vos fichiers scannés ici</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Parcourir les fichiers</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded bg-green-50">
          <h3 className="font-semibold text-sm mb-2 text-green-800">Contrôle Qualité Image</h3>
          <ul className="text-sm space-y-1 text-green-700">
            <li>✓ Résolution et lisibilité vérifiées</li>
            <li>✓ Recadrage et redressement automatiques</li>
            <li>✓ Contrôle du nombre de pages</li>
          </ul>
        </div>
        <div className="p-4 border rounded bg-blue-50">
          <h3 className="font-semibold text-sm mb-2 text-blue-800">Format d'Archivage (ISO 19005)</h3>
          <ul className="text-sm space-y-1 text-blue-700">
            <li>✓ Conversion automatique en PDF/A</li>
            <li>✓ Conservation à long terme garantie</li>
            <li>✓ Intégrité du document préservée</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function RechercheView() {
  return (
    <div className="bg-white p-6 rounded border shadow-sm">
      <h2 className="text-lg font-bold mb-4">Recherche Documentaire</h2>
      <div className="flex gap-4 mb-4">
        <input type="text" placeholder="Nom, NSS, Référence..." className="flex-1 border p-2 rounded text-sm" />
        <button className="bg-slate-800 text-white px-4 py-2 rounded text-sm">Rechercher</button>
      </div>
      <p className="text-sm text-gray-500">Aucun résultat. Affinez votre recherche par mots-clés ou par date.</p>
    </div>
  );
}

function EmplacementsView() {
  return (
    <div className="bg-white p-6 rounded border shadow-sm">
      <h2 className="text-lg font-bold mb-4">Emplacements Physiques (ISO 15489)</h2>
      <table className="w-full text-sm">
        <thead><tr className="bg-gray-50 text-gray-500 text-left"><th className="p-3 font-medium">Rayonnage</th><th className="p-3 font-medium">Boîte</th><th className="p-3 font-medium">Dossier</th><th className="p-3 font-medium">Statut</th></tr></thead>
        <tbody>
          <tr className="border-b"><td className="p-3">A1</td><td className="p-3">B12</td><td className="p-3">2023-456</td><td className="p-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">En attente destruction</span></td></tr>
          <tr className="border-b"><td className="p-3">B4</td><td className="p-3">C03</td><td className="p-3">2023-457</td><td className="p-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Archivé</span></td></tr>
        </tbody>
      </table>
    </div>
  );
}

function BordereauxView() {
  return (
    <div className="bg-white p-6 rounded border shadow-sm">
      <h2 className="text-lg font-bold mb-4">Bordereaux de Destruction (Sort Final - ISO 15489)</h2>
      <p className="text-sm text-gray-600 mb-4">Liste des dossiers ayant atteint leur durée de conservation légale et prêts pour destruction physique.</p>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 border rounded">
          <span className="text-sm font-medium">Lot de destruction #001 (12 dossiers)</span>
          <button className="bg-red-600 text-white px-3 py-1 rounded text-xs">Générer PDF</button>
        </div>
        <div className="flex justify-between items-center p-3 border rounded">
          <span className="text-sm font-medium">Lot de destruction #002 (5 dossiers)</span>
          <button className="bg-red-600 text-white px-3 py-1 rounded text-xs">Générer PDF</button>
        </div>
      </div>
    </div>
  );
}

function JournalView() {
  const logs = [
    { user: "admin@arkiva", action: "CONSULTATION", doc: "2023-456", time: "16:32:01" },
    { user: "operateur@arkiva", action: "VALIDATION_INDEX", doc: "2023-457", time: "16:30:15" },
    { user: "system", action: "CONVERSION_PDFA", doc: "2023-458", time: "16:28:00" },
  ];
  return (
    <div className="bg-white p-6 rounded border shadow-sm">
      <h2 className="text-lg font-bold mb-4">Journal d'Audit & Traçabilité (ISO 27001)</h2>
      <table className="w-full text-sm">
        <thead><tr className="bg-gray-50 text-gray-500 text-left"><th className="p-3 font-medium">Utilisateur</th><th className="p-3 font-medium">Action</th><th className="p-3 font-medium">Document</th><th className="p-3 font-medium">Heure</th></tr></thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="p-3 font-mono text-xs">{log.user}</td><td className="p-3 font-medium text-blue-600">{log.action}</td><td className="p-3">{log.doc}</td><td className="p-3 text-gray-500">{log.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ParametresView() {
  return (
    <div className="bg-white p-6 rounded border shadow-sm">
      <h2 className="text-lg font-bold mb-4">Sécurité & Confidentialité (ISO 27001 & 27701)</h2>
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h3 className="font-semibold text-sm mb-2">Gestion des accès (ISO 27001)</h3>
          <p className="text-sm text-gray-600">Authentification MFA obligatoire. Droits des utilisateurs strictement limités au principe du moindre privilège.</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold text-sm mb-2">Protection des données personnelles (ISO 27701)</h3>
          <p className="text-sm text-gray-600">Chiffrement de bout en bout (AES-256). Registre des traitements RGPD à jour. Données de santé (HDS) isolées.</p>
        </div>
      </div>
    </div>
  );
}

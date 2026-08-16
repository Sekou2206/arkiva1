"use client";

export default function Home() {
  const stats = [
    { title: "Documents Totaux", value: "12 540", color: "text-gray-800" },
    { title: "En cours de traitement", value: "4", color: "text-blue-600" },
    { title: "En attente de validation", value: "12", color: "text-yellow-600" },
    { title: "Erreurs OCR / IA", value: "2", color: "text-red-600" },
  ];

  const documents = [
    { ref: "2023-456", type: "Courrier Entrant", client: "Dupont Jean", date: "15/10/2023", status: "Attente", badge: "bg-yellow-100 text-yellow-800" },
    { ref: "2023-457", type: "Formulaire", client: "Martin Marie", date: "15/10/2023", status: "Archivé", badge: "bg-green-100 text-green-800" },
    { ref: "2023-458", type: "Identité", client: "Durand Paul", date: "14/10/2023", status: "Erreur NSS", badge: "bg-red-100 text-red-800" },
  ];

  const menu = ["Tableau de bord", "Dossiers", "Numérisation", "Recherche", "Emplacements", "Bordereaux", "Journal", "Paramètres"];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-56 bg-slate-800 text-white flex flex-col">
        <div className="p-4 text-lg font-bold border-b border-slate-700">Arkiva GED</div>
        <nav className="flex-1 py-4">
          {menu.map((item, index) => (
            <a 
              key={item} 
              href="#" 
              className={`block py-2.5 px-5 text-sm ${index === 0 ? 'bg-blue-600 border-l-4 border-blue-800' : 'hover:bg-slate-700'}`}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="bg-white p-4 border-b flex justify-between items-center shadow-sm">
          <h1 className="text-lg font-semibold text-slate-800">Tableau de bord</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">+ Nouveau Lot</button>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div key={stat.title} className="bg-white p-4 rounded border shadow-sm">
                <h3 className="text-xs text-gray-500 uppercase font-medium">{stat.title}</h3>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded border shadow-sm">
            <div className="p-4 border-b font-semibold text-slate-700 text-sm">Derniers documents numérisés</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-left">
                  <th className="p-3 font-medium">Référence</th>
                  <th className="p-3 font-medium">Type</th>
                  <th className="p-3 font-medium">Client</th>
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.ref} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-blue-600">{doc.ref}</td>
                    <td className="p-3">{doc.type}</td>
                    <td className="p-3">{doc.client}</td>
                    <td className="p-3">{doc.date}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${doc.badge}`}>{doc.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

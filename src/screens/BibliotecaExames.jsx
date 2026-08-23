import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import { 
  FileText, Upload, Camera, Clock, CheckCircle2, MessageSquare, Plus, X, Eye, 
  ArrowRight, ShieldCheck, AlertCircle, FolderOpen, FolderClosed, Move, Sparkles
} from "lucide-react";

export default function BibliotecaExames() {
  const { user, userDocuments, setUserDocuments, uploadDocument } = useApp();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState(null); // 'ultrassom' | 'sangue' | 'outros' | null
  const [hoveredDrawer, setHoveredDrawer] = useState(null); // 'ultrassom' | 'sangue' | 'outros' | null
  
  // Form states
  const [docTitle, setDocTitle] = useState("");
  const [docType, setDocType] = useState("Ultrassonografia");
  const [uploadSource, setUploadSource] = useState(null); // 'camera' | 'file' | null
  const [cameraCaptured, setCameraCaptured] = useState(false);
  const [fileAttached, setFileAttached] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Filter documents for the current mother
  const myDocs = userDocuments.filter((d) => d.patientEmail === user.email);

  // Unorganized documents (no drawer assigned or drawer === 'recentes')
  const unorganizedDocs = myDocs.filter(d => !d.drawer || d.drawer === "recentes");

  // Documents in specific drawers
  const getDocsInDrawer = (drawerName) => {
    return myDocs.filter(d => d.drawer === drawerName);
  };

  const handleOpenUpload = (source) => {
    setUploadSource(source);
    if (source === "camera") {
      setCameraCaptured(false);
    } else {
      setFileAttached(false);
    }
  };

  const handleSimulateCapture = () => {
    if (uploadSource === "camera") {
      setCameraCaptured(true);
    } else {
      setFileAttached(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    let simulatedUrl = "";
    if (docType === "Ultrassonografia") {
      simulatedUrl = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60";
    } else {
      simulatedUrl = "https://images.unsplash.com/photo-1579154204601-01588f351167?w=800&auto=format&fit=crop&q=60";
    }

    // Call context to upload (automatically goes to 'recentes' drawer)
    uploadDocument(docTitle, docType, simulatedUrl);
    
    // Reset and close
    setDocTitle("");
    setDocType("Ultrassonografia");
    setUploadSource(null);
    setShowUploadModal(false);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, docId) => {
    e.dataTransfer.setData("text/plain", docId.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, drawerName) => {
    e.preventDefault();
    if (hoveredDrawer !== drawerName) {
      setHoveredDrawer(drawerName);
    }
  };

  const handleDragLeave = () => {
    setHoveredDrawer(null);
  };

  const handleDrop = (e, drawerName) => {
    e.preventDefault();
    const docIdStr = e.dataTransfer.getData("text/plain");
    const docId = parseInt(docIdStr);
    if (!docId) return;

    moveDocumentToDrawer(docId, drawerName);
    setHoveredDrawer(null);
  };

  const moveDocumentToDrawer = (docId, drawerName) => {
    setUserDocuments(prev => 
      prev.map(doc => {
        if (doc.id === docId) {
          return { ...doc, drawer: drawerName };
        }
        return doc;
      })
    );
  };

  return (
    <div className="w-full min-h-full pb-16 font-albert animate-fadeIn bg-[#FAF8F5]">
      <TopBar title="Biblioteca da Nina" showBack={true} />

      <div className="px-5 mt-4 space-y-5">
        {/* Helper Banner */}
        <div className="bg-[#FAF3F6] border border-[#F0DDE4] rounded-card p-4 flex gap-3 items-start shadow-xs">
          <ShieldCheck size={18} className="text-[#C38B9B] shrink-0 mt-0.5" />
          <p className="text-[11.5px] text-[#4A4743] leading-relaxed font-medium">
            Organize seus laudos por gavetas! Arraste os arquivos recentes para as gavetas abaixo ou use os atalhos rápidos para movê-los. Seu obstetra terá acesso a esta mesma organização.
          </p>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setShowUploadModal(true);
              handleOpenUpload("camera");
            }}
            className="bg-white hover:bg-[#FAF3F6] border border-[#F0DDE4] p-3.5 rounded-card flex flex-col items-center gap-2 text-center transition-all active:scale-95 shadow-2xs cursor-pointer"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#FAF3F6] text-[#C38B9B] flex items-center justify-center">
              <Camera size={18} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#4A4743]">Tirar Foto</h4>
              <p className="text-[9.5px] text-[#8C6B7A] mt-0.5">Capturar laudo físico</p>
            </div>
          </button>

          <button
            onClick={() => {
              setShowUploadModal(true);
              handleOpenUpload("file");
            }}
            className="bg-white hover:bg-[#FAF3F6] border border-[#F0DDE4] p-3.5 rounded-card flex flex-col items-center gap-2 text-center transition-all active:scale-95 shadow-2xs cursor-pointer"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#FAF3F6] text-[#C38B9B] flex items-center justify-center">
              <Upload size={18} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#4A4743]">Subir PDF</h4>
              <p className="text-[9.5px] text-[#8C6B7A] mt-0.5">Anexar laudo digital</p>
            </div>
          </button>
        </div>

        {/* Section 1: Recent / Unorganized Documents */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-extrabold text-[#8C6B7A] uppercase tracking-wider px-1 flex items-center gap-1">
            <Sparkles size={12} className="text-[#C38B9B]" /> Documentos Recentes ({unorganizedDocs.length})
          </h3>

          {unorganizedDocs.length === 0 ? (
            <div className="bg-white/40 border border-dashed border-[#F0DDE4] rounded-card p-6 text-center text-[#8C6B7A] text-[11.5px]">
              Nenhum documento recente pendente de organização.
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {unorganizedDocs.map((doc) => (
                <div 
                  key={doc.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, doc.id)}
                  className="shrink-0 w-[240px] bg-white border border-[#F0DDE4] rounded-2xl p-3 shadow-2xs cursor-grab active:cursor-grabbing hover:shadow-xs transition-all relative group"
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF3F6] border border-[#F0DDE4] flex items-center justify-center text-[#C38B9B] shrink-0">
                        <FileText size={15} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[11.5px] font-bold text-[#4A4743] leading-tight truncate">{doc.title}</h4>
                        <span className="text-[9px] text-[#8C6B7A] font-semibold block mt-0.5">
                          Enviado em {doc.date}
                        </span>
                      </div>
                    </div>
                    <span className="absolute right-2 top-2 bg-[#FAF8F5] text-[#8C6B7A] p-1 rounded-lg border border-[#F0DDE4] opacity-0 group-hover:opacity-100 transition-opacity">
                      <Move size={11} />
                    </span>
                  </div>

                  {/* Mobile Quick Move Actions */}
                  <div className="mt-2.5 pt-2 border-t border-[#F0DDE4]/50">
                    <p className="text-[9px] font-extrabold text-[#8C6B7A] uppercase mb-1">Mover para gaveta:</p>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => moveDocumentToDrawer(doc.id, "ultrassom")}
                        className="flex-1 bg-[#FAF3F6] hover:bg-[#C38B9B] hover:text-white border border-[#F0DDE4] text-[9.5px] font-bold py-1 rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Ultrassom
                      </button>
                      <button 
                        onClick={() => moveDocumentToDrawer(doc.id, "sangue")}
                        className="flex-1 bg-[#FAF3F6] hover:bg-[#C38B9B] hover:text-white border border-[#F0DDE4] text-[9.5px] font-bold py-1 rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Sangue
                      </button>
                      <button 
                        onClick={() => moveDocumentToDrawer(doc.id, "outros")}
                        className="flex-1 bg-[#FAF3F6] hover:bg-[#C38B9B] hover:text-white border border-[#F0DDE4] text-[9.5px] font-bold py-1 rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Outros
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Cabinet Drawers */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-[#8C6B7A] uppercase tracking-wider px-1">
            Gavetas Organizadoras
          </h3>

          <div className="space-y-3">
            {[
              { id: "ultrassom", label: "Ultrassonografias", icon: "🩺", desc: "Laudos morfológicos e imagens de ultrassom" },
              { id: "sangue", label: "Exames de Sangue", icon: "🩸", desc: "Hemogramas, glicemia e sorologia" },
              { id: "outros", label: "Outros Documentos", icon: "📄", desc: "Prescrições, carteira de vacinas e relatórios" }
            ].map((drawer) => {
              const isOpen = activeDrawer === drawer.id;
              const isHovered = hoveredDrawer === drawer.id;
              const count = getDocsInDrawer(drawer.id).length;

              return (
                <div 
                  key={drawer.id}
                  onDragOver={(e) => handleDragOver(e, drawer.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, drawer.id)}
                  className={`bg-white border rounded-3xl transition-all duration-300 ${
                    isHovered 
                      ? "border-[#C38B9B] bg-[#FAF3F6] shadow-sm scale-[1.01]" 
                      : "border-[#F0DDE4] shadow-2xs hover:border-[#C38B9B]/60"
                  }`}
                >
                  {/* Drawer Handle / Header */}
                  <div 
                    onClick={() => setActiveDrawer(isOpen ? null : drawer.id)}
                    className="p-4 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl transition-all ${
                        isOpen ? "bg-[#C38B9B] text-white" : "bg-[#FAF3F6] text-[#C38B9B]"
                      }`}>
                        {isOpen ? <FolderOpen size={18} /> : <FolderClosed size={18} />}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#4A4743] flex items-center gap-1.5">
                          {drawer.label}
                          <span className="text-[9.5px] font-bold text-[#8C6B7A] bg-[#FAF3F6] border border-[#F0DDE4] px-1.5 py-0.2 rounded-full">
                            {count}
                          </span>
                        </h4>
                        <p className="text-[10px] text-[#8C6B7A] mt-0.5">{drawer.desc}</p>
                      </div>
                    </div>
                    
                    <span className="text-[10px] font-bold text-[#C38B9B]">
                      {isOpen ? "Fechar" : "Abrir"}
                    </span>
                  </div>

                  {/* Drawer Content (Documents Inside) */}
                  {isOpen && (
                    <div className="px-4 pb-4 pt-2 border-t border-[#F0DDE4]/40 bg-[#FAF3F6]/10 rounded-b-3xl space-y-2.5 animate-slideDown">
                      {getDocsInDrawer(drawer.id).length === 0 ? (
                        <div className="text-center py-6 text-[10.5px] text-[#8C6B7A] font-medium border border-dashed border-[#F0DDE4] rounded-2xl bg-white/50">
                          Gaveta vazia. Arraste arquivos aqui para organizá-los.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {getDocsInDrawer(drawer.id).map((doc) => (
                            <div 
                              key={doc.id}
                              className="bg-white border border-[#F0DDE4] rounded-2xl p-3 flex flex-col gap-2.5 shadow-3xs"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex gap-2.5 min-w-0">
                                  <div className="w-8 h-8 rounded-xl bg-[#FAF3F6] flex items-center justify-center text-[#C38B9B] shrink-0 border border-[#F0DDE4]/40">
                                    <FileText size={15} />
                                  </div>
                                  <div className="min-w-0">
                                    <h5 className="text-[11.5px] font-bold text-[#4A4743] leading-tight truncate">{doc.title}</h5>
                                    <p className="text-[9.5px] text-[#8C6B7A] mt-0.5">Enviado em {doc.date}</p>
                                  </div>
                                </div>
                                <span className={`text-[8.5px] font-extrabold px-1.5 py-0.2 rounded-full border uppercase ${
                                  doc.status === "Analisado"
                                    ? "bg-[#F0FFF4] text-[#2F855A] border-[#C6F6D5]"
                                    : "bg-[#FFFDF0] text-[#D69E2E] border-[#FEFCBF]"
                                }`}>
                                  {doc.status}
                                </span>
                              </div>

                              {/* Medical Feedback Panel inside drawer document card */}
                              {doc.feedback ? (
                                <div className="bg-[#FAF3F6] border border-[#F0DDE4] rounded-xl p-2.5 flex gap-2 items-start">
                                  <MessageSquare size={13} className="text-[#C38B9B] shrink-0 mt-0.5" />
                                  <div>
                                    <h6 className="text-[9.5px] font-extrabold text-[#4A4743]">Feedback do Obstetra</h6>
                                    <p className="text-[10px] text-[#523A46] mt-0.5 leading-relaxed font-medium">{doc.feedback}</p>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-[9.5px] text-[#8C6B7A] bg-[#FAF8F5] p-2 rounded-xl border border-[#F0DDE4]/30 flex items-center gap-1">
                                  <Clock size={11} /> Aguardando parecer médico.
                                </p>
                              )}

                              <div className="flex justify-between items-center pt-2 border-t border-[#F0DDE4]/30">
                                <button
                                  onClick={() => {
                                    // Move back to unorganized
                                    moveDocumentToDrawer(doc.id, "recentes");
                                  }}
                                  className="text-[#8C6B7A] hover:text-[#C38B9B] text-[9.5px] font-bold"
                                >
                                  Retirar da gaveta
                                </button>
                                <button
                                  onClick={() => setPreviewDoc(doc)}
                                  className="text-[#C38B9B] hover:text-[#A87483] text-[10px] font-extrabold flex items-center gap-1 cursor-pointer py-1 px-2 bg-[#FAF3F6] rounded-lg border border-[#F0DDE4]"
                                >
                                  <Eye size={11} /> Ver Laudo
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upload/Capture Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-[#3D2B33]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[360px] p-5 shadow-2xl border border-[#F0DDE4] flex flex-col gap-4 animate-fadeIn">
            <div className="flex justify-between items-center pb-2 border-b border-[#F0DDE4]">
              <h3 className="font-poppins text-[#4A4743] font-bold text-[13.5px]">
                {uploadSource === "camera" ? "Capturar com Câmera" : "Anexar Laudo / PDF"}
              </h3>
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadSource(null);
                }} 
                className="text-[#8C6B7A] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[#3D2B33] text-[11px] font-bold px-1">Título do Documento</label>
                <input
                  type="text"
                  placeholder="Ex: Ultrassom Morfológico 2º Tri"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#F0DDE4] rounded-xl text-xs outline-none focus:border-[#C38B9B] font-medium"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[#3D2B33] text-[11px] font-bold px-1">Tipo de Exame</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2 border border-[#F0DDE4] rounded-xl text-xs outline-none focus:border-[#C38B9B]"
                >
                  <option value="Ultrassonografia">Ultrassonografia</option>
                  <option value="Exame de Sangue">Exame de Sangue</option>
                  <option value="Exame de Urina">Exame de Urina</option>
                  <option value="Outros">Outros Documentos</option>
                </select>
              </div>

              {/* Simulation Box */}
              <div className="bg-[#FAF3F6] border border-dashed border-[#F0DDE4] rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-center min-h-[120px]">
                {uploadSource === "camera" ? (
                  <>
                    <Camera size={26} className="text-[#C38B9B] animate-pulse" />
                    {cameraCaptured ? (
                      <span className="text-[11px] text-[#2F855A] font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} fill="#2F855A" className="text-white" /> Foto capturada com sucesso!
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSimulateCapture}
                        className="bg-[#C38B9B] hover:bg-[#A87483] text-white text-[10.5px] font-bold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer active:scale-95"
                      >
                        Simular Clique do Obturador
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <Upload size={26} className="text-[#C38B9B] animate-pulse" />
                    {fileAttached ? (
                      <span className="text-[11px] text-[#2F855A] font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} fill="#2F855A" className="text-white" /> laudo_ultrassom.pdf anexado!
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSimulateCapture}
                        className="bg-[#C38B9B] hover:bg-[#A87483] text-white text-[10.5px] font-bold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer active:scale-95"
                      >
                        Simular Escolha do PDF
                      </button>
                    )}
                  </>
                )}
                <span className="text-[9px] text-[#8C6B7A] font-medium leading-tight">
                  Simulação de upload em ambiente sandbox PWA.
                </span>
              </div>

              <button
                type="submit"
                disabled={uploadSource === "camera" ? !cameraCaptured : !fileAttached}
                className="w-full bg-[#C38B9B] hover:bg-[#A87483] text-white font-extrabold text-xs py-3 rounded-xl shadow-xs transition duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-40"
              >
                Enviar para Análise Médica
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Preview Exam Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-[#3D2B33]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[380px] p-5 shadow-2xl border border-[#F0DDE4] flex flex-col gap-4 animate-fadeIn">
            <div className="flex justify-between items-center pb-2 border-b border-[#F0DDE4]">
              <h3 className="font-poppins text-[#4A4743] font-bold text-xs truncate max-w-[85%]">
                Visualizando: {previewDoc.title}
              </h3>
              <button onClick={() => setPreviewDoc(null)} className="text-[#8C6B7A] cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Document Preview image placeholder */}
            <div className="w-full aspect-4/3 rounded-2xl overflow-hidden border border-[#F0DDE4] bg-[#FAF3F6] relative shadow-inner">
              <img 
                src={previewDoc.fileUrl} 
                alt="Exame Preview" 
                className="w-full h-full object-cover filter blur-[0.5px]" 
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-3.5">
                <div className="text-white">
                  <span className="text-[8.5px] uppercase font-extrabold bg-[#C38B9B] px-1.5 py-0.2 rounded-full">
                    {previewDoc.type}
                  </span>
                  <p className="text-[10px] font-medium mt-1">Simulado com foto clínica oficial da paciente.</p>
                </div>
              </div>
            </div>

            {previewDoc.feedback && (
              <div className="bg-[#FAF3F6] border border-[#F0DDE4] rounded-2xl p-3.5 flex gap-2.5 items-start">
                <MessageSquare size={14} className="text-[#C38B9B] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[10.5px] font-bold text-[#4A4743]">Retorno do Dr. Leonardo</h5>
                  <p className="text-[11px] text-[#523A46] mt-0.5 leading-relaxed font-medium">
                    {previewDoc.feedback}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setPreviewDoc(null)}
              className="w-full bg-[#C38B9B] hover:bg-[#A87483] text-white font-extrabold text-xs py-3 rounded-xl cursor-pointer"
            >
              Fechar Visualização
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

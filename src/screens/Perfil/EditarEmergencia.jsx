import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import TopBar from "../../components/TopBar";
import { MockAPI } from "../../data/mockApi";
import { Save, Loader2, Eye, EyeOff } from "lucide-react";

export default function EditarEmergencia() {
  const { user, currentWeek, goBack } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const SIMULATED_USER_ID = "user_123";

  const [formData, setFormData] = useState({
    fullName: user.name,
    bloodType: "",
    gestationalWeek: currentWeek, // dynamic from context
    allergies: "",
    medications: "",
    riskConditions: "",
    hospital: "",
    contactName: "",
    contactPhone: ""
  });

  const [publicFields, setPublicFields] = useState([
    "fullName", "bloodType", "contactName", "contactPhone", "gestationalWeek"
  ]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await MockAPI.getEmergencyProfile(SIMULATED_USER_ID);
      if (profile) {
        setFormData({
          fullName: profile.fullName || user.name,
          bloodType: profile.bloodType || "",
          gestationalWeek: currentWeek, // always fresh
          allergies: profile.allergies || "",
          medications: profile.medications || "",
          riskConditions: profile.riskConditions || "",
          hospital: profile.hospital || "",
          contactName: profile.contactName || "",
          contactPhone: profile.contactPhone || ""
        });
        setPublicFields(profile.publicFields || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await MockAPI.saveEmergencyProfile(SIMULATED_USER_ID, {
        ...formData,
        publicFields
      });
      alert("Perfil de emergência atualizado com sucesso!");
      goBack();
    } catch (err) {
      alert("Erro ao salvar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const togglePublicField = (fieldKey) => {
    setPublicFields(prev => 
      prev.includes(fieldKey) 
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Helper for rendering form fields with their visibility toggles
  const renderField = (label, name, type = "text", placeholder = "") => {
    const isPublic = publicFields.includes(name);
    
    // For textareas
    const InputComponent = type === "textarea" ? "textarea" : "input";
    const extraProps = type === "textarea" ? { rows: 2 } : { type };

    return (
      <div className="mb-4 bg-white p-3.5 rounded-2xl border border-[#F0DDE4] shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <label className="text-[11.5px] font-bold text-[#3D2B33]">{label}</label>
          <button 
            type="button"
            onClick={() => togglePublicField(name)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-colors ${
              isPublic 
                ? "text-[#D4638F] bg-[#FBE8EF]" 
                : "text-[#A0AEC0] bg-[#EDF2F7]"
            }`}
          >
            {isPublic ? <><Eye size={12}/> Público</> : <><EyeOff size={12}/> Oculto</>}
          </button>
        </div>
        <InputComponent
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 bg-[#FBE8EF]/20 border border-[#F0DDE4] rounded-xl text-[12.5px] text-[#3D2B33] outline-none focus:border-[#D4638F] font-medium transition-colors ${type === "textarea" ? "resize-none" : ""}`}
          {...extraProps}
        />
        {!isPublic && (
          <p className="text-[9.5px] text-[#A0AEC0] mt-1 font-medium">Este campo não aparecerá na leitura do cartão.</p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-h-full pb-8 font-albert animate-fadeIn bg-[#FDF5F8] relative">
      <TopBar title="Editar Emergência" showBack={true} />

      <div className="px-5 -mt-4 relative z-10">
        
        <p className="text-[#8C6B7A] text-[11px] leading-relaxed mb-4 font-medium px-1">
          Defina quais informações estarão disponíveis quando seu cartão NFC for lido. Use os botões <strong>Público/Oculto</strong> para controlar a visibilidade.
        </p>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#D4638F]" size={32} />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {renderField("Nome Completo", "fullName", "text")}
            {renderField("Tipo Sanguíneo (ABO-RH)", "bloodType", "text", "Ex: O+, AB-")}
            
            {/* Read-only field but toggleable visibility */}
            <div className="mb-4 bg-white p-3.5 rounded-2xl border border-[#F0DDE4] shadow-sm opacity-90">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11.5px] font-bold text-[#3D2B33]">Semana Gestacional</label>
                <button 
                  type="button"
                  onClick={() => togglePublicField("gestationalWeek")}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                    publicFields.includes("gestationalWeek") 
                      ? "text-[#D4638F] bg-[#FBE8EF]" 
                      : "text-[#A0AEC0] bg-[#EDF2F7]"
                  }`}
                >
                  {publicFields.includes("gestationalWeek") ? <><Eye size={12}/> Público</> : <><EyeOff size={12}/> Oculto</>}
                </button>
              </div>
              <div className="w-full px-3 py-2 bg-[#F0DDE4]/30 border border-[#F0DDE4]/50 rounded-xl text-[12.5px] text-[#8C6B7A] font-bold">
                {formData.gestationalWeek} Semanas (Automático)
              </div>
            </div>

            {renderField("Alergias", "allergies", "textarea", "Ex: Dipirona, Penicilina, Amendoim")}
            {renderField("Medicações em Uso", "medications", "textarea", "Ex: Metildopa, Ômega 3, Insulina")}
            {renderField("Condições de Risco", "riskConditions", "textarea", "Ex: Pré-eclâmpsia, Diabetes Gestacional, Hipertensão")}
            {renderField("Maternidade de Referência", "hospital", "text", "Ex: Hospital e Maternidade Santa Joana")}
            
            <div className="mt-4 border-t border-[#F0DDE4] pt-4">
              <h3 className="text-[#6B2D4E] font-bold text-[14px] font-poppins mb-3 px-1">
                Contato de Emergência
              </h3>
              {renderField("Nome do Contato", "contactName", "text", "Ex: João da Silva (Marido)")}
              {renderField("Telefone do Contato", "contactPhone", "tel", "Ex: (11) 99999-9999")}
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-6 bg-[#D4638F] hover:bg-[#B84D75] text-white font-extrabold text-[13px] py-4 rounded-full shadow-md transition duration-150 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? "Salvando..." : "Salvar Perfil de Emergência"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

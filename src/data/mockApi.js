/**
 * Mock API for NFC Emergency Card Feature
 * Simulates backend operations with simulated network latency.
 */

// In a real application, card IDs (e.g., from NFC tags) should NEVER directly be 
// the user's primary key (userId) or expose identifiable information.
// The card ID would be an anonymous hash or UUID. The backend would securely map:
// cardId_hash -> userId -> Emergency Profile.

const MOCK_DELAY = 600; // ms

// Simulated database
let DB = {
  nfcBindings: {
    // userId: { cardId, linkedAt }
  },
  emergencyProfiles: {
    // userId: { ...profileData, publicFields: [...] }
  }
};

// Internal helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const MockAPI = {
  /**
   * Binds an NFC card to a user profile.
   */
  async bindNFCCard(userId, cardId) {
    await delay(MOCK_DELAY);
    
    // Check if card is already bound to someone else
    const isTaken = Object.values(DB.nfcBindings).some(b => b.cardId === cardId);
    if (isTaken) {
      throw new Error("Este cartão já está vinculado a outra conta.");
    }

    DB.nfcBindings[userId] = {
      cardId,
      linkedAt: new Date().toISOString()
    };
    
    // Initialize default emergency profile if none exists
    if (!DB.emergencyProfiles[userId]) {
      DB.emergencyProfiles[userId] = {
        fullName: "",
        bloodType: "",
        allergies: "",
        medications: "",
        riskConditions: "",
        hospital: "",
        contactName: "",
        contactPhone: "",
        publicFields: ["fullName", "bloodType", "contactName", "contactPhone"] // Defaults
      };
    }

    return { success: true, linkedAt: DB.nfcBindings[userId].linkedAt };
  },

  /**
   * Unbinds the currently linked NFC card.
   */
  async unbindNFCCard(userId) {
    await delay(MOCK_DELAY);
    delete DB.nfcBindings[userId];
    return { success: true };
  },

  /**
   * Checks if the user has a bound card.
   */
  async getCardBinding(userId) {
    await delay(MOCK_DELAY);
    return DB.nfcBindings[userId] || null;
  },

  /**
   * Saves the emergency profile data and visibility toggles.
   */
  async saveEmergencyProfile(userId, profileData) {
    await delay(MOCK_DELAY);
    DB.emergencyProfiles[userId] = { ...profileData };
    return { success: true };
  },

  /**
   * Gets the user's emergency profile for editing.
   */
  async getEmergencyProfile(userId) {
    await delay(MOCK_DELAY);
    return DB.emergencyProfiles[userId] || null;
  },

  /**
   * PUBLIC ENDPOINT: Gets emergency data by Card ID.
   * Only returns fields explicitly marked as public by the user.
   */
  async getPublicEmergencyData(cardId) {
    await delay(MOCK_DELAY);
    
    // Find user by cardId
    const userId = Object.keys(DB.nfcBindings).find(
      uid => DB.nfcBindings[uid].cardId === cardId
    );

    if (!userId) {
      throw new Error("Cartão não encontrado ou inativo.");
    }

    const profile = DB.emergencyProfiles[userId];
    if (!profile) {
      throw new Error("Perfil de emergência não configurado.");
    }

    // Filter to only include public fields
    const publicData = {};
    const publicFields = profile.publicFields || [];
    
    for (const key of Object.keys(profile)) {
      if (key === "publicFields") continue;
      if (publicFields.includes(key)) {
        publicData[key] = profile[key];
      }
    }

    return publicData;
  },

  /**
   * Simula a inteligência artificial da Nina respondendo a dúvidas gestacionais.
   */
  async askAI(query) {
    await delay(300);
    const inputToMatch = query.toLowerCase();

    const keywords = {
      "sangramento|sangue|dor forte|dor intensa": "Mamãe, por favor, entre em contato imediatamente com o seu obstetra ou dirija-se à Maternidade mais próxima. Se necessário, ligue para o SAMU no 192 pelo nosso botão SOS.",
      "enjoo|nausea|vomito": "Para ajudar com os enjoos, experimente comer pequenas porções mais vezes ao dia, evitar alimentos muito gordurosos ou condimentados, e consumir algo leve como uma torrada ou biscoito de água e sal logo ao acordar, antes de levantar da cama. Gengibre e água gelada com limão também ajudam muito!",
      "dor nas costas|dor lombar|coluna": "A dor nas costas é comum à medida que a barriga cresce e altera seu centro de gravidade. Tente usar calçados confortáveis, evitar carregar peso excessivo, fazer alongamentos leves diariamente e usar uma almofada de suporte para dormir deitada de lado.",
      "alimentacao|dieta|comer|comida": "Uma alimentação saudável e equilibrada é essencial! Foque em proteínas magras, folhas verdes escuras (ricas em ferro e ácido fólico), legumes, frutas variadas e grãos integrais. Evite carnes cruas, ovos moles e certifique-se de lavar muito bem as saladas.",
      "cafe|cafeina": "A recomendação da Organização Mundial da Saúde é limitar o consumo de cafeína a menos de 200mg por dia (cerca de 1 ou 2 xícaras pequenas de café filtrado). Lembre-se que chá preto, refrigerantes de cola e chocolate também contêm cafeína!",
      "chutes|mexer|movimento": "A maioria das mães começa a sentir o bebê mexer entre a 18ª e a 22ª semana. Se você estiver na 17ª semana, pode sentir pequenas borboletas ou bolhas na barriga! Fique atenta: após a 28ª semana, o ideal é registrar pelo menos 6 movimentos em 1 ou 2 horas.",
      "parto|sinais": "Os sinais clássicos de que o trabalho de parto está iniciando incluem contrações uterinas dolorosas e regulares (a cada 5 minutos por 1 hora), perda de tampão mucoso e o rompimento da bolsa amniótica (vazamento de líquido)."
    };

    for (const key in keywords) {
      const regex = new RegExp(key, "i");
      if (regex.test(inputToMatch)) {
        return keywords[key];
      }
    }

    const fallbacks = [
      "Que pergunta excelente! Cada gravidez é única. Lembre-se de anotar essa dúvida para conversar com seu obstetra na próxima consulta. O que mais gostaria de saber?",
      "Fico feliz em poder te acompanhar nessa jornada! Lembre-se de descansar bastante hoje e beber bastante água para garantir uma boa circulação para o bebê. ✨",
      "Que lindo ver seu cuidado com a gestação! Recomendo fazer caminhadas leves e alongamentos hoje se o seu médico tiver liberado. Deseja perguntar mais alguma coisa, mamãe?",
      "Como sua assistente virtual, fico muito feliz em ajudar! Lembre-se que em caso de sintomas persistentes ou desconfortos incomuns, a opinião do seu obstetra é sempre soberana."
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};

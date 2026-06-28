require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const INSTANCE_ID = process.env.INSTANCE_ID;
const TOKEN = process.env.TOKEN;
const ULTRAMSG_URL = `https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`;
const NUMERO_WHATSAPP = '+223...'; // Mets ton numéro ici pour les inscriptions

// BASE DE CONNAISSANCE FAAMA = TOUT TON TEXTE ICI
const FAQ = {
  accueil: `✂️ *FAAMA BARBER ASSISTANT by Cabinet Plus* 🛡️

Salam aleykoum 👋 Je suis le bot officiel de FAAMA Barber Academy.

*Ma Mission:* Vous donner toutes les infos 24h/24 sur la formation, l’inscription, l’insertion.

Tapez un mot-clé ou un numéro 👇
1️⃣ C’est quoi FAAMA ? 
2️⃣ Durée & Programme 
3️⃣ Prix & Paiement 
4️⃣ Lieu & Inscription 
5️⃣ Emploi & Partenariat 
6️⃣ Parrainage ONG 
0️⃣ Parler à un humain`,

  '1': `*1. C’est quoi FAAMA Barber Academy ?*
FAAMA est un programme de formation professionnelle et d’insertion dans les métiers du barbering moderne, porté par Cabinet Plus. 
Notre modèle: 20% théorie + 80% pratique, avec immersion directe dans des salons partenaires haut de gamme.`,

  '2': `*2. Durée de la formation ?*
La formation dure *6 mois*, suivie d’une phase d’insertion professionnelle de *6 mois* et d’un suivi de *6 mois*. 
Soit un parcours complet de *18 mois* avec encadrement, évaluation et suivi.`,

  '3': `*3. Coût de la formation ?*
*Total: 220.000 FCFA* réparti comme suit:
- Inscription: 20.000 FCFA
- Première tranche: 100.000 FCFA 
- Ensuite: 50.000 FCFA chaque 2 mois`,

  '4': `*4. Lieu & Inscription ?*
*Formation:* Djicoroni-Para, dans les locaux de Cabinet Plus, avec immersions dans nos salons partenaires.
*Qui peut s’inscrire:* Tout jeune de 15 à 35 ans motivé.
*Places:* Première cohorte limitée à *25 places*.
*Comment s’inscrire:* Contactez-nous sur WhatsApp au ${NUMERO_WHATSAPP}`,

  '5': `*5. Emploi & Partenariat Salons ?*
*Garantie:* Oui. Nous avons des salons partenaires qui recrutent directement les jeunes selon leurs performances.
*Après formation:* Recrutement en salon | Travail sur commission | Ouvrir votre salon | Rejoindre une coopérative.
*Salon partenaire:* Contactez-nous pour devenir partenaire technique.`,

  '6': `*6. Parrainage ONG & Bailleurs ?*
Oui. Des associations, ONG et partenaires peuvent parrainer des jeunes en prenant en charge totalement ou partiellement les 220.000 FCFA.
*Impact:* Réduire le chômage des jeunes en créant un pont direct entre formation et opportunités économiques réelles.
*Contact Partenariat:* ${NUMERO_WHATSAPP}`,

  '0': `*0. Parler à un humain*
Un membre de l’équipe Cabinet Plus va vous répondre rapidement.
*Contact direct:* ${NUMERO_WHATSAPP} | Djicoroni-Para`,

  parents: `*Pour les Parents:*
Oui. Votre enfant sera suivi sérieusement. Chaque bénéficiaire suit un parcours structuré sur 18 mois avec encadrement et évaluation.`,

  defaut: `Je n’ai pas compris 😅 
Tapez 1, 2, 3, 4, 5, 6 ou 0 pour avoir une réponse directe.
Ou tapez: prix, durée, lieu, emploi, parrainage`
};

// FONCTION ENVOI
async function sendMessage(to, body) {
  await axios.post(ULTRAMSG_URL, { token: TOKEN, to: to, body: body });
}

// LE CERVEAU DU BOT
app.post('/webhook', async (req, res) => {
  const data = req.body;
  if (data.event_type === 'message_received' && data.data.fromMe === false) {
    const from = data.data.from;
    const msg = data.data.body.trim().toLowerCase();

    let reply = FAQ.accueil; // Réponse par défaut

    // Mots-clés intelligents
    if (['1', 'quoi', 'faama', 'cest quoi'].includes(msg)) reply = FAQ['1'];
    else if (['2', 'durée', 'mois', 'programme'].includes(msg)) reply = FAQ['2'];
    else if (['3', 'prix', 'cout', 'paiement', 'argent'].includes(msg)) reply = FAQ['3'];
    else if (['4', 'lieu', 'adresse', 'inscription', 'place'].includes(msg)) reply = FAQ['4'];
    else if (['5', 'emploi', 'travail', 'salon', 'partenaire'].includes(msg)) reply = FAQ['5'];
    else if (['6', 'parrainage', 'ong', 'bailleur', 'sponsor'].includes(msg)) reply = FAQ['6'];
    else if (['0', 'humain', 'appel', 'numero'].includes(msg)) reply = FAQ['0'];
    else if (['parent', 'enfant', 'suivi'].includes(msg)) reply = FAQ.parents;
    else if (msg !== '' && !['menu', 'start'].includes(msg)) reply = FAQ.defaut;

    await sendMessage(from, reply);
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`FAAMA Bot ON sur port ${PORT}`));
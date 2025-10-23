import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  // Connexion à la base de doonées actuel
  const pool = getPool();

  try {
    // Si méthode GET : On récupère la liste via la table contact
    if (req.method === 'GET') {
      const [rows] = await pool.query(
        'SELECT * FROM contact ORDER BY id DESC'
      );
      return res.status(200).json(rows);
    }

    // Si méthode POST est appélée : On récupère les données et sauvegarder dans la base
    if (req.method === 'POST') {
      try {
        // Initiliatlisation des données reçues
        const {
          civility,
          first_name,
          last_name,
          email,
          phone,
          is_more_photos,
          is_call_back,
          is_visit_request,
          message,
          visit_date,
          visit_time,
        } = req.body || {};

        // Validations simples
        if (!last_name || !first_name || !email || !message) {
          return res.status(400).json({ error: "last_name, first_name , email et message sont requis" });
        }

        // Normalisation des données
        const morePhotos = is_more_photos ? 1 : 0;
        const callBack   = is_call_back ? 1 : 0;
        const visitReq   = is_visit_request ? 1 : 0;

        const dateForSql = visit_date && visit_date !== '' ? visit_date : null; // 'YYYY-MM-DD'
        const timeForSql = visit_time && visit_time !== '' ? visit_time : null; // 'HH:mm:ss'

        // Préparation de l'insértion dans la base de données
        const sql = `
          INSERT INTO contact
            (civility, first_name, last_name, email, phone,
            is_more_photos, is_call_back, is_visit_request,
            message, visit_date, visit_time, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        // Récupération des données à envoyer
        const params = [
          civility || null,
          first_name,
          last_name,
          email,
          phone || null,
          morePhotos,
          callBack,
          visitReq,
          message || null,
          dateForSql,
          timeForSql,
        ];

        const [result] = await pool.execute(sql, params);

        // Données finales à insérer dans la table contact
        const saved = {
          id: result.insertId,
          civility: civility || null,
          first_name, 
          last_name, 
          email, 
          phone: phone || null,
          is_more_photos: !!morePhotos,
          is_call_back: !!callBack,
          is_visit_request: !!visitReq,
          message: message || null,
          visit_date: dateForSql,
          visit_time: timeForSql,
          created_at: new Date().toISOString(),
        };

        return res.status(201).json(saved);
      } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Erreur serveur lors de l'insertion" });
      }
    }

    // Check de la méthode appelée
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

import styles from "./BannerPages.module.css";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import DatePicker from "react-datepicker";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { FaCheckCircle } from "react-icons/fa";

export default function BannerPages(props) {

  // Initilisation des variables pour stockage
  const [form, setForm] = useState({
    civility: "Mme",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    contactPreferences: {
      visitRequest: false,
      callMeBack: false,
      morePhotos: false,
    },
    message: "",
    // On stocke des datetimes ISO
    availabilities: []
  });

  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const openModal = () => setShowUnavailableModal(true);
  const closeModal = () => setShowUnavailableModal(false);


  // Modification des préférences selon check ou uncheck
  const updatePref = (key) =>
    setForm((f) => ({
      ...f,
      contactPreferences: { ...f.contactPreferences, [key]: !f.contactPreferences[key] },
    }));

  // ---------- Disponibilités (nouvelle logique) ----------
  const [visitDate, setVisitDate] = useState(null); // Date (jour)
  const [visitTime, setVisitTime] = useState(null); // Date (heure uniquement)
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);

  // Envoi des données et appel de l'API pour insérer dans la base
  const submit = async (e) => {
    e.preventDefault();

    // On prend la dernière date dispo ajoutée (ou null si aucune)
    const lastSlot = form.availabilities.length
      ? form.availabilities[form.availabilities.length - 1]
      : null;

    const visit_date = lastSlot ? format(new Date(lastSlot.iso), "yyyy-MM-dd") : null;
    const visit_time = lastSlot ? format(new Date(lastSlot.iso), "HH:mm:ss") : null;

    // Construire le payload selon les colonnes de la table
    const payload = {
      civility: form.civility,
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: form.phone,
      is_more_photos: form.contactPreferences.morePhotos ? 1 : 0,
      is_call_back: form.contactPreferences.callMeBack ? 1 : 0,
      is_visit_request: form.contactPreferences.visitRequest ? 1 : 0,
      message: form.message || null,
      visit_date,
      visit_time,
    };

    console.log("[Contact] payload envoyé :", payload);

    // Appel de l'api pour insérer les données reçues
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      // Si ok, envoie des données à sauvegarder
      const saved = await res.json();
      console.log("[Contact] enregistré en base :", saved);

      // Réinitilialisation des champs dans l'UI
      setForm({
        civility: "Mme",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        contactPreferences: { visitRequest: false, callMeBack: false, morePhotos: false },
        message: "",
        availabilities: [],
      });
      setVisitDate(null);
      setVisitTime(null);

      openModal();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Erreur lors de l’envoi du formulaire");
    }
  };

  // Modal de remerciement après envoie des formulaires
  const renderModal = () => (
    <>
      <div
        className="modal-backdrop-blur"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 1040,
        }}
      ></div>

      <div
        className="modal show d-block fade"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        style={{ zIndex: 1050 }}
      >
        <div
          className="modal-dialog modal-md modal-dialog-centered"
          role="document"
        >
          <div className="modal-content shadow-lg">
            <div className="modal-body text-center">
              <p>
                <FaCheckCircle size={54} color="green" className="mb-3 completeIcon" />
                <h5 className="mb-4 completeTitle">Merci pour votre confiance !</h5>
                Votre demande a bien été prise en compte. <br />
                Nous vous contacterons dans les plus brefs délais.
              </p>

              <div className="d-flex justify-content-center m-3">
                <button
                  className="btn btn-custom bg-secondary mt-4"
                  onClick={closeModal}
                >
                  A bientôt!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );


  return (
    <div
      className={`${styles.banner}`}
      style={{ backgroundImage: `url(${props.image})` }}
    >
      <div className={styles.overlay} />
      <div className={styles.content}>
        {/* Gros titre et titre coloré passer depuis page source */}
        <h1 className={styles.title}>
          {props.title}{" "}
          {props.titleColored && <span className={styles.titleColored}>{props.titleColored}</span>}
        </h1>

        {/* Formulaires pour contacter l'agence */}
        <form onSubmit={submit} className={styles.card}>

          <div className={styles.grid}>
            {/* Colonne gauche : coordonnées */}
            <div className={styles.leftCol}>
              <h3 className={styles.sectionTitle}>Vos coordonnées</h3>

              <div className={styles.rowInline}>
                <label className={styles.radio}>
                  <input
                    type="radio"
                    name="civility"
                    checked={form.civility === "Mme"}
                    onChange={() => setForm((f) => ({ ...f, civility: "Mme" }))}
                  />
                  <span>Mme</span>
                </label>
                <label className={styles.radio}>
                  <input
                    type="radio"
                    name="civility"
                    checked={form.civility === "M"}
                    onChange={() => setForm((f) => ({ ...f, civility: "M" }))}
                  />
                  <span>M</span>
                </label>
              </div>

              <div className={styles.rowTwo}>
                <input
                  className={styles.input}
                  placeholder="Nom *"
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  required
                />
                <input
                  className={styles.input}
                  placeholder="Prénom *"
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  required
                />
              </div>

              <input
                className={styles.input}
                placeholder="Adresse mail *"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />

              <PhoneInput
                country={"fr"}
                value={form.phone}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                inputClass={styles.phoneInner}
                containerClass={styles.phoneOuter}
                inputProps={{ required: true, placeholder: "Téléphone" }}
              />
            </div>

            {/* Colonne gauche : Disponibilités : calendrier + heure + bouton */}
            <div className={styles.rightCol}>
              <h3 className={styles.sectionTitle}>Disponibilités pour une visite</h3>

              <div className="row g-3 mt-1">
                {/* Col gauche : calendrier */}
                <div className="col-12 col-lg-6">
                  <DatePicker
                    selected={visitDate}
                    onChange={(d) => setVisitDate(d)}
                    minDate={tomorrow}
                    inline
                    locale={fr}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>

                {/* Col droite : heure + bouton + chips */}
                <div className="col-12 col-lg-6">
                  <div className="mb-2">
                    <label className={styles.formLabel}>Heure souhaitée :</label>
                    <input
                      type="time"
                      className="form-control"
                      step="1800"
                      value={visitTime || ''} 
                      onChange={(e) => setVisitTime(e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className={`${styles.addBtn} mb-3`}
                    onClick={() => {
                      if (!visitDate || !visitTime) return;
                      const [hh, mm] = visitTime.split(':').map(Number);
                      const d = new Date(visitDate);
                      d.setHours(hh, mm, 0, 0);

                      // ✅ une seule sélection autorisée
                      setForm(f => ({ ...f, availabilities: [{ iso: d.toISOString() }] }));
                    }}
                    // ✅ désactive le bouton si une disponibilité existe déjà ou il n'y a pas de date et heure sélectionnée
                    disabled={!visitDate || !visitTime || form.availabilities.length > 0}
                    title={
                      !visitDate || !visitTime
                        ? "Veuillez choisir une date et une heure"
                        : form.availabilities.length > 0
                        ? "Une date est déjà sélectionnée — supprimez-la pour modifier ou en choisir une nouvelle"
                        : ""
                    }
                  >
                    Ajouter
                  </button>

                  {form.availabilities[0] && (
                    <div className={`d-flex flex-wrap gap-2`}>
                      <span className={styles.chip}>
                        Vous avez choisi :<br/> {format(new Date(form.availabilities[0].iso), "EEEE dd/MM/yyyy 'à' HH:mm", { locale: fr })}
                        <button
                          type="button"
                          className={styles.chipClose}
                          aria-label="Supprimer"
                          onClick={() => {
                            // ✅ supprimer la sélection pour pouvoir en choisir une nouvelle
                            setForm(f => ({ ...f, availabilities: [] }));
                          }}
                        >
                          ×
                        </button>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Choix de contact et message */}
            <div className="mt-2">

              <h3 className={styles.sectionTitle}>Votre message</h3><br/>

              <div className={styles.checkboxRow}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={form.contactPreferences.visitRequest}
                    onChange={() => updatePref("visitRequest")}
                  />
                  <span>Demande de visite</span>
                </label>

                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={form.contactPreferences.callMeBack}
                    onChange={() => updatePref("callMeBack")}
                  />
                  <span>Être rappelé·e</span>
                </label>

                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={form.contactPreferences.morePhotos}
                    onChange={() => updatePref("morePhotos")}
                  />
                  <span>Plus de photos</span>
                </label>
              </div>

              <textarea
                className={`${styles.input} ${styles.textarea} mt-3`}
                placeholder="Ecrivez votre message, votre demande... *"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Bouton envoyer */}
          <div className={styles.cardFooter}>
            <button type="submit" className={styles.submitBtn}>ENVOYER</button>
          </div>
        </form>
      </div>

      {showUnavailableModal && renderModal()}
    </div>
  );
}

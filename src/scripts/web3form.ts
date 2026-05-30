/**
 * Gestion des formulaires (devis + contact) via Web3Forms.
 * - Validation côté client (champs obligatoires + e-mail) avec messages lisibles
 *   et annoncés aux lecteurs d'écran (role="alert" + aria-invalid).
 * - Envoi AJAX (JSON) vers l'API Web3Forms : pas de rechargement de page.
 * - Affiche un message de confirmation clair en cas de succès.
 *
 * Le script s'applique à tout <form data-web3form>. La clé d'accès Web3Forms
 * est rendue côté serveur dans un champ caché <input name="access_key"> à partir
 * de la variable d'environnement PUBLIC_WEB3FORMS_KEY (voir le composant du form).
 */
const ENDPOINT = 'https://api.web3forms.com/submit';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setError(field: HTMLElement, message: string) {
  field.setAttribute('aria-invalid', 'true');
  const err = document.getElementById(`${field.id}-error`);
  if (err) {
    err.textContent = message;
    err.hidden = false;
    field.setAttribute('aria-describedby', `${field.id}-error`);
  }
}

function clearError(field: HTMLElement) {
  field.removeAttribute('aria-invalid');
  const err = document.getElementById(`${field.id}-error`);
  if (err) {
    err.hidden = true;
    err.textContent = '';
  }
}

/**
 * Notification WhatsApp du gérant via CallMeBot (uniquement pour le devis).
 * Best-effort : on n'attend pas la réponse et toute erreur est ignorée — l'e-mail
 * reste le canal officiel, la notif ne doit jamais bloquer l'envoi du devis.
 * La clé et le numéro viennent de data-attributs (rendus depuis le .env).
 */
function notifyWhatsApp(form: HTMLFormElement, data: Record<string, unknown>) {
  try {
    const phone = form.dataset.cmbPhone;
    const apikey = form.dataset.cmbKey;
    if (!phone || !apikey || apikey === 'CHANGEZ-MOI') return; // non configuré → silencieux

    const get = (k: string) => String(data[k] ?? '').trim();
    const depart = `${get('Adresse de départ')}, ${get('Code postal de départ')} ${get('Ville de départ')}`;
    const arrivee = `${get("Adresse d'arrivée")}, ${get("Code postal d'arrivée")} ${get("Ville d'arrivée")}`;
    const lines = [
      '🚚 Nouveau devis — AM Express',
      `Nom : ${get('Nom et prénom')}`,
      `Tél : ${get('Téléphone')}`,
      `Prestation : ${get('Type de prestation') || 'Non précisé'}`,
      `Départ : ${depart}`,
      `Arrivée : ${arrivee}`,
    ];
    const url =
      'https://api.callmebot.com/whatsapp.php' +
      `?phone=${encodeURIComponent(phone)}` +
      `&apikey=${encodeURIComponent(apikey)}` +
      `&text=${encodeURIComponent(lines.join('\n'))}`;

    // mode no-cors : l'API CallMeBot ne renvoie pas d'en-têtes CORS ; on déclenche
    // l'envoi sans lire la réponse (réponse opaque). Suffisant pour une notif.
    void fetch(url, { mode: 'no-cors' }).catch(() => {});
  } catch {
    /* on n'interrompt jamais le flux de devis */
  }
}

function wireForm(form: HTMLFormElement) {
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const wrap = form.closest('[data-form-wrap]');
  const successBox = wrap?.querySelector<HTMLElement>('[data-form-success]') ?? null;
  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  // Champs visibles à valider (on ignore les champs cachés et le honeypot)
  const fields = Array.from(
    form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      'input, select, textarea',
    ),
  ).filter((el) => el.name && el.type !== 'hidden' && el.type !== 'checkbox');

  // Effacer l'erreur dès que l'utilisateur corrige le champ
  fields.forEach((field) => {
    field.addEventListener('input', () => clearError(field));
    field.addEventListener('change', () => clearError(field));
  });

  function setStatus(message: string, kind: 'info' | 'error' | '') {
    if (!status) return;
    status.textContent = message;
    status.hidden = !message;
    status.classList.toggle('text-red-600', kind === 'error');
    status.classList.toggle('text-marine-500', kind === 'info');
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // 1) Validation
    let firstInvalid: HTMLElement | null = null;
    for (const field of fields) {
      clearError(field);
      const value = (field.value || '').trim();
      if (field.required && !value) {
        setError(field, 'Ce champ est obligatoire.');
        firstInvalid = firstInvalid || field;
        continue;
      }
      if (field.type === 'email' && value && !EMAIL_RE.test(value)) {
        setError(field, 'Merci de saisir une adresse e-mail valide.');
        firstInvalid = firstInvalid || field;
        continue;
      }
      // Validation par pattern (ex. code postal à 5 chiffres)
      const pattern = field.getAttribute('pattern');
      if (pattern && value && !new RegExp(`^(?:${pattern})$`).test(value)) {
        setError(field, field.dataset.patternMsg || 'Format invalide.');
        firstInvalid = firstInvalid || field;
      }
    }
    if (firstInvalid) {
      setStatus('Veuillez corriger les champs signalés en rouge.', 'error');
      firstInvalid.focus();
      return;
    }

    // 2) Clé d'accès configurée ?
    const keyInput = form.querySelector<HTMLInputElement>('input[name="access_key"]');
    const key = (keyInput?.value || '').trim();
    if (!key || key === 'CHANGEZ-MOI') {
      setStatus(
        "Formulaire non configuré (clé Web3Forms manquante). En attendant, appelez-nous au 07 69 72 54 64.",
        'error',
      );
      return;
    }

    // 3) Envoi
    const originalLabel = submitBtn?.textContent || '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';
    }
    setStatus('Envoi en cours…', 'info');

    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        // L'e-mail est parti : on tente la notification WhatsApp (best-effort,
        // jamais bloquante) puis on affiche la confirmation.
        if (form.hasAttribute('data-whatsapp')) {
          notifyWhatsApp(form, payload);
        }
        setStatus('', '');
        form.hidden = true;
        if (successBox) {
          successBox.hidden = false;
          successBox.focus();
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        setStatus(
          `Une erreur est survenue lors de l'envoi (${json.message || 'réessayez'}). Vous pouvez aussi nous appeler au 07 69 72 54 64.`,
          'error',
        );
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      }
    } catch {
      setStatus(
        "Envoi impossible : vérifiez votre connexion, ou appelez-nous directement au 07 69 72 54 64.",
        'error',
      );
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-web3form]').forEach(wireForm);

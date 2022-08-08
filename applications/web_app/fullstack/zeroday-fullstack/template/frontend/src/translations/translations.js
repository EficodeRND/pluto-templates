export const TRANSLATIONS = {
  fi: {
    hello: 'hei',
    login: 'kirjaudu sisään',
    logout: 'kirjaudu ulos',
    email: 'sähköposti',
    password: 'salasana',
    valid_field: 'täytä kenttä',
    change_password: 'vaihda salasana',
    password_change_request: 'pyydä salasanan vaihtoa',
    send_reset_confirmation: 'lähetä',
    password_change_plaintext1: 'anna sähköpostiosoitteesi ja napsauta \'Lähetä vahvistus palautukselle\'. Lisäohjeet lähetetään sinulle sähköpostitse, jos sähköpostiosoite on tietokannassamme.',
    password_change_plaintext2: 'vahvistus on lähetetty sähköpostitse, jos annettu sähköposti on arkistossamme. Jos sähköposti ei saavu 5 minuutin kuluessa, tarkista roskapostikansiosi.',
    lost_password: 'olen unohtanut salasanani',
    reset_token: 'palautuskoodi',
    password_changed: 'Salasana vaihdettu. Ole hyvä ja',
    facebook_login: 'Facebook kirjautuminen',
    google_login: 'Google kirjautuminen',
    firstname: 'etunimi',
    lastname: 'sukunimi',
    profile: 'profiili',
    update: 'päivitä',
    signup: 'rekisteröidy',
    messager_example: 'sano hei backendille!',
    SIGNUP_FAILURE: 'virheellinen käyttäjänimi tai salasana',
    LOGIN_FAILURE: 'virheellinen käyttäjänimi tai salasana',
    RESET_PASSWORD_FAILURE: 'virhe salasanan vaihdossa',
    REQUEST_PASSWORD_CHANGE_FAILURE: 'virhe salasanan vaihdossa',
  },
  sv: {
    hello: 'hej',
    login: 'logga in',
    logout: 'logga ut',
    email: 'e-postadress',
    password: 'lösenord',
    valid_field: 'vänligen fyll i fältet',
    change_password: 'ändra lösenordet',
    password_change_request: 'begär lösenordsändring',
    send_reset_confirmation: 'skicka',
    password_change_plaintext1: 'vänligen fyll i din e-postadress och klicka på \'Skicka bekräftelse för återställning\'. Ytterligare instruktioner kommer att mailas till dig om e-postmeddelandet finns i vår databas.',
    password_change_plaintext2: 'bekräftelse har skickats via e-post om det angivna e-postmeddelandet finns i våra poster. Om e-postmeddelandet inte kommer inom fem minuter, kontrollera din skräppostmapp.',
    lost_password: 'jag har glömt mitt lösenord',
    reset_token: 'återställ token',
    password_changed: 'Lösenordet ändrat. Vänligen',
    facebook_login: 'logga in med Facebook',
    google_login: 'logga in med Google',
    firstname: 'förnamn',
    lastname: 'efternamn',
    profile: 'profil',
    update: 'uppdatering',
    signup: 'rekisterar',
    messager_example: 'säg hej till back-end!',
    SIGNUP_FAILURE: 'ogiltigt användarnamn eller lösenord',
    LOGIN_FAILURE: 'ogiltigt användarnamn eller lösenord',
    RESET_PASSWORD_FAILURE: 'ändra lösenordsfel',
    REQUEST_PASSWORD_CHANGE_FAILURE: 'ändra lösenordsfel',
  },
  en: {
    hello: 'hello',
    login: 'login',
    logout: 'logout',
    email: 'email',
    password: 'password',
    valid_field: 'please fill in field',
    change_password: 'change password',
    password_change_request: 'request password change',
    send_reset_confirmation: 'send reset confirmation',
    password_change_plaintext1: 'please fill in your email address and click \'Send reset confirmation\'. Further instructions will be emailed to you if the email exists in our database.',
    password_change_plaintext2: 'reset confirmation has been emailed if the given email is in our records. If the email doesn\'t arrive within 5 minutes, please check your spam folder.',
    lost_password: 'I have forgotten my password',
    reset_token: 'reset token',
    password_changed: 'Password changed. Please',
    facebook_login: 'login with Facebook',
    google_login: 'login with Google',
    firstname: 'first name',
    lastname: 'last name',
    profile: 'profile',
    update: 'update',
    signup: 'sign up',
    messager_example: 'say hello to the back-end!',
    SIGNUP_FAILURE: 'invalid username or password',
    LOGIN_FAILURE: 'invalid username or password',
    RESET_PASSWORD_FAILURE: 'error occured while changing password',
    REQUEST_PASSWORD_CHANGE_FAILURE: 'error occured while changing password',
  },
};

export const LANG_NAMES = [
  { locale: 'en', name: 'English' },
  { locale: 'fi', name: 'suomi' },
  { locale: 'sv', name: 'svenska' },
];

const detectBrowserLanguage = () => {
  const language = (
    (navigator.languages && navigator.languages[0])
    || navigator.language
    || navigator.userLanguage
  );

  return language;
};

const selectDefaultLanguage = () => {
  const storedLanguage = JSON.parse(window.localStorage.getItem('appUILanguage'));
  const foundStoredLanguage = (
    storedLanguage
    && LANG_NAMES.find((ln) => ln.locale === storedLanguage.locale)
  );
  if (foundStoredLanguage) return foundStoredLanguage;

  const detectedLanguage = detectBrowserLanguage();
  const foundDetectedLanguage = LANG_NAMES.find((ln) => ln.locale === detectedLanguage);

  return (foundDetectedLanguage || LANG_NAMES[0]);
};

export const DEFAULT_LANGUAGE = selectDefaultLanguage();

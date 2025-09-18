import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fi: {
    translation: {
      // Company & Navigation
      companyName: "H Mykrä Oy",
      home: "Etusivu",
      portfolio: "Portfolio",
      contact: "Yhteystiedot",
      admin: "Ylläpito",
      heroTitle: "Tervetuloa\n\nH Mykrä Oy",
      heroSubtitle: "Rakennamme ja vuokraamme koteja. Teemme kaiken alusta loppuun. \n Mikään työ ei ole liian iso tai liian pieni.\n\nYhteistyö kumppanit:\nValio Property Oy\nRakennusliike Mannonen Oy\nVeljet Mäkilä Oy",
      contactUs: "Ota yhteyttä",
      viewApartments: "Katso asunnot",
      
      // About section
      aboutTitle: "Minusta",
      aboutAlt: "Minusta",
      aboutName: "Henkka Myrkä",
      aboutExperience: "20 vuoden kokemus alalta",
      aboutBio1: "Olen kokenut ammattilainen, jota motivoi laatu, selkeys ja toimivat ratkaisut.",
      aboutBio1En: "Seasoned professional driven by quality, clarity and practical solutions.",
      email: "Sähköposti",
      phone: "Puhelin",
      
      // Gallery
      workPortfolio: "Työportfolio",
      galleryTitle: "Galleria",
      viewLarger: "Katso suurempana",
      
      // Apartments
      apartments: "Asunnot",
      apartment: "Asunto",
      buy: "Osta",
      rent: "Vuokraa",
      sale: "Myynti",
      all: "Kaikki",
      available: "Vapaa",
      rented: "Vuokrattu",
      sold: "Myyty",
      price: "Hinta",
      location: "Sijainti",
      size: "Koko",
      rooms: "huonetta",
      contactAgent: "Ota yhteyttä välittäjään",
      month: "kk",
      built: "Rakennettu",
      available_from: "Vapaa alkaen",
      description: "Kuvaus",
      features: "Ominaisuudet",
      contact_info: "Yhteystiedot",
      back: "Takaisin",
      apartment_not_found: "Asuntoa ei löydy",
      apartment_not_found_desc: "Valitettavasti etsimääsi asuntoa ei löytynyt.",
      no_images: "Ei kuvia",
      deposit: "Vakuus",
      utilities: "Käyttökulut",
      
      // Contact form
      contactTitle: "Ota yhteyttä",
      name: "Nimi",
      namePlaceholder: "Kirjoita nimesi",
      emailPlaceholder: "Kirjoita sähköpostisi",
      phonePlaceholder: "Kirjoita puhelinnumerosi",
      message: "Viesti",
      messagePlaceholder: "Kirjoita viestisi",
      send: "Lähetä",
      getInTouch: "Yhteystiedot",
      
      // Messages
      loading: "Ladataan...",
      messageSent: "Viesti lähetetty onnistuneesti!",
      messageError: "Virhe viestin lähetyksessä. Yritä uudelleen.",
      allFieldsRequired: "Kaikki kentät ovat pakollisia",
      invalidEmail: "Virheellinen sähköpostiosoite",
      
      // Admin Panel
      adminPanel: "Hallintapaneeli",
      profile: "Profiili",
      gallery: "Galleria",
      messages: "Viestit",
      adminLogin: "Ylläpitäjän kirjautuminen",
      password: "Salasana",
      enterPassword: "Syötä ylläpitäjän salasana",
      login: "Kirjaudu",
      logout: "Kirjaudu ulos",
      authenticating: "Tunnistautuminen...",
      invalidPassword: "Virheellinen salasana",
      
      // Profile
      profileInformation: "Profiilitiedot",
      bioFinnish: "Kuvaus (suomeksi)",
      bioEnglish: "Kuvaus (englanniksi)",
      profilePhoto: "Profiilikuva",
      updatePhoto: "Päivitä kuva",
      yourName: "Nimesi",
      tellAboutYourself: "Kerro itsestäsi...",
      tellAboutYourselfEn: "Tell about yourself...",
      updateProfile: "Päivitä profiili",
      updating: "Päivitetään...",
      profileUpdated: "Profiili päivitetty onnistuneesti!",
      
      // Gallery Admin
      galleryPhotos: "Gallerian kuvat",
      addNewPhoto: "Lisää uusi kuva",
      photoDescription: "Kuvan kuvaus...",
      addPhoto: "Lisää kuva",
      uploading: "Ladataan...",
      edit: "Muokkaa",
      delete: "Poista",
      save: "Tallenna",
      cancel: "Peruuta",
      noPhotosYet: "Ei kuvia vielä. Lisää ensimmäinen kuvasi!",
      
      // Apartments Admin
      apartmentsManagement: "Asuntojen hallinta",
      addNewApartment: "Lisää uusi asunto",
      apartmentTitle: "Asunnon otsikko",
      type: "Tyyppi",
      forRent: "Vuokralle",
      forSale: "Myytävänä",
      apartmentDescription: "Asunnon kuvaus...",
      status: "Tila",
      numberOfRooms: "Huoneiden määrä",
      area: "Pinta-ala",
      floor: "Kerros",
      builtYear: "Rakennusvuosi",
      availableFrom: "Vapaa alkaen",
      deposit: "Vakuus",
      utilities: "Käyttökulut",
      features: "Ominaisuudet",
      images: "Kuvat",
      addApartment: "Lisää asunto",
      adding: "Lisätään...",
      existingApartments: "Olemassa olevat asunnot",
      editApartment: "Muokkaa asuntoa",
      saveChanges: "Tallenna muutokset",
      noApartmentsYet: "Ei asuntoja vielä. Lisää ensimmäinen asuntosi!",
      
      // Features - Complete list matching AdminPanel.jsx
      balcony: "Parveke",
      elevator: "Hissi",
      parking: "Pysäköinti",
      garden: "Puutarha",
      terrace: "Terassi",
      fireplace: "Tulipesä",
      airConditioning: "Ilmastointi",
      heating: "Lämmitys",
      internet: "Internet",
      petsAllowed: "Lemmikit sallittu",
      wifi: "WiFi",
      sauna: "Sauna",
      bath: "Kylpyamme",
      garage: "Autotalli",
      security: "Turvallisuus",
      gym: "Kuntosali",
      pool: "Uima-allas",
      
      // Common UI
      selectAllThatApply: "valitse kaikki jotka sopivat",
      existingImages: "Olemassa olevat kuvat",
      remove: "Poista",
      showMore: "Näytä enemmän",
      showLess: "Näytä vähemmän",
      
      // Confirmation Messages
      confirmDeletePhoto: "Oletko varma, että haluat poistaa tämän kuvan?",
      confirmDeleteApartment: "Oletko varma, että haluat poistaa tämän asunnon?",
      confirmDeleteMessage: "Oletko varma, että haluat poistaa tämän viestin?",
      
      // Success Messages
      photoUpdatedSuccessfully: "Kuva päivitetty onnistuneesti!",
      
      // Error Messages
      failedToUploadPhoto: "Kuvan lataaminen epäonnistui",
      failedToDeletePhoto: "Kuvan poistaminen epäonnistui",
      failedToAddApartment: "Asunnon lisääminen epäonnistui",
      failedToDeleteApartment: "Asunnon poistaminen epäonnistui",
      failedToUpdateApartment: "Asunnon päivittäminen epäonnistui",
      failedToUpdateProfile: "Profiilin päivittäminen epäonnistui",
      errorUploadingPhoto: "Virhe kuvan lataamisessa",
      errorDeletingPhoto: "Virhe kuvan poistamisessa",
      errorAddingApartment: "Virhe asunnon lisäämisessä",
      errorDeletingApartment: "Virhe asunnon poistamisessa",
      errorUpdatingApartment: "Virhe asunnon päivittämisessä",
      unknownError: "Tuntematon virhe",
      
      // Messages Admin
      newMessages: "Uudet viestit",
      readMessages: "Luetut viestit",
      markAsRead: "Merkitse luetuksi",
      markAsNew: "Merkitse uudeksi",
      noMessagesFound: "Viestejä ei löytynyt.",
      search_placeholder: "Hae nimen, sähköpostin, puhelimen tai viestin perusteella",
      newest_first: "Uusimmat ensin",
      oldest_first: "Vanhimmat ensin",
      
      // Footer
      allRightsReserved: "Kaikki oikeudet pidätetään"
    }
  },
  en: {
    translation: {
      // Company & Navigation
      companyName: "H Mykrä Oy",
      home: "Home",
      portfolio: "Portfolio",
      contact: "Contact",
      admin: "Admin",
      heroTitle: "Welcome to H Mykrä Oy",
      heroSubtitle: "We build and rent homes. We do everything from start to finish. No job is too big or too small.\n\nPartnership companies:\nValio Property Oy\nRakennusliike Mannonen Oy\nVeljet Mäkilä Oy",
      contactUs: "Contact Us",
      viewApartments: "View Apartments",
      
      // About section
      aboutTitle: "About Me",
      aboutAlt: "About Me",
      aboutName: "Henrik Mykrä",
      aboutExperience: "20 years of experience in the field",
      aboutBio1: "Seasoned professional driven by quality, clarity and practical solutions.",
      aboutBio1En: "Seasoned professional driven by quality, clarity and practical solutions.",
      email: "Email",
      phone: "Phone",
      
      // Gallery
      workPortfolio: "Work Portfolio",
      galleryTitle: "Gallery",
      viewLarger: "View Larger",
      
      // Apartments
      apartments: "Apartments",
      apartment: "Apartment",
      buy: "Buy",
      rent: "Rent",
      sale: "Sale",
      all: "All",
      available: "Available",
      rented: "Rented",
      sold: "Sold",
      price: "Price",
      location: "Location",
      size: "Size",
      rooms: "rooms",
      contactAgent: "Contact Agent",
      month: "month",
      built: "Built",
      available_from: "Available from",
      description: "Description",
      features: "Features",
      contact_info: "Contact Information",
      back: "Back",
      apartment_not_found: "Apartment not found",
      apartment_not_found_desc: "Sorry, the apartment you are looking for was not found.",
      no_images: "No images",
      deposit: "Deposit",
      utilities: "Utilities",
      
      // Contact form
      contactTitle: "Get in Touch",
      name: "Name",
      namePlaceholder: "Enter your name",
      emailPlaceholder: "Enter your email",
      phonePlaceholder: "Enter your phone",
      message: "Message",
      messagePlaceholder: "Enter your message",
      send: "Send",
      getInTouch: "Contact Information",
      
      // Messages
      loading: "Loading...",
      messageSent: "Message sent successfully!",
      messageError: "Error sending message. Please try again.",
      allFieldsRequired: "All fields are required",
      invalidEmail: "Invalid email address",
      
      // Admin Panel
      adminPanel: "Admin Panel",
      profile: "Profile",
      gallery: "Gallery",
      messages: "Messages",
      adminLogin: "Admin Login",
      password: "Password",
      enterPassword: "Enter admin password",
      login: "Login",
      logout: "Logout",
      authenticating: "Authenticating...",
      invalidPassword: "Invalid password",
      
      // Profile
      profileInformation: "Profile Information",
      bioFinnish: "Description (Finnish)",
      bioEnglish: "Description (English)",
      profilePhoto: "Profile Photo",
      updatePhoto: "Update Photo",
      yourName: "Your Name",
      tellAboutYourself: "Tell about yourself...",
      tellAboutYourselfEn: "Tell about yourself...",
      updateProfile: "Update Profile",
      updating: "Updating...",
      profileUpdated: "Profile updated successfully!",
      
      // Gallery Admin
      galleryPhotos: "Gallery Photos",
      addNewPhoto: "Add New Photo",
      photoDescription: "Photo description...",
      addPhoto: "Add Photo",
      uploading: "Uploading...",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      noPhotosYet: "No photos yet. Add your first photo!",
      
      // Apartments Admin
      apartmentsManagement: "Apartments Management",
      addNewApartment: "Add New Apartment",
      apartmentTitle: "Apartment title",
      type: "Type",
      forRent: "For Rent",
      forSale: "For Sale",
      apartmentDescription: "Apartment description...",
      status: "Status",
      numberOfRooms: "Number of rooms",
      area: "Area",
      floor: "Floor",
      builtYear: "Built year",
      availableFrom: "Available from",
      deposit: "Deposit",
      utilities: "Utilities",
      features: "Features",
      images: "Images",
      addApartment: "Add Apartment",
      adding: "Adding...",
      existingApartments: "Existing Apartments",
      editApartment: "Edit Apartment",
      saveChanges: "Save Changes",
      noApartmentsYet: "No apartments yet. Add your first apartment!",
      
      // Features - Complete list matching AdminPanel.jsx
      balcony: "Balcony",
      elevator: "Elevator",
      parking: "Parking",
      garden: "Garden",
      terrace: "Terrace",
      fireplace: "Fireplace",
      airConditioning: "Air Conditioning",
      heating: "Heating",
      internet: "Internet",
      petsAllowed: "Pets Allowed",
      wifi: "WiFi",
      sauna: "Sauna",
      bath: "Bath",
      garage: "Garage",
      security: "Security",
      gym: "Gym",
      pool: "Pool",
      
      // Common UI
      selectAllThatApply: "select all that apply",
      existingImages: "Existing Images",
      remove: "Remove",
      showMore: "Show more",
      showLess: "Show less",
      
      // Confirmation Messages
      confirmDeletePhoto: "Are you sure you want to delete this photo?",
      confirmDeleteApartment: "Are you sure you want to delete this apartment?",
      confirmDeleteMessage: "Are you sure you want to delete this message?",
      
      // Success Messages
      photoUpdatedSuccessfully: "Photo updated successfully!",
      
      // Error Messages
      failedToUploadPhoto: "Failed to upload photo",
      failedToDeletePhoto: "Failed to delete photo",
      failedToAddApartment: "Failed to add apartment",
      failedToDeleteApartment: "Failed to delete apartment",
      failedToUpdateApartment: "Failed to update apartment",
      failedToUpdateProfile: "Failed to update profile",
      errorUploadingPhoto: "Error uploading photo",
      errorDeletingPhoto: "Error deleting photo",
      errorAddingApartment: "Error adding apartment",
      errorDeletingApartment: "Error deleting apartment",
      errorUpdatingApartment: "Error updating apartment",
      unknownError: "Unknown error",
      
      // Messages Admin
      newMessages: "New Messages",
      readMessages: "Read Messages",
      markAsRead: "Mark as Read",
      markAsNew: "Mark as New",
      noMessagesFound: "No messages found.",
      search_placeholder: "Search by name, email, phone or message",
      newest_first: "Newest first",
      oldest_first: "Oldest first",
      
      // Footer
      allRightsReserved: "All rights reserved"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fi',    // Default language - Finnish
    fallbackLng: 'en',  // Fallback language - English
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
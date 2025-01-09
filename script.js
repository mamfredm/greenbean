// Menü Interaktivität

const menuIcon = document.querySelector('.menu-icon');
const menu = document.querySelector('.menu');

menuIcon.addEventListener('click', () => {
  menu.classList.toggle('show');
});

// Menüpunkte auswählen
const menuItems = document.querySelectorAll('.menu li .berechnen-button');

// Event Listener zu jedem Menüpunkt hinzufügen
menuItems.forEach(item => {
  item.addEventListener('click', (event) => {
    if (event.target.hash) { // Überprüfen, ob der Link einen Anker hat
      menu.classList.remove('show'); // Menü schließen
    }
  });
});

// Cannabutter-Rechner 
const THC_LEVELS = {
  LOW: 13,
  MEDIUM: 25,
  HIGH: 50,
  COLORS: {
    LOW: "#93c47d",
    MEDIUM: "#6aa84f", 
    HIGH: "#38761d",
    VERY_HIGH: "#cc0000"
  }
};

const VALIDATION_RULES = {
  cannabis1: { min: 1, max: 500, message: "Cannabis muss zwischen 1 und 500 Gramm liegen" },
  thc1: { min: 1, max: 40, message: "THC-Gehalt muss zwischen 1% und 40% liegen" },
  buttermenge1: { min: 100, max: 1000, message: "Buttermenge muss zwischen 100 und 1000 Gramm liegen" },
  effizienz1: { min: 50, max: 90, message: "Effizienz muss zwischen 50% und 0% liegen" },
  butterPotenz2: { min: 0, max: Infinity, message: "Butterpotenz muss positiv sein" },
  butterRezept2: { min: 1, max: 1000, message: "Buttermenge im Rezept muss zwischen 1 und 1000 Gramm liegen" },
  anzahlPortionen2: { min: 1, max: 100, message: "Anzahl Portionen muss zwischen 1 und 100 liegen" }
};

function validateInput(input) {
  const value = parseFloat(input.value);
  const rules = VALIDATION_RULES[input.id];
  const errorDiv = getOrCreateErrorDiv(input);
  
  if (isNaN(value) || value < rules.min || value > rules.max) {
    input.style.borderColor = '#ff0000';
    errorDiv.textContent = rules.message;
    errorDiv.style.display = 'block';
    return false;
  } else {
    input.style.borderColor = '';
    errorDiv.style.display = 'none';
    return true;
  }
}

function getOrCreateErrorDiv(input) {
  let errorDiv = input.nextElementSibling;
  if (!errorDiv || !errorDiv.classList.contains('error-message')) {
    errorDiv = document.createElement('div');
    errorDiv.classList.add('error-message');
    errorDiv.style.color = '#ff0000';
    errorDiv.style.fontSize = '0.8em';
    errorDiv.style.marginTop = '2px';
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
  }
  return errorDiv;
}

function validateInputs1() {
  const inputs = ['cannabis1', 'thc1', 'buttermenge1', 'effizienz1'];
  return inputs.every(id => validateInput(document.getElementById(id)));
}

function validateInputs2() {
  const inputs = ['butterPotenz2', 'butterRezept2', 'anzahlPortionen2'];
  return inputs.every(id => validateInput(document.getElementById(id)));
}

function formatNumber(number, decimals = 2) {
  return number.toLocaleString('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function setTHCColor(thcPortion) {
  const thcPortionSpan = document.getElementById("thcPortion2");
  if (thcPortion <= THC_LEVELS.LOW) {
    thcPortionSpan.style.color = THC_LEVELS.COLORS.LOW;
  } else if (thcPortion <= THC_LEVELS.MEDIUM) {
    thcPortionSpan.style.color = THC_LEVELS.COLORS.MEDIUM;
  } else if (thcPortion <= THC_LEVELS.HIGH) {
    thcPortionSpan.style.color = THC_LEVELS.COLORS.HIGH;
  } else {
    thcPortionSpan.style.color = THC_LEVELS.COLORS.VERY_HIGH;
  }
}

function berechnen1() {
  if (!validateInputs1()) return;

  const cannabis = parseFloat(document.getElementById("cannabis1").value);
  const thc = parseFloat(document.getElementById("thc1").value);
  const buttermenge = parseFloat(document.getElementById("buttermenge1").value);
  const effizienz = parseFloat(document.getElementById("effizienz1").value);

  const butterPotenz = (cannabis * (thc / 100) * 1000 * (effizienz / 100)) / buttermenge;
  const thcGesamt = cannabis * (thc / 100) * 1000 * (effizienz / 100);

  document.getElementById("butterPotenz1").innerHTML = formatNumber(butterPotenz, 2);
  document.getElementById("thcGesamt1").innerHTML = formatNumber(thcGesamt);
  document.getElementById("ergebnis-box1").style.display = "block";
  document.getElementById("butterPotenz2").value = butterPotenz.toFixed(2);
}

function berechnen2() {
  if (!validateInputs2()) return;

  const butterPotenz = parseFloat(document.getElementById("butterPotenz2").value);
  const butterRezept = parseFloat(document.getElementById("butterRezept2").value);
  const anzahlPortionen = parseFloat(document.getElementById("anzahlPortionen2").value);

  const thcRezept = butterPotenz * butterRezept;
  const thcPortion = thcRezept / anzahlPortionen;

  document.getElementById("thcRezept2").innerHTML = formatNumber(thcRezept);
  document.getElementById("thcPortion2").innerHTML = formatNumber(thcPortion);

  setTHCColor(thcPortion);
  document.getElementById("ergebnis-box2").style.display = "block";
}

function setupSliderInputSync() {
  const pairs = [
    { number: 'cannabis1', slider: 'cannabisSlider1' },
    { number: 'thc1', slider: 'thcSlider1' },
    { number: 'buttermenge1', slider: 'buttermengeSlider1' },
    { number: 'effizienz1', slider: 'effizienzSlider1' },
    { number: 'butterRezept2', slider: 'butterRezeptSlider2' },
    { number: 'anzahlPortionen2', slider: 'anzahlPortionenSlider2' }
  ];

  pairs.forEach(pair => {
    const numberInput = document.getElementById(pair.number);
    const sliderInput = document.getElementById(pair.slider);
    const sliderValueDiv = sliderInput.nextElementSibling;

    sliderValueDiv.querySelector('.min-value').textContent = sliderInput.min;
    sliderValueDiv.querySelector('.max-value').textContent = sliderInput.max;

    sliderInput.addEventListener('input', () => {
      numberInput.value = sliderInput.value;
      validateInput(numberInput);
      document.getElementById('ergebnis-box1').style.display = 'none';
      document.getElementById('ergebnis-box2').style.display = 'none';
    });

    numberInput.addEventListener('input', () => {
      sliderInput.value = numberInput.value;
      validateInput(numberInput);
      document.getElementById('ergebnis-box1').style.display = 'none';
      document.getElementById('ergebnis-box2').style.display = 'none';
    });

    // Initial validation
    numberInput.addEventListener('blur', () => validateInput(numberInput));
  });
}

document.addEventListener('DOMContentLoaded', setupSliderInputSync);


// Filter
document.addEventListener('DOMContentLoaded', function () {
  const oelFilter = document.getElementById('oel-filter');
  const zubereitungFilter = document.getElementById('zubereitung-filter');

  // Alle Rezept-Sektionen verstecken
  const rezeptSektionen = document.querySelectorAll('.content-section');
  rezeptSektionen.forEach(sektion => {
    sektion.style.display = 'none';
  });

  oelFilter.addEventListener('change', function () {
    const selectedOel = this.value;

    // Alle Rezept-Sektionen verstecken
    rezeptSektionen.forEach(sektion => {
      sektion.style.display = 'none';
    });

    // Zubereitungsfilter zurücksetzen
    zubereitungFilter.selectedIndex = 0;

    // Nur die ausgewählte Öl-Sektion anzeigen
    if (selectedOel !== 'start') {
      document.getElementById(`${selectedOel}-sektion`).style.display = 'block';
    }
  });

  zubereitungFilter.addEventListener('change', function () {
    const selectedOel = oelFilter.value;
    const selectedZubereitung = this.value;

    // Alle Zubereitungs-Sektionen innerhalb der Öl-Sektion verstecken
    const zubereitungSektionen = document.querySelectorAll(`#${selectedOel}-sektion .content-section`);
    zubereitungSektionen.forEach(sektion => {
      sektion.style.display = 'none';
    });

    // Nur die ausgewählte Zubereitungs-Sektion anzeigen
    if (selectedZubereitung !== 'start') {
      document.getElementById(`${selectedOel}-${selectedZubereitung}-sektion`).style.display = 'block';

      // Zur Zutaten-Sektion springen (mit sanftem Scroll-Effekt)
      const zutatenSektion = document.getElementById(`${selectedOel}-sektion`);
      zutatenSektion.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


// Verbesserter Code für die Kontaktformular-Verarbeitung mit JSON
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
      contactForm.addEventListener('submit', handleSubmit);
  }
});

async function handleSubmit(event) {
  event.preventDefault();
  
  // Loading-Status anzeigen
  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = 'Wird gesendet...';
  submitButton.disabled = true;

  try {
      // Formulardaten direkt als JSON-Objekt sammeln
      const formData = new FormData(event.target);
      const data = {
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
          timestamp: new Date().toISOString()
      };

      const scriptURL = 'https://script.google.com/macros/s/AKfycby5N1KqzwFgFe7lWx-ma78ge2gAl6YJ3_Fla1o9VO3UlJse8D173DwEKGp5FvTvhkI/exec';

      // Daten als JSON senden
      const response = await fetch(scriptURL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
              'Content-Type': 'text/plain;charset=utf-8',
          },
          // Daten als JSON-String senden
          body: JSON.stringify(data)
      });

      showMessage('Vielen Dank für deine Nachricht! Wir melden uns zeitnah bei dir.', 'success');
      event.target.reset();

  } catch (error) {
      console.error('Error:', error);
      showMessage('Es gab einen Fehler beim Senden deiner Nachricht. Bitte versuche es später erneut.', 'error');
  } finally {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
  }
}

function showMessage(message, type) {
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
      existingMessage.remove();
  }

  const messageElement = document.createElement('div');
  messageElement.className = `form-message ${type}`;
  messageElement.textContent = message;

  const form = document.getElementById('contactForm');
  form.parentNode.insertBefore(messageElement, form);

  setTimeout(() => {
      messageElement.remove();
  }, 5000);
}

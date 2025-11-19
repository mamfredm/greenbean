// Menü Interaktivität
document.addEventListener('DOMContentLoaded', () => {
  const menuIcon = document.querySelector('.menu-icon');
  const menu = document.querySelector('.menu');

  if (menuIcon && menu) {
    menuIcon.addEventListener('click', () => {
      menu.classList.toggle('show');
    });

    // FIX: Menüpunkte korrekt auswählen (Links statt Buttons)
    const menuItems = document.querySelectorAll('.menu a');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        menu.classList.remove('show');
      });
    });
  }
});

// Cannabutter-Rechner Konfiguration
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
  effizienz1: { min: 50, max: 90, message: "Effizienz muss zwischen 50% und 90% liegen" }, // FIX: Tippfehler 0% -> 90%
  butterPotenz2: { min: 0, max: Infinity, message: "Butterpotenz muss positiv sein" },
  butterRezept2: { min: 1, max: 1000, message: "Buttermenge im Rezept muss zwischen 1 und 1000 Gramm liegen" },
  anzahlPortionen2: { min: 1, max: 100, message: "Anzahl Portionen muss zwischen 1 und 100 liegen" }
};

// Hilfsfunktionen
function getOrCreateErrorDiv(input) {
  let errorDiv = input.nextElementSibling;
  // Überspringe Slider-Container, falls vorhanden, und suche danach
  if (errorDiv && errorDiv.classList.contains('slider-value')) {
    errorDiv = errorDiv.nextElementSibling;
  }
  
  if (!errorDiv || !errorDiv.classList.contains('error-message')) {
    errorDiv = document.createElement('div');
    errorDiv.classList.add('error-message');
    errorDiv.style.color = '#ff0000';
    errorDiv.style.fontSize = '0.8em';
    errorDiv.style.marginTop = '2px';
    
    // Einfügen an der richtigen Stelle
    if (input.nextElementSibling && input.nextElementSibling.classList.contains('slider-value')) {
      input.parentNode.insertBefore(errorDiv, input.nextElementSibling.nextSibling);
    } else {
      input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
  }
  return errorDiv;
}

function validateInput(input) {
  if (!input) return false;
  
  const value = parseFloat(input.value);
  const rules = VALIDATION_RULES[input.id];
  
  if (!rules) return true; // Keine Regeln für dieses Input

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

function validateInputs1() {
  const inputs = ['cannabis1', 'thc1', 'buttermenge1', 'effizienz1'];
  // Nur validieren, wenn alle Elemente existieren
  const elements = inputs.map(id => document.getElementById(id));
  if (elements.some(el => !el)) return false;
  
  return elements.every(el => validateInput(el));
}

function validateInputs2() {
  const inputs = ['butterPotenz2', 'butterRezept2', 'anzahlPortionen2'];
  const elements = inputs.map(id => document.getElementById(id));
  if (elements.some(el => !el)) return false;

  return elements.every(el => validateInput(el));
}

function formatNumber(number, decimals = 2) {
  return number.toLocaleString('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function setTHCColor(thcPortion) {
  const thcPortionSpan = document.getElementById("thcPortion2");
  if (!thcPortionSpan) return;

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

// Berechnungsfunktionen
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
  
  const butterPotenz2 = document.getElementById("butterPotenz2");
  if (butterPotenz2) {
      butterPotenz2.value = butterPotenz.toFixed(2);
      // Trigger input event für Validierung/Slider falls nötig
      butterPotenz2.dispatchEvent(new Event('input'));
  }
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

// Slider Setup mit Sicherheitscheck
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

    // FIX: Nur ausführen, wenn beide Elemente auf der aktuellen Seite existieren
    if (numberInput && sliderInput) {
      const sliderValueDiv = sliderInput.nextElementSibling;
      if (sliderValueDiv) {
        const minSpan = sliderValueDiv.querySelector('.min-value');
        const maxSpan = sliderValueDiv.querySelector('.max-value');
        if (minSpan) minSpan.textContent = sliderInput.min;
        if (maxSpan) maxSpan.textContent = sliderInput.max;
      }

      sliderInput.addEventListener('input', () => {
        numberInput.value = sliderInput.value;
        validateInput(numberInput);
        const box1 = document.getElementById('ergebnis-box1');
        const box2 = document.getElementById('ergebnis-box2');
        if (box1) box1.style.display = 'none';
        if (box2) box2.style.display = 'none';
      });

      numberInput.addEventListener('input', () => {
        sliderInput.value = numberInput.value;
        validateInput(numberInput);
        const box1 = document.getElementById('ergebnis-box1');
        const box2 = document.getElementById('ergebnis-box2');
        if (box1) box1.style.display = 'none';
        if (box2) box2.style.display = 'none';
      });

      // Initial validation
      numberInput.addEventListener('blur', () => validateInput(numberInput));
    }
  });
}

document.addEventListener('DOMContentLoaded', setupSliderInputSync);

// Filter Logik mit Sicherheitscheck
document.addEventListener('DOMContentLoaded', function () {
  const oelFilter = document.getElementById('oel-filter');
  const zubereitungFilter = document.getElementById('zubereitung-filter');

  // Nur ausführen, wenn wir auf der Rezeptseite sind
  if (oelFilter && zubereitungFilter) {
    const rezeptSektionen = document.querySelectorAll('.content-section');
    
    // Initial verstecken
    rezeptSektionen.forEach(sektion => {
      sektion.style.display = 'none';
    });

    oelFilter.addEventListener('change', function () {
      const selectedOel = this.value;

      rezeptSektionen.forEach(sektion => {
        sektion.style.display = 'none';
      });

      zubereitungFilter.selectedIndex = 0;

      if (selectedOel !== 'start') {
        const target = document.getElementById(`${selectedOel}-sektion`);
        if (target) target.style.display = 'block';
      }
    });

    zubereitungFilter.addEventListener('change', function () {
      const selectedOel = oelFilter.value;
      const selectedZubereitung = this.value;

      // Sub-Sektionen verstecken
      if (selectedOel !== 'start') {
        const activeOelSection = document.getElementById(`${selectedOel}-sektion`);
        if (activeOelSection) {
            const subSections = activeOelSection.querySelectorAll('.content-section');
            subSections.forEach(s => s.style.display = 'none');
        }
      }

      if (selectedZubereitung !== 'start' && selectedOel !== 'start') {
        const target = document.getElementById(`${selectedOel}-${selectedZubereitung}-sektion`);
        if (target) {
            target.style.display = 'block';
            const zutatenSektion = document.getElementById(`${selectedOel}-sektion`);
            if (zutatenSektion) zutatenSektion.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
});

// Kontaktformular
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
      contactForm.addEventListener('submit', handleSubmit);
  }
});

async function handleSubmit(event) {
  event.preventDefault();
  
  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = 'Wird gesendet...';
  submitButton.disabled = true;

  try {
      const formData = new FormData(event.target);
      const data = {
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
          timestamp: new Date().toISOString()
      };

      const scriptURL = 'https://script.google.com/macros/s/AKfycby1fRZTrGdv-uNuVKNwRvzU9B7rEc3x3cKseXaueOQQHUf_TcBnwm-pjcXjWxV7q9s/exec';

      await fetch(scriptURL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
              'Content-Type': 'text/plain;charset=utf-8',
          },
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
  if (form) {
    form.parentNode.insertBefore(messageElement, form);
  }

  setTimeout(() => {
      messageElement.remove();
  }, 5000);
}
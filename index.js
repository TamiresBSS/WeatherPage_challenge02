const modal = document.getElementById('myModal');
const betterView = document.getElementById('goTempo');
const formulario = document.getElementById('myForm');
var dotsInterval;


//  Modal : Fechar
function closeModal() {
    modal.style.display = 'none';
};
// Modal : Abrir
function openModal(title, message) {
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');

    modalTitle.innerText = title;
    modalMessage.innerText = message;
    modal.style.display = 'block';
}
// Efeito de Loading 
function toggleDots() {
    if (dotsInterval) {
        clearInterval(dotsInterval);
        dotsInterval = null;
    } else {
        window.dotsGoingUp = true;
        dotsInterval = window.setInterval(function () {
            var waits = document.querySelectorAll(".wait");
            waits.forEach(function (wait) {
                if (window.dotsGoingUp)
                    wait.innerHTML += ".";
                else {
                    wait.innerHTML = wait.innerHTML.substring(1, wait.innerHTML.length);
                    if (wait.innerHTML === "")
                        window.dotsGoingUp = true;
                }
                if (wait.innerHTML.length > 3)
                    window.dotsGoingUp = false;
            });
        }, 100);
    }
}
// Validação de Inputs
function isValid(nameV, emailV, cepV, latV, lonV) {
    // AllInputs
    if (cepV === '' || latV === '' || lonV === '' || nameV === '' || emailV === '') {
        openModal("Requisição Incompleta", "Por favor, preencha os campos em branco.");
        return false;
    }
    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailV)) {
        openModal("E-mail inválido", "Por favor, verifique suas informações com cuidado.");
        console.log("Email Not valid:", emailV);
        return false;
    }
    // CEP
    if (!/^\d{8}$/.test(cepV)) {
        openModal("CEP Inválido", "Verifique se digitou os 8 dígitos corretamente.")
        console.log("Cep not valid", cepV);
        return false;
    }
    // Latitude/Longitude
    if (!(latV >= -90 && latV <= 90)) {
        openModal("Coordenadas Incorretas", "A Latitude precisa ser maior ou igual a -90 e menor ou igual a 90.");
        console.log("Lat: ", cepV, latV);
        return false;
    }
    if (!(lonV >= -180 && lonV <= 180)) {
        openModal("Coordenadas Incorretas", "A Longitude precisa ser maior ou igual a -180 e menor ou igual a 180.");
        console.log("Lon: ", cepV, lonV);
        return false;
    }

    return true;
}

// APIs
async function consultaCep(zipcode) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${zipcode}/json/`);
        const dataCep = await response.json();

        document.getElementById('rua').innerText = dataCep.logradouro;
        document.getElementById('bairro').innerText = dataCep.bairro;
        document.getElementById('uf').innerText = dataCep.uf;
    } catch (error) {
        console.error("Failed to fetch data from ViaCep: ", error);
    }
}

async function consultaClima(lat, lon) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&forecast_days=1`);
        const dataClima = await response.json();

        document.getElementById('clima').innerText = "Previsão de tempo de acordo com a região: " + dataClima.current.temperature_2m + dataClima.current_units.temperature_2m;
    } catch (error) {
        console.error("Failed to fetch data from OpenMeteo: ", error);
    }
}

// Função Principal
formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    const userName = document.getElementById('username').value;
    const userMail = document.getElementById('email').value;

    const zip = document.getElementById('cep').value;
    const zipcode = zip.replace(/\D/g, "");

    let latitude = document.getElementById('lat').value;
    let longitude = document.getElementById('lon').value;
    // Transformando vírgulas em pontos para a API open meteo
    let lat = latitude.replace(/,/g, '.');
    let lon = longitude.replace(/,/g, '.');

    if (isValid(userName, userMail, zipcode, lat, lon)) {
        betterView.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        // SheetMonkey
        const mailingList = {
            "Name": userName,
            "Email": userMail,
            "CEP": zipcode,
            "latitude": lat,
            "longitude": lon,
            "Created": 'x-sheetmonkey-current-date-time'
        };
        try {
            const response = fetch('https://api.sheetmonkey.io/form/764GELy5f1voFvR35oEH51', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mailingList)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data.');
            }
            // Handle response if needed
        } catch (error) {
            console.log('Error:', error);
        }
        // APIs ViaCEP & OpenMeteo 
        consultaCep(zipcode);
        consultaClima(lat, lon);

    }
});
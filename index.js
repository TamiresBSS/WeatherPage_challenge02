const modal = document.getElementById('myModal');
var dotsInterval;

//  Modal Abrir e Fechar
function closeModal() {
    modal.style.display = 'none';
};

function openModal(title, message = "Por favor, verifique suas informações com cuidado.") {
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
                if (wait.innerHTML.length > 2)
                    window.dotsGoingUp = false;
            });
        }, 100);
    }
}

// Validando os Inputs
function validar(num1, num2 = 0) {
    if (!num2) {
        if (/[a-zA-Z\s]/.test(num1)) {
            return false;
        } else {
            if (/^[0-9]{8}$/.test(num1)) {
                return true;
            } else {
                return false;
            }
        }
    } else {
        const lat = (num1 >= -90 && num1 <= 90);
        const lon = (num2 >= -180 && num2 <= 180);
        return (lat) && (lon);
    }
}
// Validar Emails
function isValidEmail(email) {
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
// Função Principal
async function consulta() {

    const betterView = document.getElementById('goTempo');
    let zipcode = document.getElementById('cep').value;
    const userName = document.getElementById('username').value;
    let userMail = document.getElementById('email').value;
    const latitude = document.getElementById('lat').value;
    const longitude = document.getElementById('lon').value;
    // Verificação dos campos digitáveis
    if (zipcode === '' || latitude === '' || longitude === '' || userName === '' || userMail === '') {
        openModal("Requisição Incompleta", "Por favor, preencha os campos em branco.");
        return;
    } else {
        if (!isValidEmail(userMail)) {
            openModal("E-mail Inválido", "Preencha os campos corretamente.");
            return;
        }
    }
    // Transformando vírgulas em pontos para a API open meteo
    let lat = latitude.replace(/,/g, '.');
    let lon = longitude.replace(/,/g, '.');
    const isValidCep = validar(zipcode);
    const isValidCoord = validar(lat, lon);

    // Executar apenas se ambos CEP e LatLon forem digitados
    if (!isValidCep && !isValidCoord) {
        openModal("Dados inválidos");
    }
    else if (!isValidCep || !isValidCoord) {
        !isValidCep ? openModal("CEP Inválido", "Verifique se digitou os 8 dígitos.") : openModal("Coordenadas Incorretas", "A Latitude precisa ser >= -90 e <=90.\nA Longitude precisa ser >=-180 e <=180.");
        return;
    } else {
        // Loading Effect ON 
        betterView.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        toggleDots();

        try {
            //
            const mailingList = {
                Email: userName,
                Name: userMail,
                CEP: zipcode,
                latitude: lat,
                longitude: lon,
                Created: 'x-sheetmonkey-current-date-time'
            };
            //
            const consultApi = [
                fetch(`https://viacep.com.br/ws/${zipcode}/json/`),
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&forecast_days=1`)
            ];

            const responses = await Promise.all(consultApi);
            const results = responses.map(response => response.json());
            const [dataCep, dataTempo] = await Promise.all(results);

            // Loading Effect OFF
            toggleDots();

            document.getElementById('rua').innerText = dataCep.logradouro;
            document.getElementById('bairro').innerText = dataCep.bairro;
            document.getElementById('uf').innerText = dataCep.uf;
            document.getElementById('clima').innerText = "Previsão de tempo de acordo com a região: " + dataTempo.current.temperature_2m + dataTempo.current_units.temperature_2m;

        } catch (error) {
            console.error('Error fetching data:', error);
        }
        //
        fetch('https://api.sheetmonkey.io/forms/vB1pUYCBvUqnSarEvAgsd6', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mailingList),
        }).then((result) => {
            alert(result);
        });
        //
    }
}
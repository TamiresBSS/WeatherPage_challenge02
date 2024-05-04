const modal = document.getElementById('myModal');

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

async function consulta() {

    let zipcode = document.getElementById('cep').value;
    const userName = document.getElementById('username').value;
    let userMail = document.getElementById('email').value;
    const betterView = document.getElementById('goTempo');
    // Latitude e Longitude + troca de vírgulas por pontos
    const latitude = document.getElementById('lat').value;
    let lat = latitude.replace(/,/g, '.');
    const longitude = document.getElementById('lon').value;
    let lon = longitude.replace(/,/g, '.');

    const isValidCep = validar(zipcode);
    const isValidCoord = validar(lat, lon);

    if (!isValidCep && !isValidCoord) {
        openModal("Dados inválidos!");
    }
    else if (!isValidCep || !isValidCoord) {
        !isValidCep ? openModal("CEP Inválido!", "Verifique se digitou os 8 dígitos.") : openModal("Coordenadas Incorretas!", "A Latitude precisa ser >= -90 e <=90.\nA Longitude precisa ser >=-180 e <=180.");
        return;
    } else {

        try {

            const consultApi = [
                fetch(`https://viacep.com.br/ws/${zipcode}/json/`),
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&forecast_days=1`)
            ];

            const responses = await Promise.all(consultApi);
            const results = responses.map(response => response.json());
            const [dataCep, dataTempo] = await Promise.all(results);

            document.getElementById('rua').innerText = dataCep.logradouro;
            document.getElementById('bairro').innerText = dataCep.bairro;
            document.getElementById('uf').innerText = dataCep.uf;
            document.getElementById('clima').innerText = dataTempo.current.temperature_2m + dataTempo.current_units.temperature_2m;

        } catch (error) {
            alert(error.message);
        }

        betterView.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
}
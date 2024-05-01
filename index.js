const modal = document.getElementById('myModal');

const validation = {
    "cep": {
        "checkLenght": (number) => {
            let check = /^[0-9]{8}$/;
            return check.test(number);
        }
    },
    "latlon": {
        "checkLenght": (number) => {
            let check = /^[0-9]{8}$/;
            return check.test(number);
        }
    }
};


//  Modal Functions
function closeModal() {
    modal.style.display = 'none';
};

function openModal(title, message) {
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');

    modalTitle.innerText = title;
    modalMessage.innerText = message;
    modal.style.display = 'block';
}
// Validating the Inputs
// Validar os números digitados
function validar(tipo, valor) {
    const numType = tipo;
    const num = valor.replace(/\D/g, '');
    // console.log(num);

    if (numType === "cep") {
        return validation.cep.checkLenght(num);
    } else if (numType === "latlon") {
        return validation.cep.checkLenght(num);
    } else {
        console.log("numType não é um valor válido");
    }

}
// Função ASYNC da API ViaCep
function viaCep() {
    const zipcode = document.getElementById('cep').value;
    // console.log(zipcode);
    if (!validar("cep", zipcode)) {
        openModal("CEP Inválido!", "Por favor verifique suas informações com cuidado.");
        return;
        // console.log("FALSE. Deu ruim!");
        // console.log(validar("cep", zipcode));
    }
    else {
        // console.log("TRUE. Deu bom, minha gente.");
        // console.log(validar("cep", zipcode));
        // Continue Codando Aqui !!!!!
    }
}
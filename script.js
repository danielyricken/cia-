document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-contato");
    const container = document.querySelector(".container");
    const inputTelefone = document.getElementById("telefone");
    const textareaMensagem = document.getElementById("mensagem");
    const contadorCaracteres = document.getElementById("contador-caracteres");
    const totalContatosSpan = document.getElementById("total-contatos");
    const modalSucesso = document.getElementById("modal-sucesso");
    const btnFecharModal = document.getElementById("btn-fechar-modal");

    atualizarContadorGlobal();

    // Formatação do Telefone em tempo real (Celular padrão brasileiro: (XX) XXXXX-XXXX)
    inputTelefone.addEventListener("input", (e) => {
        let valor = e.target.value.replace(/\D/g, "");
        if (valor.length > 11) valor = valor.substring(0, 11);
        
        let formatado = "";
        if (valor.length > 0) {
            formatado = `(${valor.substring(0, 2)}`;
            if (valor.length > 2) formatado += `) ${valor.substring(2, 7)}`;
            if (valor.length > 7) formatado += `-${valor.substring(7, 11)}`;
        }
        e.target.value = formatado;
    });

    // Contador de Caracteres da Mensagem
    textareaMensagem.addEventListener("input", (e) => {
        contadorCaracteres.textContent = `${e.target.value.length} / 500`;
    });

    // Evento de Submit com Validações
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        limparTodosErros();

        let formularioValido = true;

        // Validar Nome
        const nome = document.getElementById("nome");
        if (!nome.value.trim()) {
            mostrarErro(nome, "O campo nome é obrigatório.");
            formularioValido = false;
        }

        // Validar E-mail
        const email = document.getElementById("email");
        const emailRegexValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            mostrarErro(email, "O campo e-mail é obrigatório.");
            formularioValido = false;
        } else if (!emailRegexValido.test(email.value.trim())) {
            mostrarErro(email, "Por favor, insira um e-mail válido.");
            formularioValido = false;
        }

        // Validar Telefone
        const digitosTelefone = inputTelefone.value.replace(/\D/g, "");
        if (!digitosTelefone) {
            mostrarErro(inputTelefone, "O campo telefone é obrigatório.");
            formularioValido = false;
        } else if (digitosTelefone.length < 11) {
            mostrarErro(inputTelefone, "Insira o telefone completo com DDD e 9 dígitos.");
            formularioValido = false;
        }

        // Validar Data de Nascimento
        const dataNasc = document.getElementById("data-nasc");
        if (!dataNasc.value) {
            mostrarErro(dataNasc, "A data de nascimento é obrigatória.");
            formularioValido = false;
        }

        // Validar Assunto (Select)
        const assunto = document.getElementById("assunto");
        if (!assunto.value) {
            mostrarErro(assunto, "Por favor, selecione um assunto.");
            formularioValido = false;
        }

        // Validar Mensagem
        if (!textareaMensagem.value.trim()) {
            mostrarErro(textareaMensagem, "O campo mensagem é obrigatório.");
            formularioValido = false;
        }

        // Validar Checkbox de Termos
        const termos = document.getElementById("termos");
        if (!termos.checked) {
            mostrarErro(termos, "Você deve aceitar os termos para continuar.");
            formularioValido = false;
        }

        // Fluxo de Sucesso ou Erro
        if (formularioValido) {
            const contatosAtuais = parseInt(localStorage.getItem("totalContatos")) || 0;
            localStorage.setItem("totalContatos", contatosAtuais + 1);
            
            atualizarContadorGlobal();
            modalSucesso.style.display = "flex";
            form.reset();
            contadorCaracteres.textContent = "0 / 500";
        } else {
            container.classList.add("tremer");
            setTimeout(() => container.classList.remove("tremer"), 400);
        }
    });

    btnFecharModal.addEventListener("click", () => {
        modalSucesso.style.display = "none";
    });

    // Remove a classe de erro dinamicamente assim que o usuário digita/altera algo
    form.querySelectorAll("input, textarea, select").forEach(elemento => {
        elemento.addEventListener("input", () => {
            elemento.classList.remove("input-invalido");
            const containerPai = elemento.closest(".input-group");
            if (containerPai) {
                const spanErro = containerPai.querySelector(".erro-mensagem");
                if (spanErro) spanErro.textContent = "";
            }
        });
    });

    // Funções Utilitárias Modulares
    function mostrarErro(elemento, mensagem) {
        elemento.classList.add("input-invalido");
        const containerPai = elemento.closest(".input-group");
        if (containerPai) {
            const spanErro = containerPai.querySelector(".erro-mensagem");
            if (spanErro) spanErro.textContent = mensagem;
        }
    }

    function limparTodosErros() {
        form.querySelectorAll("input, textarea, select").forEach(el => el.classList.remove("input-invalido"));
        form.querySelectorAll(".erro-mensagem").forEach(el => el.textContent = "");
    }

    function atualizarContadorGlobal() {
        totalContatosSpan.textContent = localStorage.getItem("totalContatos") || 0;
    }
});

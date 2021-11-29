const Modal = {
    open(){
        //Adiciona a classe 'active' ao modal
        document.querySelector('div.modal-overlay').classList.toggle('active');
        document.querySelector('div.modal').classList.add('slide-in-elliptic-left-fwd');
    },
     close(){
        //Remove a classe 'active' para esconder o modal
        document.querySelector('div.modal-overlay').classList.toggle('active');
        document.querySelector('div.modal').classList.remove('slide-in-elliptic-left-fwd');
    }   
} 
const Storage = {
    get(){
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
    },

    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    },
}
const Transaction = {
    all:Storage.get(),

    add(transaction){
        Transaction.all.push(transaction);

        App.reload()
    },
    remove(index){
        Transaction.all.splice(index, 1);

        App.reload()
    },

    incomes(){
        //somar as entradas
        let income = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0){
                income += transaction.amount;
            }
        })
        return income
    },
    expenses(){
        //somar as saidas
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
        return expense
    },
    total(){
        //Total do valor
        return Transaction.incomes() + Transaction.expenses();
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLtransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLtransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount);
        
        const html = 
        `<td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
            <img onClick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover alteração" />
            </td>`
        return html
    },

    updateBalance(){
        document.querySelector('p#incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.querySelector('p#expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.querySelector('p#totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ''
    }
}

//Formata os valores do sistema
const Utils = {
    // Formata o valor de string para number e multiplica por 100
    formatAmount(value){
        value = Number(value.replace(/\,\./g, "")) * 100

        return value
    },
    //Formata a data para o padrão Brasileiro
    formatDate(date){
        const splittedDate = date.split("-")
        
        
        return`${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value){
       const signal = Number(value) < 0 ? "-" : ""
       //contra barra "\D" significa pra pegar todos que não forem número e troca para ...
       value = String(value).replace(/\D/g, "")

       value = Number(value) / 100

       value = value.toLocaleString("pt-BR", {
       style: "currency",
       currency:"BRL"
    })
    return signal + value
    }
}

const Form = {
    //Pega os valores do formulário
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    //Pega os valores do formulário e retorna um objeto
    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    //Valida se os campos estão vazios
    validateFields(){
        const {description, amount, date} = Form.getValues()
        if (description.trim() === '' || amount.trim() === '' || date.trim() === ''){
            throw new Error("Por favor, preencha os campos")
        }
    },

    //Formata os valores do formulário
    formatValues(){
        let { description, amount, date} = Form.getValues()
        
        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)
    
        return {
            description,
            amount,
            date
        }
    },

    saveTransaction(transaction){
        Transaction.add(transaction)
        swal({
            title: "Sucesso!",
            text: "Transação adicionada com sucesso!",
            icon: "success",
            button: "OK"
        })
    },
    //Limpa os campos do formulário
    clearFields(){
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },

    submit(event){
        event.preventDefault(); 
        //Tenta achar o erro, se não tiver erro ele continua
        try {
            Form.validateFields()
            //Formata os valores do formulário
            const transaction = Form.formatValues()
            //Salva a transação
            Form.saveTransaction(transaction)
            //Limpa os campos do formulário
            Form.clearFields()
            //Fecha o modal
            Modal.close()
        } catch (error) {
            swal({
                title: "Erro!",
                text: error.message,
                icon: "error",
                button: "OK"
            })
        }
    }
}


const App = {
    init(){
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)

            Storage.set(Transaction.all)
        })
          DOM.updateBalance()
        
    },

    reload(){
        DOM.clearTransactions()
        App.init()
    }
}

App.init()
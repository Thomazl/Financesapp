const Modal = {
    open(){
        //add the class active in the modal to show the modal content
        document.querySelector('div.modal-overlay').classList.toggle('active');
        document.querySelector('div.modal').classList.add('slide-in-elliptic-left-fwd');
    },
     close(){
        //remove the class active in hte modal to desactive modal content
        document.querySelector('div.modal-overlay').classList.toggle('active');
        document.querySelector('div.modal').classList.remove('slide-in-elliptic-left-fwd');
    }   
} 

const Transaction = {
    all:[{
        description: 'Luz',
        amount: -50000,
        date:'23/01/2021'
    }, 
    {
        description: 'Website',
        amount: 50000,
        date:'23/01/2021'
    }, 
    {
        description: 'Internet',
        amount: -20000,
        date:'23/01/2021'
    },
    {
       description: 'App',
       amount: 20000,
       date:'23/01/2021'
   }],

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
        tr.innerHTML = DOM.innerHTMLtransaction(transaction)
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLtransaction(transaction){
        const CSSclass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount);
        
        const html = 
        `<td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img src="./assets/minus.svg" alt="Remover alteração" /></td>`
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

//Format the value in to the currency representation
const Utils = {
    formatAmount(value){
        value = Number(value) * 100

        return value
    },

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
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),


    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields(){
        const {description, amount, date} = Form.getValues()
        if (description.trim() === '' || amount.trim() === '' || date.trim() === ''){
            throw new Error("Por favor, preencha os campos")
        }
    },


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
    },

    submit(event){
        event.preventDefault(); 
        
        try {
            const transaction = Form.formatValues()

            Form.saveTransaction(transaction)
        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init(){
        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })
          DOM.updateBalance()
        
    },

    reload(){
        DOM.clearTransactions()
        App.init()
    }
}

App.init()
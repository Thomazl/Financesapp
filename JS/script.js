const Modal = {
    open(){
        //add the class active in the modal to show the modal content
        document.querySelector('div.modal-overlay').classList.toggle('active');
        document.querySelector('div.modal').classList.add('slide-in-elliptic-left-fwd');
        //console.log('Open')
    },
     close(){
        //remove the class active in hte modal to desactive modal content
        document.querySelector('div.modal-overlay').classList.toggle('active');
        document.querySelector('div.modal').classList.remove('slide-in-elliptic-left-fwd');
        // console.log('Close')
    }   
}

 const transactions = [{
     id: 1,
     description: 'Luz',
     amount: -50000,
     date:'23/01/2021'
 }, 
 {
     id: 2,
     description: 'Website',
     amount: 500000,
     date:'23/01/2021'
 }, 
 {
     id: 3,
     description: 'Internet',
     amount: -20000,
     date:'23/01/2021'
 },
 {
    id: 4,
    description: 'App',
    amount: 2000000,
    date:'23/01/2021'
},] 

const transaction = {
    all: transactions,
    add(transaction){
        transaction.all.push(transaction)
    },
    incomes(){
        //somar as entradas
        let income = 0;
        transaction.all.forEach(transaction => {
            if (transaction.amount > 0){
                income += transaction.amount;
            }
        })
        return income
    },
    expenses(){
        //somar as saidas
        let expense = 0;
        transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
        return expense
    },
    total(){
        //Total do valor
        return transaction.incomes() + transaction.expenses();
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
        document.querySelector('p#incomeDisplay').innerHTML = Utils.formatCurrency(transaction.incomes())
        document.querySelector('p#expenseDisplay').innerHTML = Utils.formatCurrency(transaction.expenses())
        document.querySelector('p#totalDisplay').innerHTML = Utils.formatCurrency(transaction.total())
    }
}

//Format the value in to the currency representation
const Utils = {
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

transactions.forEach(function (transaction) {
    DOM.addTransaction(transaction)
})
  DOM.updateBalance()
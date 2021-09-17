const Modal = {
    open(){
        //add the class active in the modal to show the modal content
        document.querySelector('div.modal-overlay').classList.add('active')
    },
    close(){
        //remove the class active in hte modal to desactive modal content
        document.querySelector('div.modal-overlay').classList.remove('active')
    }
}
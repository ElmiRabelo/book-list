//Book Class
class Book {
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }

}

//UI Class
class UI {

  addBookToList(book){
    const list = document.querySelector('#book-list');

    //create html
    const html = `
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>
          <a href="#" class="delete">X</a>
        </td>
      </tr>
    `;
    list.innerHTML += html;
  }

  deleteBook(target){
    const book = document.querySelector('#book-list');
    if(target.classList.contains('delete')){
      target.parentElement.parentElement.remove();
    }
  }

  showAlert(msg, className){
    //create HTML
    const html = `
      <div class="alert ${className}"><span>${msg}</span></div>
    `;
    //get parent element
    const form = document.querySelector('#book-form');
    form.insertAdjacentHTML('beforebegin', html);
    //After 3 seconds fade way
    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3000);
    
  }

  clearFields(){
    const title = document.getElementById('title').value = '';
    const author = document.getElementById('author').value = '';
    const isbn = document.getElementById('isbn').value = '';
  }
}

//Local Storage
class Store{
  static getBook(){
    let books;
    if(localStorage.getItem('books') === null){
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBook(){
    const books = Store.getBook();

    books.forEach(book => {
      const ui = new UI;

      //add book to UI
      ui.addBookToList(book);
    })
  }

  static addBook(book){
    const books = Store.getBook();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }
  static removeBook(isbn){
    const books = Store.getBook();

    books.forEach((book, index) => {
      if(book.isbn === isbn){
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));

  }
}


// EVENT LISTERNERS
document.addEventListener('DOMContentLoaded', Store.displayBook);

document.querySelector('#book-form').addEventListener('submit', e => {
  //GET FORM VALUES
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const isbn = document.getElementById('isbn').value;
  //INSTANTIATE UI
  const ui = new UI();
  //INSTANTIATE BOOK
  const book = new Book(title, author, isbn);

  if(!title || !author || !isbn){
    ui.showAlert('Please fill in the form', 'error');
  } else {
    ui.addBookToList(book);

    Store.addBook(book);

    ui.clearFields();

    //show success message
    ui.showAlert('Book Added!', 'success');

  }
  e.preventDefault();
});

document.querySelector('#book-list').addEventListener('click', e => {
  //instantiate ui 
  const ui = new UI;
  ui.deleteBook(e.target);
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //show message
  ui.showAlert('Book Removed.', 'success');
  e.preventDefault();
})
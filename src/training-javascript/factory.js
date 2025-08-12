// Factory function to create book objects (É uma fabrica de objetos)

function CreateBook(title, author, pages) {
  const book = {
    bookTitle: title,
    bookAuthor: author,
    bookPages: pages,
  };
  return book;
}

const book1 = CreateBook("1984 ddwdwdwdwd", "George Orwell", 328);
const book2 = CreateBook("To Kill a Mockingbird", "Harper Lee", 281);
const book3 = CreateBook("The Great Gatsby", "F. Scott Fitzgerald", 180);

console.log(book1);
console.log(book2);
console.log(book3);

// Constructor function to create book objects
function CreateBooks(title, author, pages) {
  this.title = title;
  this.author = author;
  this.pages = pages;
}

const book4 = new CreateBooks("Moby Dick", "Herman Melville", 635);
console.log(book4);

let checkForm;
const library = new Library();
let dialog;
let tableData;
let form;
let headerCheckbox;
let deleteButton;

document.addEventListener("DOMContentLoaded", main);

function main() {
  const container = document.querySelector(".books-container");
  dialog = document.querySelector(".add-book-dialog");
  tableData = document.querySelector(".table-data");
  form = document.querySelector(".add-new-book-form");
  deleteButton = document.querySelector(".delete-button");

  headerCheckbox = document.querySelector("#headerCheckbox");

  container.addEventListener("click", handlePageClicks);
  headerCheckbox.addEventListener("change", toggleAllCheckboxes);

  addExampleBooks();
}

function addExampleBooks() {
  let book1 = new Book("To Kill a Mockingbird", "Harper Lee", 281, "read");
  let book2 = new Book("1984", "George Orwell", 328, "not-read");
  let book3 = new Book("The Great Gatsby", "F. Scott Fitzgerald", 180, "read");
  let book4 = new Book("Moby Dick", "Herman Melville", 720, "not-read");
  updateLibraryData(book1);
  updateLibraryData(book2);
  updateLibraryData(book3);
  updateLibraryData(book4);
}

function showDeleteButton() {
  deleteButton.style.visibility = "visible";
}

function hideDeleteButton() {
  deleteButton.style.visibility = "hidden";
}

function isCheckboxChecked() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  const isAnyCheckboxChecked = Array.from(checkboxes).some(
    (checkbox) => checkbox.checked
  );

  if (isAnyCheckboxChecked) {
    showDeleteButton();
  } else {
    hideDeleteButton();
  }
}

function toggleAllCheckboxes() {
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:not(#headerCheckbox)'
  );

  checkboxes.forEach((checkbox) => {
    checkbox.checked = headerCheckbox.checked;
  });

  if (headerCheckbox.checked) {
    showDeleteButton();
  } else {
    hideDeleteButton();
  }
}

function handlePageClicks(event) {
  if (event.target.classList.contains("add-book")) {
    openDialog();
    dialog.addEventListener("click", processDialogClicks);

    let inputs = dialog.querySelectorAll("input");
    let submitButton = dialog.querySelector(".submit-button");

    checkForm = () => checkIfFormIsFilled(inputs, submitButton);
    dialog.addEventListener("input", checkForm);
  } else if (event.target.classList.contains("status-span")) {
    toggleReadStatus(event);
  } else if (event.target.parentNode.classList.contains("table-row")) {
    toggleCheckbox(event);
    isCheckboxChecked();
  } else if (event.target.type === "checkbox") {
    isCheckboxChecked();
  } else if (event.target.classList.contains("delete-button")) {
    deleteCheckedRows();
    checkboxes = document.querySelectorAll('input[type="checkbox"]');
  }
}

function deleteTableRow(checkbox) {
  let row = checkbox.parentNode.parentNode;
  row.remove();
  isCheckboxChecked();
}

function deleteCheckedRows() {
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:not(#headerCheckbox)'
  );

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      deleteTableRow(checkbox);
    }
  });

  checkIfNoRowsLeft();
}

function checkIfNoRowsLeft() {
  const tbody = document.querySelector("tbody.table-data");
  if (tbody.children.length === 0) {
    hideHeaderCheckbox();
    hideDeleteButton();
  }
}

function checkIfFormIsFilled(inputs, submitButton) {
  let allFilled = Array.from(inputs).every((input) => input.value !== "");

  submitButton.disabled = !allFilled;
}

function processDialogClicks(event) {
  if (event.target.classList.contains("close-dialog")) {
    closeDialog();
  } else if (event.target.classList.contains("submit-button")) {
    addNewBook(event);
    closeDialog();
  }
}

function addNewBook(event) {
  event.preventDefault();
  let book = createBookFromUserData();

  updateLibraryData(book);

  closeDialog();
}

function createBookFromUserData() {
  let bookData = {};
  Book.properties.forEach((property) => {
    bookData[property] = form.elements[property].value;
  });

  return new Book(
    bookData.title,
    bookData.author,
    bookData["pages-amount"],
    bookData.status
  );
}

function showHeaderCheckbox() {
  headerCheckbox.style.display = "inline";
}

function hideHeaderCheckbox() {
  headerCheckbox.style.display = "none";
  headerCheckbox.checked = false;
}

function updateLibraryData(book) {
  library.addBook(book);
  addBookToTable(book);
  showHeaderCheckbox();
}

function addBookToTable(book) {
  const row = createTableRow(book);

  row.id = library.booksAmount() - 1;
  tableData.appendChild(row);
}

function createTableRow(book) {
  const row = document.createElement("tr");
  row.classList.add("table-row");

  addCheckbox(row);

  Book.properties.forEach((property) => {
    const cell = document.createElement("td");
    cell.classList.add(property);

    if (property === "status") {
      const span = document.createElement("span");
      span.classList.add("status-span", book[property]);
      span.textContent = book[property];
      cell.appendChild(span);
    } else {
      const cellText = document.createTextNode(book[property]);
      cell.appendChild(cellText);
    }

    row.appendChild(cell);
  });

  return row;
}

function toggleReadStatus(event) {
  let element = event.target;
  let parentId = element.parentNode.parentNode.id;

  let currentBook = library.storage[parentId];
  let newStatus = currentBook.status === "read" ? "not-read" : "read";
  currentBook.status = newStatus;

  if (element.classList.contains("read")) {
    element.classList.replace("read", "not-read");
  } else if (element.classList.contains("not-read")) {
    element.classList.replace("not-read", "read");
  }

  element.textContent = newStatus;
}

/* Dialog Processing */

function closeDialog() {
  dialog.removeEventListener("click", processDialogClicks);
  dialog.removeEventListener("input", checkForm);
  dialog.close();
  form.reset();
}

function openDialog() {
  dialog.showModal();
}

function addAllBooks(books) {
  books.forEach((book) => {
    addBookToLibrary(book);
  });
}

/* Checkbox Processing */

function addCheckbox(row) {
  let checkboxCell = document.createElement("td");
  checkboxCell.classList.add("checkbox-cell");
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "check-book";
  checkboxCell.appendChild(checkbox);
  row.appendChild(checkboxCell);
}

function toggleCheckbox(event) {
  if (event.target.classList.contains("status-span")) {
    return;
  }

  let currentRow = event.target.parentNode;

  let checkbox = currentRow.querySelector('input[type="checkbox"]');
  checkbox.checked = !checkbox.checked;
}

/* test function */

function testBooksLayout() {
  let book1 = new Book("To Kill a Mockingbird", "Harper Lee", 281, "read");
  let book2 = new Book("1984", "George Orwell", 328, "not-read");
  let book3 = new Book("The Great Gatsby", "F. Scott Fitzgerald", 180, "read");
  let book4 = new Book("Moby Dick", "Herman Melville", 720, "not-read");
  let book5 = new Book("Ulysses", "James Joyce", 730, "read");
  let book6 = new Book("Don Quixote", "Miguel de Cervantes", 1023, "not-read");
  let book7 = new Book("The Odyssey", "Homer", 500, "read");
  let book8 = new Book("War and Peace", "Leo Tolstoy", 1225, "not-read");
  let book9 = new Book("The Divine Comedy", "Dante Alighieri", 798, "read");
  let book10 = new Book("Pride and Prejudice", "Jane Austen", 279, "not-read");

  updateLibraryData(book1);
  updateLibraryData(book2);
  updateLibraryData(book3);
  updateLibraryData(book4);
  updateLibraryData(book5);
  updateLibraryData(book6);
  updateLibraryData(book7);
  updateLibraryData(book8);
  updateLibraryData(book9);
  updateLibraryData(book10);
  updateLibraryData(book1);
  updateLibraryData(book2);
  updateLibraryData(book3);
  updateLibraryData(book4);
  updateLibraryData(book5);
  updateLibraryData(book6);
  updateLibraryData(book7);
  updateLibraryData(book8);
  updateLibraryData(book9);
  updateLibraryData(book10);
  updateLibraryData(book1);
  updateLibraryData(book2);
  updateLibraryData(book3);
  updateLibraryData(book4);
  updateLibraryData(book5);
  updateLibraryData(book6);
  updateLibraryData(book7);
  updateLibraryData(book8);
  updateLibraryData(book9);
  updateLibraryData(book10);
  updateLibraryData(book1);
  updateLibraryData(book2);
  updateLibraryData(book3);
  updateLibraryData(book4);
  updateLibraryData(book5);
  updateLibraryData(book6);
  updateLibraryData(book7);
  updateLibraryData(book8);
  updateLibraryData(book9);
  updateLibraryData(book10);
  let longBook = new Book(
    "This is a really long book title that goes on and on and on",
    "This is a really long author name that also goes on and on and on",
    "1234",
    "read"
  );
  updateLibraryData(longBook);
}
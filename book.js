function Book(title, author, pagesAmount, status) {

    this.title = title;
    this.author = author;
    this['pages-amount'] = pagesAmount;
    this.status = status;
  }
  
  Book.properties = ["title", "author", "pages-amount", "status"];
  
  
  Book.prototype.getTitle = function() {
    return this.title;
  }
  
  Book.prototype.getAuthor = function() {
    return this.author;
  }
  
  Book.prototype.getPagesAmount = function() {
    return this.pagesAmount;
  }
  
  Book.prototype.getStatus = function() {
    return this.status;
  }
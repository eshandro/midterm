var allBooks = [1];

// var currentBooks = [];
// var toReadBooks = [];
// var readBooks = [];

var Book = function (title, author, status) {
	this.title = title;
	this.author = author;
	this.status = status;
}
Book.prototype.createElem = function() {
	this.elem = $('<span class="book">');
	var randomColor = _.random(1,4);
	switch(randomColor) {
		case 1:
			color = 'red';
			break;
		case 2:
			color = 'blue';
			break;
		case 3:
			color = 'green';
			break;
		case 4:
			color = 'black';
			break;
		default:
			color = 'black';
	}
	$(this.elem).css('border-color', color);
	return this.elem;
}
var Stack = function () {
	this.bookList = [];
	
	this.addBook = function(book) {
		bookList.push(book);
	};
	
	this.deleteBook = function(index) {
		bookList.splice(index,1);
	};
	
	this.findIndexOfBook = function(title) {
		for(var i=0; i<this.bookList.length; i++) {
			if(this.bookList[i].title === title) {
				return i;
			};
		};
	};	
}


var BedsideStack = function() {
	this.bedsideStackList = [];
	this.createElem = function() {
		this.elem = $('<div id="bedside-stack">');
		return this.elem;
	}
	this.displayElem = function() {
		$('.bedside').before(this.createElem());
	}
}
BedsideStack.prototype = new Stack();
BedsideStack.prototype.constructor = BedsideStack;


var CurrentReadingStack = function() {
	this.createElem = function() {
		this.elem = $('<div id="current-stack">');
		return this.elem;
	}
	this.displayElem = function() {
		$('.current').before(this.createElem());
	}
}
CurrentReadingStack.prototype = new Stack();
CurrentReadingStack.prototype.constructor = CurrentReadingStack;


var RecentReadStack = function() {
	this.createElem = function() {
		this.elem = $('<div id="recent-stack">');
		return this.elem;
	}
	this.displayElem = function() {
		$('.read').before(this.createElem());
	}
}
RecentReadStack.prototype = new Stack();
RecentReadStack.prototype.constructor = RecentReadStack;

// Creates and adds Stack, BedsideStack, RecentReadStack, CurrentReadingStack
var stack = new Stack();

var bedsideStack = new BedsideStack();
bedsideStack.displayElem(bedsideStack.createElem());

var currentStack = new CurrentReadingStack();
currentStack.displayElem(currentStack.createElem());

var recentStack = new RecentReadStack();
recentStack.displayElem(recentStack.createElem());


$(document).on('ready', function() {

	$('.add-button').on('click', function() {
		// Opens up the form animated from the right
		$(this).addClass('is-hidden');
		$('.add-book-form').removeClass('display-none');
		$('.add-book-form').animate( {
			left: 0,
			opacity: 1
		}, 1500 );
	});

	$('.add-book-form').on('submit', function(event) {
		event.preventDefault();
	})

	$(document).on('click', '.shelf-it', function() {

			
		// Creates new Book and adds it to allBooks array
		var newTitle = $('#new-book-title').val();
		if(newTitle) {
			var newAuthor = $('#new-author').val();
			var newBookStatus = $('input[name=book-status]:checked', '.add-book-form').val();
			var newBook = new Book(newTitle, newAuthor, newBookStatus);
			allBooks.push(newBook);

			// Closes form animated to the right and shows add button
			$('.add-book-form').animate( {
				left: 134 + '%',
				opacity: 0
			}, 1500, function () {
			$('.add-book-form').addClass('display-none');
			$('.add-button').removeClass('is-hidden');			
			});
		}

		// Add newBook to correct Stack
		var testStatus = newBook.status;
		var idLocation = '';
		if(testStatus === 'to-read') {
			bedsideStack['bookList'].push(newBook);
			idLocation = $('#bedside-stack');
		}
		if(testStatus === 'reading') {
			currentStack['bookList'].push(newBook);
			idLocation = $('#current-stack');
		}
		if(testStatus === 'recent-read') {
			RecentReadStack['bookList'].push(newBook);
			idLocation = $('#recent-stack');
		}

		// Create the newBook element & displays it to the correct stack
		var displayBook = newBook.createElem();

		$(idLocation).append($(displayBook));
		
		// 
	});

	// Closes add book form
	$('.cancel').on('click', function(event) {
		event.preventDefault();
		$('.add-book-form').animate( {
			left: 134 + '%',
			opacity: 0
		}, 1500, function () {
		$('.add-book-form').addClass('display-none');
		$('.add-button').removeClass('is-hidden');			
		});
	});
  
});
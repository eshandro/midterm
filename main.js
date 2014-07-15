var allBooks = [];


var Book = function (title, author, status) {
	this.title = title;
	this.author = author;
	this.status = status;
	this.orientation = '';
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
	if (randomColor === 1 || randomColor === 3){
		$(this.elem).addClass('horizontal-book');
		this.orientation = 'horizontal';
	}
	else {
		$(this.elem).addClass('vertical-book');
		this.orientation = 'vertical'
	}
	$(this.elem).css('border-color', color);

	return this.elem;
}


var Stack = function () {
	this.bookList = [];
	
	this.addBook = function(book) {
		this.bookList.push(book);
	};
	
	this.deleteBook = function(index) {
		this.bookList.splice(index,1);
	};
	
	this.findIndexOfBook = function(title) {
		for(var i=0; i<this.bookList.length; i++) {
			if(this.bookList[i].title === title) {
				return i;
			};
		};
	};

	this.getBookPosition = function(book) {
		var positions = [];
		var bottom = 0;
		var left = 0;
		var firstBookOrientation = this.bookList[0].orientation;
		if (firstBookOrientation === 'horizontal') {
			left = 182;
		}
		else { 
			left = 77;
		}

		// Figure bottom amount
		if (book.orientation === 'vertical') {
			bottom = 0;
		}
		else {
			for (var i=this.bookList.length-2; i >= 0; i--) {
				if (this.bookList[i].orientation === 'horizontal') {
					bottom += 41; 
				}
			}
		}
		console.log(bottom);
		positions.push(bottom);
		// Figure left amount
		for (var i=1; i <this.bookList.length-1; i++) {
			if (this.bookList[i].orientation === 'horizontal' 
				&& book.orientation !== 'horizontal') {
				left += 152;
					if(this.bookList[i] === 'horizontal' && this.bookList[i-1] === 'horizontal') {
						left -= 152;
					}
			}
			if (this.bookList[i].orientation === 'vertical') {
				left += 42;
			}
		}
		console.log(left)
		positions.push(left);
		return positions;
	}	
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
		$('.add-book-form').removeClass('is-hidden');
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
		var newAuthor = $('#new-author').val();
		var newBookStatus = $('input[name=book-status]:checked', '.add-book-form').val();
		if(newTitle && newBookStatus) {
			var newBook = new Book(newTitle, newAuthor, newBookStatus);
			allBooks.push(newBook);

			// Closes form animated to the right and shows add button
			$('.add-book-form').animate( {
				left: 134 + '%',
				opacity: 0
			}, 1500, function () {
			$('.add-book-form').addClass('is-hidden');
			$('.add-button').removeClass('is-hidden');			
			// Clear out entered form info
			$('#new-book-title').val('');
			$('#new-author').val('');
			$('input[name=book-status]:checked', '.add-book-form').prop('checked', false);
			});
		}

		// Add newBook to correct Stack
		var testStatus = newBook.status;
		var idLocation = '';

		if(testStatus === 'to-read') {
			bedsideStack.addBook(newBook);
			idLocation = $('#bedside-stack');
			var stackBeingUsed = bedsideStack;
		}
		if(testStatus === 'current-read') {
			currentStack.addBook(newBook);
			idLocation = $('#current-stack');
			var stackBeingUsed = currentStack;
		}
		if(testStatus === 'recent-read') {
			recentStack.addBook(newBook);
			idLocation = $('#recent-stack');
			var stackBeingUsed = recentStack;
		}

		// Create the newBook element & displays it to the correct stack
		var displayBook = newBook.createElem();
		if (stackBeingUsed.bookList.length === 5) {
			displayBook.removeClass('horizontal-book');
			displayBook.addClass('vertical-book');
		}
		// If statement adds vertical text if necessary
		if ($(displayBook).attr('class') === 'book vertical-book') {
			var titlePara = $('<p class="vertical-text">');
			$(titlePara).text(newTitle);
			$(displayBook).append($(titlePara));
		}
		else {
			$(displayBook).text(newTitle); 
		}
		
		// Find bottom and left position of this book
		if (stackBeingUsed.bookList.length !== 1) {	
			var positions = stackBeingUsed.getBookPosition(newBook);
			var bottomPos = positions[0] + 'px';
			var leftPos = positions[1] +'px';
			$(displayBook).css({
				'bottom': bottomPos,
				'left': leftPos });
		}
		$(idLocation).append($(displayBook));
		 
	});

	// Closes add book form
	$('.cancel').on('click', function(event) {
		event.preventDefault();
		$('.add-book-form').animate( {
			left: 134 + '%',
			opacity: 0
		}, 1500, function () {
			$('.add-book-form').addClass('is-hidden');
			$('.add-button').removeClass('is-hidden');			
			// Clear out entered form info
			$('#new-book-title').val('');
			$('#new-author').val('');
			$('input[name=book-status]:checked', '.add-book-form').prop('checked', false);
		});
	});
  
});
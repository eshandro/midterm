var allBooks = [];


var Book = function (title, author, status) {
	this.title = title;
	this.author = author;
	this.status = status;
	this.orientation = '';
	// Pushes new books into allBooks array
	allBooks.push(this);	
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
Book.prototype.getStack = function() {
		// Add a book to correct Stack and returns the Stack
		var testStatus = this.status;

		if(testStatus === 'to-read') {
			bedsideStack.addBook(this);
			var stackBeingUsed = bedsideStack;
		}
		if(testStatus === 'current-read') {
			currentStack.addBook(this);
			var stackBeingUsed = currentStack;
		}
		if(testStatus === 'recent-read') {
			recentStack.addBook(this);
			var stackBeingUsed = recentStack;
		}		
		return stackBeingUsed;
	}

Book.prototype.getID = function() {
		// get ID for placing book element on page
		var testStatus = this.status;
		var idLocation = '';
		if(testStatus === 'to-read') {
			idLocation = $('#bedside-stack');
		}
		if(testStatus === 'current-read') {
			idLocation = $('#current-stack');
		}
		if(testStatus === 'recent-read') {
			idLocation = $('#recent-stack');
		}		
		return idLocation;
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
			left = 125;
		}
		else { 
			left = 95;
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
		positions.push(bottom);
		
		// Figure left amount
		for (var i=0; i <this.bookList.length-1; i++) {
			if (this.bookList[i].orientation === 'horizontal' 
				&& book.orientation !== 'horizontal') {
				left += 152;
			}
			if (this.bookList[i].orientation === 'vertical') {
				left += 42;
			}
		}
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

// Makes an element draggable
var addDraggable = function(item) {
	$(item).draggable({ revert: 'invalid',
						cursor: 'move',
						 });
};

var addDroppable = function(item){
	$(item).droppable({ hoverClass: "drop-hover" });
}

// Creates and adds Stack, BedsideStack, RecentReadStack, CurrentReadingStack
var stack = new Stack();

var bedsideStack = new BedsideStack();
bedsideStack.displayElem(bedsideStack.createElem());

var currentStack = new CurrentReadingStack();
currentStack.displayElem(currentStack.createElem());

var recentStack = new RecentReadStack();
recentStack.displayElem(recentStack.createElem());



$(document).on('ready', function() {

	// Makes Stack areas droppable
	addDroppable('#bedside-stack');
	addDroppable('#current-stack');
	addDroppable('#recent-stack');

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

			
		// Creates new Book from form info
		var newTitle = $('#new-book-title').val();
		var newAuthor = $('#new-author').val();
		var newBookStatus = $('input[name=book-status]:checked', '.add-book-form').val();
		if(newTitle && newBookStatus) {
			var newBook = new Book(newTitle, newAuthor, newBookStatus);

			// Closes form animated to the right and shows add button
			$('.add-book-form').animate( {
				left: 134 + '%',
				opacity: 0
			}, 1000, function () {
			$('.add-book-form').addClass('is-hidden');
			$('.add-button').removeClass('is-hidden');			
			// Clear out entered form info
			$('#new-book-title').val('');
			$('#new-author').val('');
			$('input[name=book-status]:checked', '.add-book-form').prop('checked', false);
			});
		}

		// Get correct Stack and ID
		var stackBeingUsed = newBook.getStack();

		var idLocation = newBook.getID();

		// Create the newBook element 
		var displayBook = newBook.createElem();
		
		// Set vertical or horizontal orientation of book
		if (stackBeingUsed === recentStack) {
			displayBook.addClass('vertical-book');
			newBook.orientation = 'vertical';
		};
		if (stackBeingUsed === currentStack) {
			displayBook.addClass('vertical-book');
			newBook.orientation = 'vertical';
		}
		if (stackBeingUsed === bedsideStack) {
			displayBook.addClass('horizontal-book');
			newBook.orientation = 'horizontal';
		}
		// Changes text to vertical text if necessary
		if ($(displayBook).attr('class') === 'book vertical-book') {
			var titlePara = $('<p class="vertical-text">');
			$(titlePara).text(newTitle);
			$(displayBook).append($(titlePara));
		}
		else {
			$(displayBook).text(newTitle); 
		}
		
		// Find bottom and left position of this book
		var positions = stackBeingUsed.getBookPosition(newBook);
		var bottomPos = positions[0] + 'px';
		var leftPos = positions[1] +'px';
		$(displayBook).css({
				'bottom': bottomPos,
				'left': leftPos });
		
		$(idLocation).append($(displayBook));

		// Make new book draggable
		addDraggable(displayBook);

		 
	});

	// Closes and clears add book form
	$('.cancel').on('click', function(event) {
		event.preventDefault();
		$('.add-book-form').animate( {
			left: 134 + '%',
			opacity: 0
		}, 1000, function () {
			$('.add-book-form').addClass('is-hidden');
			$('.add-button').removeClass('is-hidden');			
			// Clear out entered form info
			$('#new-book-title').val('');
			$('#new-author').val('');
			$('input[name=book-status]:checked', '.add-book-form').prop('checked', false);
		});
	});
  
	$(document).on('drag', '#bedside-stack > .book', function() {
		$(this).css('transform', 'rotate(90deg)');
	})

	$(document).on('drop', '#bedside-stack', function(e, ui) {
		console.log(ui.position);
		console.log(ui.draggable);
		console.log(e.offsetX);
		var setLeft = e.offsetX + 'px';
		$(this).append(ui.draggable);
		$(ui.draggable).css({'bottom': 0,
							'top': '',
							'left': setLeft });
	})
	$(document).on('mouseup', '#bedside-stack', function(event) {
		console.log(event.offsetX);
	})
});
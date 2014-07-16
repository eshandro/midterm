var allBooks = [];
findBookByDataID = function(dataID) {
	for(var i=0; i<allBooks.length; i++) {
		if(allBooks[i].id === dataID) {
			return allBooks[i];
		}
	}
};

// ------------------------------- Books --------------------------- 

var Book = function (title, author, status) {
	this.title = title;
	this.author = author;
	this.status = status;
	this.orientation = '';
	this.color = '';
	this.id = Book.counter++;
	// Pushes new books into allBooks array
	allBooks.push(this);	
}
Book.counter = 0;

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
	this.color = color;
	$(this.elem).attr('data-id', this.id);
	return this.elem;
}
// Finds the Stack from Book status
Book.prototype.getStackFromStatus = function() {
		var testStatus = this.status;

		if(testStatus === 'to-read') {
			var stackBeingUsed = bedsideStack;
		}
		if(testStatus === 'current-read') {
			var stackBeingUsed = currentStack;
		}
		if(testStatus === 'recent-read') {
			var stackBeingUsed = recentStack;
		}		
		return stackBeingUsed;
	}
// Set Book status from Stack
Book.prototype.getStatusFromStack = function(stack) {
	if(stack === bedsideStack) {
		var newStatus = 'to-read';
	}
	if(stack === currentStack) {
		var newStatus = 'current-read';
	}
	if(stack === recentStack) {
		var newStatus = 'recent-read';
	}
	return newStatus;
}

Book.prototype.getHTMLID = function() {
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

// ------------------------------- Stacks --------------------------- 

var Stack = function () {
	this.bookList = [];
	
	this.addBook = function(book) {
		this.bookList.push(book);
	};
	
	this.deleteBook = function(index) {
		this.bookList.splice(index,1);
	};
	
	this.findIndexOfBookInStack = function(id) {
		for(var i=0; i<this.bookList.length; i++) {
			if(this.bookList[i].id === id) {
				return i;
			};
		};
	};


	this.setBookPosition = function(book) {
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
	this.bookOrientation = 'horizontal';
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
	this.bookOrientation = 'vertical';
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
	this.bookOrientation = 'vertical'
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

// Gets new Stack from DOM element for drop events
var getStackFromID = function(ID) {
	if(ID === 'bedside-stack') {
		var newStack = bedsideStack;
	}
	if(ID === 'recent-stack') {
		var newStack = recentStack;
	}
	if(ID === 'current-stack') {
		var newStack = currentStack;
	}
	return newStack;
}
// ------------------------------- Drag and Drop --------------------------- 
// Makes an element draggable
var addDraggable = function(item) {
	$(item).draggable({ revert: 'invalid',
						cursor: 'move',
						contain: 'window',
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

	// Stops form from submitting and refreshing page on book add
	$('.add-book-form').on('submit', function(event) {
		event.preventDefault();
	})

	$(document).on('click', '.shelf-it', function() {

// ----------------------- Create a new Book and to DOM and Stacks --------------
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
			// Reset form
			$('#new-book-title').val('');
			$('#new-author').val('');
			$('input[name=book-status]:checked', '.add-book-form').prop('checked', false);
			});
		}

		// Get correct Stack and ID
		var stackBeingUsed = newBook.getStackFromStatus();
		var idLocation = newBook.getHTMLID();

		// Add this book to correct Stack bookList
		stackBeingUsed.addBook(newBook);

		// Create the newBook element 
		var displayBook = newBook.createElem();
		
		// Set vertical or horizontal orientation of book
		if (stackBeingUsed.bookOrientation === 'vertical') {
			displayBook.addClass('vertical-book');
			newBook.orientation = 'vertical';
		};
		
		if (stackBeingUsed.bookOrientation === 'horizontal') {
			displayBook.addClass('horizontal-book');
			newBook.orientation = 'horizontal';
		};
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
		var positions = stackBeingUsed.setBookPosition(newBook);
		var bottomPos = positions[0] + 'px';
		var leftPos = positions[1] +'px';
		$(displayBook).css({
				'bottom': bottomPos,
				'left': leftPos });
		
		$(idLocation).append($(displayBook));

		// Make new book draggable
		addDraggable(displayBook);

		 
	});
// ---------------------------------------------------------------------------------
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
  
/*	$(document).on('dragstart', '.book', function() {
		console.log(this.title);

		$(this).css('transform', 'rotate(90deg)');
	})*/

	$(document).on('drop', '.ui-droppable', function(e, ui) {
		// Set position of dropped book
		var droppedBookElem = $(ui.draggable);
		var setLeft = e.offsetX + 'px';

		$(this).append(droppedBookElem);
		$(droppedBookElem).css({'bottom': 0,
							'top': '',
							'left': setLeft });
		
		// Remove from old Stack and add dropped book to new Stack bookList
		var droppedBookID = +droppedBookElem.attr('data-id');
		var droppedBook = findBookByDataID(droppedBookID);
		var oldStack = droppedBook.getStackFromStatus();
		oldStack.deleteBook(oldStack.findIndexOfBookInStack(droppedBookID));

		var newStackID = $(this).attr('id');
		var newStack = getStackFromID(newStackID);
		droppedBook.orientation = newStack.bookOrientation;
		droppedBook.status = droppedBook.getStatusFromStack(newStack);
		newStack.addBook(droppedBook);

	})


/*	$(document).on('mouseup', '#bedside-stack', function(event) {
		console.log(event.offsetX);
	})*/

	
});
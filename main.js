var allBooks = [];
findBookByDataID = function(dataID) {
	for(var i=0; i<allBooks.length; i++) {
		if(allBooks[i].id === dataID) {
			return allBooks[i];
		}
	}
};

var sortAllBooksByStatus = function(list) {
	for(var i=0; i<allBooks.length; i++) {
		if(allBooks[i].status === 'current-read') {
			allBooks[i].sortNumber = 1;
		}
		if(allBooks[i].status === 'to-read') {
			allBooks[i].sortNumber = 2;
		}
		if(allBooks[i].status === 'recent-read') {
			allBooks[i].sortNumber = 3;
		}
	}
	var sortedList = _.sortBy(list, function(item) {
		return item.sortNumber;
	});
	allBooks = sortedList;
};

var createBooksTableElem = function() {
	var currentUser = userNameList[userNameList.length-1];

	var panel = $('<div class="panel panel-default">');
	var panelHeading = $('<div class="panel-heading">');
	var panelTitle = $('<h3 class="panel-title">' + currentUser + '\'s Library</h3>');
	var panelBody = $('<div class="panel-body">');
	var panelBodyText = '<p>Here are all the books in your library.</p>'
	var tableBooks = $('<table class="table table-striped">');
	var tableHeader = $('<tr><th>#</th><th>Title</th><th>Author</th></tr>');

	panel.append(panelHeading);
	panelHeading.append(panelTitle);
	panel.append(panelBody);
	panelBody.append(panelBodyText);
	panel.append(tableBooks);
	tableBooks.append(tableHeader);


	sortAllBooksByStatus(allBooks);
	var counter = 1;
	for(var i=0; i < allBooks.length; i++) {
		var tableRow = $('<tr>');

		tableRow.append($('<td>' + counter + '</td>'));

		tableRow.append($('<td>' + allBooks[i].title + '</td>'));
		tableRow.append($('<td>' + allBooks[i].author + '</td>'));

		tableBooks.append(tableRow);

		counter++;
	}

	return panel;
}

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

// User name storage
var userNameList = [];

// Create pop up for adding comments
var createCommentsPopUp = function() {
	var enterCommentsContainer = $('<div class="comments-container">');
	var enterCommentsHeader = $('<h2>Enter your comment here</h2>');
	var enterCommentsTextarea = $('<textarea class="new-comment" placeholder="Comments">');
	var enterCommentsCancel = $('<button class="button cancel-comment">Cancel</button>');
	var enterCommentsSave = $('<button class="button save-comment">Save</button>');

	enterCommentsContainer.append(enterCommentsHeader);
	enterCommentsContainer.append(enterCommentsTextarea);
	enterCommentsContainer.append(enterCommentsCancel);
	enterCommentsContainer.append(enterCommentsSave);

	return enterCommentsContainer;
};
// --------------------- Document on Ready -----------------------------------
$(document).on('ready', function() {
	
	// Makes Stack areas droppable
	addDroppable('#bedside-stack');
	addDroppable('#current-stack');
	addDroppable('#recent-stack');

	$('.add-book').on('click', function() {
		// Opens up the form animated from the right
		$(this).addClass('is-hidden');
		$('.add-book-form').removeClass('is-hidden');
		$('.add-book-form').css('left', 134 + '%');
		$('.add-book-form').animate( {
			left: 0,
			opacity: 1
		}, 1500 );
	});

	// Stops form from submitting and refreshing page on book add
	$('.add-book-form').on('submit', function(event) {
		event.preventDefault();
	})

// ----------------------- Create a new Book and to DOM and Stacks --------------
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
			$('.add-book').removeClass('is-hidden');
			$('.add-book-form').css('left', 0);			
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
			$('.add-book').removeClass('is-hidden');
			$('.add-book-form').css('left', 0);				
			// Clear out entered form info
			$('#new-book-title').val('');
			$('#new-author').val('');
			$('input[name=book-status]:checked', '.add-book-form').prop('checked', false);
		});
	});

// --------------------- Drop event ------------------------------------
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

// ---------------------- Sign in and Log out events ----------------------------------

	$(document).on('click', '.sign-in-button', function(event) {
		event.preventDefault();
		var userName = $('#user-name').val();
		if (!userName) {
			var badLogIn = 'Invalid User Name';
			$('#user-name').attr('placeholder', badLogIn);
		}
		else {
			userNameList.push(userName);
			$('#user-name').removeClass('form-control');
			$('#user-name').addClass('is-none');
			$('#user-password').removeClass('form-control');
			$('#user-password').addClass('is-none');
			$('.sign-in-form').prepend(
				'<p class="navbar-text welcome")>Welcome back, ' + userName + '!</p>');

			$(this).removeClass('sign-in-button');
			$(this).addClass('log-out-button');
			$(this).text("Log out");

			$('#user-name').val('');
			$('#user-password').val('');
		}
	})

	$(document).on('click', '.log-out-button', function(event) {
		event.preventDefault();
		$('.welcome').remove();
		$('#user-name').addClass('form-control');
		$('#user-name').removeClass('is-none');
		$('#user-password').addClass('form-control');
		$('#user-password').removeClass('is-none');		

		$(this).removeClass('log-out-button');
		$(this).addClass('sign-in-button');
		$(this).text("Sign in");
		userNameList.pop();
	});
// ---------------------- Library popup --------------------------------------

	// Create pop-up lightbox
	$(document).on('click', '.library-button', function(event) {
		event.preventDefault();
		$('body').append('<div class="popup-back">');
		$('body').append('<div class="popup-cont">');
		var displayLibrary = createBooksTableElem();
		$('.popup-cont').append(displayLibrary);
		$('.popup-cont').append('<span class="popup-close">X');
		$('.popup-back').animate( {
			opacity: 1, }, 800);
		$('.popup-cont').animate( {
			opacity: 1, }, 1200);
	});

	// Remove pop-up on click
	$(document).on('click', '.popup-close', function() {
		$('.popup-back').animate( {
			opacity: 0, }, 800);
		$('.popup-cont').animate( {
			opacity: 0, }, 1200);
		setTimeout( function() {
		$('.popup-cont').remove();
		$('.popup-back').remove();
	}, 1400);
	})

// ---------------------- Comments events ---------------------------------

	$(document).on('click', '.add-comment', function(event) {
		event.preventDefault();
		$('body').append('<div class="popup-back">');
		$('body').append('<div class="popup-cont">');
		var displayAddComments = createCommentsPopUp();
		$('.popup-cont').append(displayAddComments);
		$('.popup-cont').append('<span class="popup-close">X');
		$('.popup-back').animate( {
			opacity: 1, }, 800);
		$('.popup-cont').animate( {
			opacity: 1, }, 1200);				
	});

	$(document).on('click', '.cancel-comment', function(event) {
		event.preventDefault();
		$('.popup-back').animate( {
			opacity: 0, }, 800);
		$('.popup-cont').animate( {
			opacity: 0, }, 1200);
		setTimeout( function() {
		$('.popup-cont').remove();
		$('.popup-back').remove();
		}, 1400);		
	});	
});
var allBooks = [];
var findBookByDataID = function(dataID) {
	for(var i=0; i<allBooks.length; i++) {
		if(allBooks[i].id === dataID) {
			return allBooks[i];
		}
	}
};

var findIndexofBookinallBooks = function(id) {
	for (var i=0; i < allBooks.length; i++) {
		if (allBooks[i].id === id) {
			return i;
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
	var tableHeader = $('<tr><th>#</th><th>Title</th><th>Author</th><th>Read?</th></tr>');

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
		if (allBooks[i].status === 'current-read') {
			var tableReadCell = $('<td>Reading</td>')
			tableReadCell.css('color', '#47a447');
		}
		if (allBooks[i].status === 'to-read') {
			var tableReadCell = $('<td>Reading Soon</td>')
			tableReadCell.css('color', '#367f93');
		}
		if (allBooks[i].status === 'recent-read') {
			var tableReadCell = $('<td>Read</td>')
		}
		tableRow.append(tableReadCell);

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
	$(this.elem).attr('data-toggle', 'tooltip');
	$(this.elem).attr('rel="tooltip"');
	$(this.elem).attr('title', 'Drag to any stack to update');
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
		var left = 45;
		var currentBookOrientation = book.orientation;
		// var firstBookOrientation = this.bookList[0].orientation;
		var totalNumberInStack = this.bookList.length;
		// Set location if current book is horizontal
		if (currentBookOrientation === 'horizontal') {
			left = 125;
			// Set bottom based on # of books in stack
			for(var i=0; i < totalNumberInStack-1; i++) {
				bottom += 41;
			}
		}
		
		// Set location if current book is vertical
		else { 
			bottom = 0;
			for(var i=0; i < totalNumberInStack-1; i++) {
				left +=42;
			}				
		}
		positions.push(bottom);		
		positions.push(left);
		return positions;
	};	
}

var BedsideStack = function() {
	this.bookOrientation = 'horizontal';
	this.createElem = function() {
		this.elem = $('<div id="bedside-stack" class="stack">');
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
		this.elem = $('<div id="current-stack" class="stack">');
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
		this.elem = $('<div id="recent-stack" class="stack">');
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
	$(item).droppable();
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

// Close pop-ups
var closePopUp = function() {
		$('.popup-back').animate( {
			opacity: 0, }, 800);
		$('.popup-cont').animate( {
			opacity: 0, }, 1200);
		setTimeout( function() {
		$('.popup-cont').remove();
		$('.popup-back').remove();
		}, 1400);	
};
// Set up page for demo
var setPageUp = function (book) {
		var stackBeingUsed = book.getStackFromStatus();
		var idLocation = book.getHTMLID();
		stackBeingUsed.addBook(book);
		var displayBook = book.createElem();
		if (stackBeingUsed.bookOrientation === 'vertical') {
			displayBook.addClass('vertical-book');
			book.orientation = 'vertical';
		};
		if (stackBeingUsed.bookOrientation === 'horizontal') {
			displayBook.addClass('horizontal-book');
			book.orientation = 'horizontal';
			displayBook.attr('data-placement', 'left');
		};
		if ($(displayBook).attr('class') === 'book vertical-book') {
			var titlePara = $('<p class="vertical-text">');
			$(titlePara).text(book.title);
			$(displayBook).append($(titlePara));
		}
		else {
			$(displayBook).text(book.title); 
		}
		var stackLocationTop = idLocation.offset().top;
		var stackLocationLeft = idLocation.offset().left;
		var positions = stackBeingUsed.setBookPosition(book);
		var bottomPos = positions[0] + 'px';
		var leftPos = positions[1] +'px';
		if (idLocation[0].id === 'bedside-stack') {
			$(displayBook).css( { 'bottom': stackLocationTop,
								'left': -stackLocationLeft });
		}
		else {
			$(displayBook).css( { 'bottom': -stackLocationTop,
								'left': -stackLocationLeft });			
		}
		$(idLocation).append($(displayBook));		
		$(displayBook).animate( {
				'bottom': bottomPos,
				'left': leftPos }, 700);		
		addDraggable(displayBook);
};
var sampleBook1 = new Book('Float Your Hatred', 'C.S. Smith, III', 'recent-read');
var sampleBook2 = new Book('Speaking in Code', 'Chris Raine', 'recent-read');
var sampleBook3 = new Book('Eloquent JS', 'Swedish Guy', 'current-read');
var sampleBook4 = new Book('The Circle', 'Dave Eggers', 'to-read');
var sampleBook5 = new Book('The Goldfinch', 'Donna Tartt', 'to-read');

// --------------------- Document on Ready -----------------------------------
// ---------------------------------------------------------------------------
$(document).on('ready', function() {
	setPageUp(sampleBook1);	
	setPageUp(sampleBook2);	
	setPageUp(sampleBook3);	
	setPageUp(sampleBook4);	
	setPageUp(sampleBook5);	
	// Makes Stack areas droppable
	addDroppable('#bedside-stack');
	addDroppable('#current-stack');
	addDroppable('#recent-stack');
	addDroppable('.trash-can');

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

// ----------------------- Create a new Book, add to DOM and Stacks --------------
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
			displayBook.attr('data-placement', 'left');
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
		// and animate appearance on the page
		var stackLocationTop = idLocation.offset().top;
		var stackLocationLeft = idLocation.offset().left;
		var positions = stackBeingUsed.setBookPosition(newBook);
		var bottomPos = positions[0] + 'px';
		var leftPos = positions[1] +'px';

		if (idLocation[0].id === 'bedside-stack') {
			$(displayBook).css( { 'bottom': stackLocationTop,
								'left': -stackLocationLeft });
		}
		else {
			$(displayBook).css( { 'bottom': -stackLocationTop,
								'left': -stackLocationLeft });			
		}
		$(idLocation).append($(displayBook));		
		$(displayBook).animate( {
				'bottom': bottomPos,
				'left': leftPos }, 700);
		
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
	
	$(document).on('drop', '.stack', function(e, ui) {
		// Set position of dropped book
		var droppedBookElem = $(ui.draggable);

		var dropID = '#' + e.currentTarget.id;
		var setLeft = e.pageX -  ($(dropID).offset().left);
		setLeft -= 20

		$(droppedBookElem).css({'bottom': 0,
							'top': '',
							'left': setLeft });
		$(this).append(droppedBookElem);
		$(droppedBookElem).effect('bounce', 'fast', 'easeOutBounce');
		// Remove from old Stack and add dropped book to new Stack bookList
		// Also updates dropped book to new status and orientation
		var droppedBookID = +droppedBookElem.attr('data-id');
		var droppedBook = findBookByDataID(droppedBookID);
		var oldStack = droppedBook.getStackFromStatus();
		oldStack.deleteBook(oldStack.findIndexOfBookInStack(droppedBookID));

		var newStackID = $(this).attr('id');
		var newStack = getStackFromID(newStackID);
		droppedBook.orientation = newStack.bookOrientation;
		droppedBook.status = droppedBook.getStatusFromStack(newStack);
		newStack.addBook(droppedBook);

	});

	// Flips book to current Stack's orientation
	$(document).on('dropover', '.stack', function(e,ui) {
		var droppedBookElem = $(ui.draggable);
		var dropID = e.currentTarget.id;
		var leftPosition = e.pageX - ($('#' + dropID).offset().left);
		leftPosition -= 20;
		var topPosition = e.pageY - ($('#' + dropID).offset().top);
		if (droppedBookElem.hasClass('horizontal-book')) {
			if(dropID === 'current-stack' || dropID === 'recent-stack') {
				var innerText = droppedBookElem.text();
				droppedBookElem.removeClass('horizontal-book');
				droppedBookElem.addClass('vertical-book');
				droppedBookElem.attr('data-placement', 'top');
				droppedBookElem.text('');
				droppedBookElem.append('<p class="vertical-text">' + innerText + '</p>');
				droppedBookElem.css( { 
					'left': leftPosition,
					'top': topPosition } );
			}
		}
// Note flip from vertical to horizontal doesn't quite work
/*		if (droppedBookElem.hasClass('vertical-book') && dropID === 'bedside-stack') {
			var innerText = droppedBookElem.find('p').text();
			droppedBookElem.find('p').remove();
			droppedBookElem.removeClass('vertical-book');
			droppedBookElem.addClass('horizontal-book');
			droppedBookElem.text(innerText);
			droppedBookElem.attr('data-placement', 'left');
			console.log(topPosition);
			// topPosition -= 150;
			console.log(topPosition)
			droppedBookElem.css( { 
					'left': leftPosition,
					'top': topPosition  } );
		}*/
	})

	$(document).on('drop', '.trash-can', function(e,ui) {
		var trashedBookElem = $(ui.draggable);
		
		var thisDataID = +$(trashedBookElem).attr('data-id');
		var trashedBook  = findBookByDataID(thisDataID);
		var trashedBookStatus = trashedBook.status;
		var trashedBookStack = trashedBook.getStackFromStatus();
		var indexofBookInStack = trashedBookStack.findIndexOfBookInStack(thisDataID);
		
		// Remove book from it's current Stack
		trashedBookStack.deleteBook(indexofBookInStack);

		// Remove book from allBooks
		var indexofBookInallBooks = findIndexofBookinallBooks(thisDataID);
		allBooks.splice(indexofBookInallBooks,1);
		

		// Remove element from the DOM
		trashedBookElem.effect('explode', 'slow', function() {
		trashedBookElem.remove(); 
		});
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

			// Add name to comments header
			var commentsHeaderText = $('.comments-header').text();
			$('.comments-header').text(userName + ', ' + commentsHeaderText);
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
		$('.comments-header').text('Share your thoughts:');
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
	$(document).on('click', '.popup-close', closePopUp );


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

	// Cancel button closes comment pop-up
	$(document).on('click', '.cancel-comment', closePopUp); 

	// Save comment and add to page and close comment pop-up
	$(document).on('click', '.save-comment', function(event) {
		event.preventDefault();
		var newComment = $('.new-comment').val();
		var newCommentItem = $('<li class="media">');
		var newCommentIconHolder = $('<p class="pull-left"></p>');
		var newCommentIcon = $('<span class="glyphicon glyphicon-book"></span>');
		var newCommentBody = $('<div class="media-body">');
		var newCommentTitle = $('<h4 class="media-heading">' + userNameList[0] + ' says:</h4>');
		var newCommentText = $('<p>' + newComment + '</p>');
		var respondButton = $('<button class="button respond-button">Respond</button>');


		newCommentItem.append(newCommentIconHolder);
		newCommentIconHolder.append(newCommentIcon);
		newCommentItem.append(newCommentBody);
		newCommentBody.append(newCommentTitle);
		newCommentBody.append(newCommentText);
		newCommentBody.append(respondButton);

		$('.media-list').append(newCommentItem);

		closePopUp();
	});

	$(document).on('click', '.respond-button', function(event) {
		event.preventDefault();
		$('body').append('<div class="popup-back">');
		$('body').append('<div class="popup-cont">');
		var displayAddComments = createCommentsPopUp();
		$('.popup-cont').append(displayAddComments);
		var respondCommentButton = $('.comments-container').find('.save-comment');
		respondCommentButton.removeClass('save-comment');
		respondCommentButton.addClass('respond-comment');
		respondCommentButton.text('Respond');
		$('.popup-cont').append('<span class="popup-close">X');
		$('.popup-back').animate( {
			opacity: 1, }, 800);
		$('.popup-cont').animate( {
			opacity: 1, }, 1200);			

		$(this).remove();		
	})

	$(document).on('click', '.respond-comment', function(event) {
		var newComment = $('.new-comment').val();
		var newResponseItem = $('<li class="media response">')
		var newCommentIconHolder = $('<p class="pull-left"></p>');
		var newCommentIcon = $('<span class="glyphicon glyphicon-arrow-right"></span>');
		var newCommentBody = $('<div class="media-body">');
		var newCommentText = $('<p>' + newComment + '</p>');
		var respondButton = $('<button class="button respond-button">Respond</button>');

		newResponseItem.append(newCommentIconHolder);
		newCommentIconHolder.append(newCommentIcon);
		newResponseItem.append(newCommentBody);
		newCommentBody.append(newCommentText);
		newCommentBody.append(respondButton);

		$('.media-list').find('li:last').append(newResponseItem);
		closePopUp();
	});

	// Add tooltip pop-up on hover to all books
	$('[rel="tooltip"]').tooltip({ 
		container: 'body',});


});
var allBooks = [];
var currentBooks = [];
var toReadBooks = [];
var readBooks = [];

var Book = function (title, author, status) {
	this.title = title;
	this.author = author;
	this.status = status;
}

var BedsideStack = function() {

}

var CurrentReading = function() {

}

var RecentReadShelf = function() {

}



$(document).on('ready', function() {

	$('.add-button').on('click', function() {
		// var self = this;
		$(this).addClass('is-hidden');
		$('.add-book-form').removeClass('display-none');
		$('.add-book-form').animate( {
			left: 0,
			opacity: 1
		}, 1500 );
	});

	$('.shelf-it').on('click', function() {
		var newTitle = $('#new-book-title').val();
		var newAuthor = $('#new-author').val();
		var newBookStatus = $('input[name=book-status]:checked', '.add-book-form').val();

	})

  
});
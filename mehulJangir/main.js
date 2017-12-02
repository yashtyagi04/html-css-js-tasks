
//first define the array which will store all the itemm
var items = new Array();
 
$("ul").on("click", "li", function() {
    $(this).toggleClass("selected");
});
 
$("ul").on("click", "span", function(event) {
    $(this).parent().fadeOut(500, function() {
                removeValue($(this).find('.todovalue').text());
        $(this).remove();
    })
    event.stopPropagation();
});
 
$("input[type = 'text']").keypress(function(event) {
    if (event.which === 13) {
        var todoText = $(this).val();
        $(this).val("");
        $("ul").append("<li><span class='todofront'><i class='fa fa-trash-o' aria-hidden='true'></i> </span><span class='todovalue'>" + todoText + "</span></li>");
        store(todoText);
    }
});
 
$(".fa-plus").click(function() {
    $("input[type = 'text']").fadeToggle();
});
 
function store(todoText) {
	alert(items);
                //add new item in the array (push)
    items.push(todoText);
    //now push to localstorage - the whole array
    localStorage.setItem("Todos", JSON.stringify(items));
}
 
function getValues() {
    var localStorageItems = localStorage.getItem("Todos")
    if (localStorageItems != null){
    	try{
    	    //get items from localstorage
            items = JSON.parse(localStorageItems);
        } catch (err) {}
    }
 	//now loop through array elements
    if (items != null && items.length > 0) {
        for (var i = 0, len = items.length; i < len; i++) {
            $("ul").append("<li><span class='todofront'><i class='fa fa-trash-o' aria-hidden='true'></i> </span><span class='todovalue'>" + items[i] + "</span></li>");
        }
    }
}
//search item to be removed
function removeValue(search_term) {
    if (items != null && items.length > 0) {
        for (var i = items.length - 1; i >= 0; i--) {
            if (items[i] === search_term) {
                items.splice(i, 1);
                localStorage.setItem("Todos", JSON.stringify(items));
                break;
            }
        }
    }
}
 
getValues();
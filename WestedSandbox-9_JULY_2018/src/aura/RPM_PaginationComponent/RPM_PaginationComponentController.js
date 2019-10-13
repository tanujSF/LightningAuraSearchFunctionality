({
	previousPage: function(component, event, helper) {
      // this function call on click on the previous page button  
      var myEvent = $A.get("e.c:RPM_PaginationPageChange");
        myEvent.setParams({ "direction": "previous"});
        myEvent.fire();
 
   }, 
 
   nextPage: function(component, event, helper) {
      // this function call on click on the next page button   
      var myEvent = $A.get("e.c:RPM_PaginationPageChange");
        myEvent.setParams({ "direction": "next"});
        myEvent.fire();
   },
})
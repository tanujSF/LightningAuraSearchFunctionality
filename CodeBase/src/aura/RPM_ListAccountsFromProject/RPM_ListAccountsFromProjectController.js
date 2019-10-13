({
	NavigateToDashboard : function(component,event,helper) {
      var evt = $A.get("e.c:RPM_NavigateToDashboard");
      evt.setParams({ "result": "hello"});
      evt.fire();
   },
    
    
    
})
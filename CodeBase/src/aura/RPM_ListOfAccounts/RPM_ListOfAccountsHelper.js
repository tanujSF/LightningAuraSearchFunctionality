({
    resetCheckBoxValue : function(component, event) {
        console.log("Setting the Value");
        component.find("box3").set("v.value", false);
        console.log(component.find("box3").get("v.value"));
        return false;
    },
    
    getNewAccountsFromProjectAfterDelete : function(component, event) {
        console.log("getNewAccountsFromProjectAfterDelete"); 
        var evt = $A.get("e.c:RPM_GetNewAccountsFromProjectAfterDelete");
        evt.setParams({ "result": "hello"});
        evt.fire();
    },
    
    
    deleteSelectedHelper: function(component, event, deleteRecordsIds) {
        //call apex class method
        var action = component.get('c.deleteRecords');
        // pass the all selected record's Id's to apex method 
        action.setParams({
            "recordId":component.get("v.recordId"), 
            "lstRecordId": deleteRecordsIds
        });
        action.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log(state);
                if (response.getReturnValue() != '') {
                    // if getting any error while delete the records , then display a alert msg/
                    var showToast = $A.get('e.force:showToast');
                    showToast.setParams({
                        'title' : '',
                        'message' : 'The following error has occurred. ->'+response.getReturnValue(),
                        'type' : 'Error'
                    });
                    showToast.fire();
                } else {
                    console.log('check it--> delete successful');
                    var showToast = $A.get('e.force:showToast');
                    showToast.setParams({
                        title: 'Success',
                        message: 'Record Successfully Removed.',   
                        type: 'success'
                    });            
                    showToast.fire();
                    // call the onLoad function for refresh the List view    
                this.getNewAccountsFromProjectAfterDelete(component, event);
                }
                
            }
        });
        $A.enqueueAction(action);
    },
    
    
    addSelectedHelper: function(component, event, deleteRecordsIds) {
        //call apex class method
        var action = component.get('c.addRecords');
        // pass the all selected record's Id's to apex method 
        action.setParams({
            "recordId":component.get("v.recordId"),
            "lstRecordId": deleteRecordsIds
        });
        action.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                
                
                
                console.log(state);
                if (response.getReturnValue() != '') {
                    // if getting any error while delete the records , then display a alert msg/
                    var showToast = $A.get('e.force:showToast');
                    showToast.setParams({
                        'title' : '',
                        'message' : 'The following error has occurred. ->'+response.getReturnValue(),
                        'type' : 'Error'
                    });
                    showToast.fire();
                } else {
                    console.log('check it--> addition successful');
                    var page = 1;
                var recordToDisply = component.get("v.pageSize");
                var showToast = $A.get('e.force:showToast');
                    showToast.setParams({
                        'title': 'Success Message',
                        'message': 'Record Successfully Added.',  
                        type: 'success'
                        
                    });            
                showToast.fire();
                // call the onLoad function for refresh the List view    
                this.getNewAccountsFromProjectAfterDelete(component, event);
                }
                
            }
        });
        $A.enqueueAction(action);
    },
    
})
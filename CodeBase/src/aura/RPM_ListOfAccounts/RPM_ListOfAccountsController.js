({
    doInit: function(component, event, helper) {
        
      //  helper.resetCheckBoxValue(component, helper);
    },
    
    createRecord : function (component, event, helper) {
       var evt = $A.get("e.c:RPM_NavigateToCreateSchool");
        evt.fire();
    },
    
    navigateToAddAccounts : function(component, event, helper) {
        var compEvent = component.getEvent("navigateToAddAccount");
        compEvent.fire();
    },
    
    // For count the selected checkboxes. 
    checkboxSelect: function(component, event, helper) {
        // get the selected checkbox value  
        var selectedRec = event.getSource().get("v.value");
        // get the selectedCount attrbute value(default is 0) for add/less numbers. 
        var getSelectedNumber = component.get("v.selectedCount");
        // check, if selected checkbox value is true then increment getSelectedNumber with 1 
        // else Decrement the getSelectedNumber with 1     
        if (selectedRec == true) {
            getSelectedNumber++;
        } else {
            getSelectedNumber--;
        }
        // set the actual value on selectedCount attribute to show on header part. 
        component.set("v.selectedCount", getSelectedNumber);
        
    },
    
    // For select all Checkboxes 
    selectAll: function(component, event, helper) {
        //get the header checkbox value  
        var selectedHeaderCheck = event.getSource().get("v.value");
        // get all checkbox on table with "boxPack" aura id (all iterate value have same Id)
        // return the List of all checkboxs element 
        var getAllId = component.find("boxPack");
        // check if select all (header checkbox) is true then true all checkboxes on table in a for loop  
        // and set the all selected checkbox length in selectedCount attribute.
        // if value is false then make all checkboxes false in else part with play for loop 
        // and select count as 0 
        console.log("getAllId : "+getAllId);
        console.log("getAllId.length "+getAllId.length);
       if (selectedHeaderCheck == true) {
            
            if(getAllId.length == undefined){
                component.find("boxPack").set("v.value",true);                
            }else{
                for (var i = 0; i < getAllId.length; i++) {
                    component.find("boxPack")[i].set("v.value", true);
                    component.set("v.selectedCount", getAllId.length);
                    console.log("getAllId.length "+getAllId.length);
                }
            }
            
        } else {
            
            if(getAllId.length == undefined){
                component.find("boxPack").set("v.value",false);                
            }else{
                for (var i = 0; i < getAllId.length; i++) {
                    component.find("boxPack")[i].set("v.value", false);
                    component.set("v.selectedCount", 0);
                }
            }
        }

        
    },
    
    //For Delete selected records 
    deleteSelected: function(component, event, helper) {
        
     component.find("box3").set("v.value", false);
        
        // create var for store record id's for selected checkboxes  
        var delId = [];
        // get all checkboxes 
        var getAllId = component.find("boxPack");
        console.log("getAllId : "+getAllId);
        // If the local ID is unique[in single record case], find() returns the component. not array
        if(! Array.isArray(getAllId)){
            if (getAllId.get("v.value") == true) {
                console.log("getAllIdValues : "+getAllId.get("v.text")); 
                delId.push(getAllId.get("v.text"));
            }
        }else{
            // play a for loop and check every checkbox values 
            // if value is checked(true) then add those Id (store in Text attribute on checkbox) in delId var.
            for (var i = 0; i < getAllId.length; i++) {
                if (getAllId[i].get("v.value") == true) {
                    console.log("getAllIdValues : "+getAllId[i].get("v.text"));
                    delId.push(getAllId[i].get("v.text"));
                }
            }
        } 
        if(delId.length === 0){
            var showToast = $A.get('e.force:showToast');
            showToast.setParams({
                'title': '',
                'message': 'Please Select any Record to Delete.',                            
            });            
            showToast.fire();
            return false;
        }
        
        helper.deleteSelectedHelper(component, event, delId);
        
    }, 
    
    //For Adding selected records 
    addSelected: function(component, event, helper) {
        
         component.find("box3").set("v.value", false);
        // create var for store record id's for selected checkboxes  
        var delId = [];
        // get all checkboxes 
        var getAllId = component.find("boxPack");
        // If the local ID is unique[in single record case], find() returns the component. not array
        if(! Array.isArray(getAllId)){
            if (getAllId.get("v.value") == true) {
                delId.push(getAllId.get("v.text"));
            }
        }else{
            // play a for loop and check every checkbox values 
            // if value is checked(true) then add those Id (store in Text attribute on checkbox) in delId var.
            for (var i = 0; i < getAllId.length; i++) {
                if (getAllId[i].get("v.value") == true) {
                    delId.push(getAllId[i].get("v.text"));
                }
            }
        } 
        
        if(delId.length === 0){
            var showToast = $A.get('e.force:showToast');
            showToast.setParams({
                'title': '',
                'message': 'Please Select any Record to Add.',                            
            });            
            showToast.fire();
            return false;
        }
        
        // call the helper function and pass all selected record id's.    
        helper.addSelectedHelper(component, event, delId);
        
    },
    
    
    NavigateToDashboard : function(component,event,helper) {
        var evt = $A.get("e.c:RPM_NavigateToDashboard");
        evt.setParams({ "result": "hello"});
        evt.fire();
    },
    
    
})
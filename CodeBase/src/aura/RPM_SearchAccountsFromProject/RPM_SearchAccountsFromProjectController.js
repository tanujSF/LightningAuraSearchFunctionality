({
    onLoadGetAccountsFromProject : function(component, event, helper) {
        console.log("onLoad Call ");
        var callFromAddPage =  component.get("v.isCallFromAddPage");
        console.log("callFromAddPage "+callFromAddPage);
            // call the helper function for fetch contact from apex class 
            var page = component.get("v.page") || 1;
            var recordToDisply = component.get("v.pageSize");
            helper.getAccountsFromProject(component, page, recordToDisply);
        
    },
    
    
    loadAccountsList: function(component, event, helper) {
        component.set("v.selectAllCheckBoxValue",false);
        // call the helper function for fetch contact from apex class 
        var page = 1;
        var recordToDisply = component.get("v.pageSize");
        helper.getAccountsFromProject(component, page, recordToDisply);
    },
    
    pageChange: function(component, event, helper) {
         component.set("v.selectAllCheckBoxValue",false);
        var page = component.get("v.page") || 1;
        var direction = event.getParam("direction");
        page = direction === "previous" ? (page - 1) : (page + 1);
        var recordToDisply = component.get("v.pageSize");
        helper.getAccountsFromProject(component, page,recordToDisply);
    },
    
    getNewAccountsFromProjectAfterDelete: function(component, event, helper) {
        
         component.set("v.selectAllCheckBoxValue",false);
        // call the helper function for fetch contact from apex class 
        var page = 1;
        var recordToDisply = component.get("v.pageSize");
        helper.getAccountsFromProject(component, page, recordToDisply);
    },
    
    showSpinner : function (component, event, helper) {
        console.log("start Loading")
        component.set("v.startLoading",true);  
    },
    hideSpinner : function (component, event, helper) {
        component.set("v.startLoading",false);  
    },
    
    
    
    
})
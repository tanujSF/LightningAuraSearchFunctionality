({
    init: function(cmp, event, helper) {
        console.log('FieldSetFormController.init');
        
        
        
        var action = cmp.get('c.getFields');
        action.setParams({
            fsName: cmp.get('v.fsName'),
            typeName: cmp.get('v.typeName')
        });
        action.setCallback(this, 
            function(response) { 
                console.log('FieldSetFormController getFields callback');
                var fields = response.getReturnValue();
                console.log("Return Value: "+fields);
                cmp.set('v.fields', fields);
                
                helper.createForm(cmp);
            }
        );
        $A.enqueueAction(action);
    },

   clearValue : function(cmp, event, helper) {
        cmp.set("v.record.Name",'');
        cmp.set("v.record.BillingPostalCode",'')
        var evt = $A.get("e.c:RPM_GetNewAccountsFromProjectAfterDelete");
        evt.setParams({ "result": "hello"});
        evt.fire();
    }
})
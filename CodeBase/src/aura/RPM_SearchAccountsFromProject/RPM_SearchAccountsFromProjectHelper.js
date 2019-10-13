({
    getAccountsFromProject: function(component, page, recordToDisply) {
        
        // var page = component.get("v.page") || 1;
        // get the select option (drop-down) values.   
        //  var recordToDisply = component.get("v.pageSize");
        var sobject=component.get("v.typeName");
        var fieldset=component.get("v.fsName");  
        console.log("sobject Name: "+sobject);
        console.log("fieldset Name: "+fieldset);
        
        console.log("All Records Value : "+component.get("v.record"));
        console.log("Name Records Value : "+component.get("v.record.Name"));
        console.log("Pin Code Records Value : "+component.get("v.record.BillingPostalCode"));
        var opptyname = component.get("v.record.Name")
        var flagForoppty=0; 
        var iChars = "@!~`*()#$%&^-_+={}[]|\;:',<>/?,;"; // type your excepting keys here 
        var flag = true;
        
        
        
        
        
        if(typeof(opptyname) != "undefined")    {
            if (opptyname!="")
            {
                var strArr = new Array();
                
                for (var i = 0; i < opptyname.length; i++) {
                    if (iChars.indexOf(opptyname.charAt(i)) != -1) {          
                        flag = false;
                    }
                }
                
                if(!flag){
                  var showToast = $A.get('e.force:showToast');
                    showToast.setParams({
                        'title': '',
                        'message': 'Special Characters Not Allowed',  
                        'type' : 'Warning'
                    });            
                    showToast.fire(); 
                    return
                }
                
                strArr = opptyname.split("");
                console.log("strArr Length: "+strArr.length);
                if(strArr[0]==" ") // this is the the key part. you can do whatever you want here!
                {
                    
                    var showToast = $A.get('e.force:showToast');
                    showToast.setParams({
                        'title': '',
                        'message': 'Please Dont leave any blank spaces.', 
                        'type' : 'Warning'
                    });            
                    showToast.fire();
                    flagForoppty=1;
                    return false; 
                }
            }      
        }
        
     var billCode = component.get("v.record.BillingPostalCode");
        
                
        if(typeof(billCode) != "undefined")    {
            if (billCode!="")
            {
                var strArr = new Array();
                
                for (var i = 0; i < billCode.length; i++) {
                    if (iChars.indexOf(billCode.charAt(i)) != -1) {          
                        flag = false;
                    }
                }
                
                if(!flag){
                  var showToast = $A.get('e.force:showToast');
                    showToast.setParams({
                        'title': '',
                        'message': 'Special Characters Not Allowed',  
                        'type' : 'Warning'
                    });            
                    showToast.fire(); 
                    return
                }
                
                strArr = billCode.split("");
                console.log("strArr Length: "+strArr.length);
                if(strArr[0]==" ") // this is the the key part. you can do whatever you want here!
                {
                    
                    var showToast = $A.get('e.force:showToast');
                    showToast.setParams({
                        'title': '',
                        'message': 'Please Dont leave any blank spaces.', 
                        'type' : 'Warning'
                    });            
                    showToast.fire();
                    flagForoppty=1;
                    return false; 
                }else{
                    if(strArr[2]==" "){
                        var showToast = $A.get('e.force:showToast');
                        showToast.setParams({
                            'title': '',
                            'message': 'Please Dont leave any blank space after kewword.',
							'type' : 'Warning'                            
                        });            
                        showToast.fire();
                        return false; 
                    }
                    
                }
            }      
        }
        
        if(!/^[0-9_ ]*$/.test(billCode)){
            var showToast = $A.get('e.force:showToast');
                    showToast.setParams({
                        'title': '',
                        'message': 'Please only enter numeric characters only for Zip Code! (Allowed input:0-9)', 
                        'type' : 'Warning'
                    });            
                    showToast.fire();
   
    return false;
  }
        
        
        
        
        
        // create a server side action. 
        var action = component.get("c.searchAccount");
        // set the parameters to method 
        action.setParams({
            "recordId":component.get("v.recordId"),
            "mapOfFieldSet":JSON.stringify(component.get("v.record")),
            "sObjectAPIName":sobject,
            "fieldsetAPIName":fieldset,
            "pageNumber": page,
            "recordToDisply": recordToDisply,
            "isCallFromAddPage":component.get("v.isCallFromAddPage")
        });
        // set a call back   
        action.setCallback(this, function(a) {
            // store the response return value (wrapper class insatance)  
            var state = a.getState();
            if (state === "SUCCESS") {
                
                var result = a.getReturnValue();
                console.log('result ---->' + JSON.stringify(result));
                // set the component attributes value with wrapper class properties.   
                
                console.log("result.accounts : "+result.accounts);
                component.set("v.Accounts", result.accounts);
                component.set("v.page", result.page);
                component.set("v.total", result.total);
                component.set("v.pages", Math.ceil(result.total / recordToDisply));
                
                console.log("Accounts: "+JSON.stringify(component.get("v.Accounts")));
                console.log("Page: "+component.get("v.page"));  
                console.log("total: "+component.get("v.total"));  
                console.log("pages: "+component.get("v.pages"));  
                
                if(result.accounts != null && result.accounts.length > 0){
                    component.set("v.ListNotEmpty", true); 
                    component.set("v.ListEmpty", false); 
                }else{
                    component.set("v.ListEmpty", true); 
                    component.set("v.ListNotEmpty", false);
                }
                
            }else{
                console.log("Failed with state: " + state);
                var errors = action.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("...Error message: .. " +errors[0].message);
                        var showToast = $A.get('e.force:showToast');
                        showToast.setParams({
                            'title' : '',
                            'message' : errors[0].message,
                            'type' : 'Error'
                        });
                        showToast.fire();
                    }
                } else {
                    console.log("Unknown error");
                    var showToast = $A.get('e.force:showToast');
                    showToast.setParams({
                        'title' : '',
                        'message' : 'Unable to Process. Please contact your Administrator',
                        'type' : 'Error'
                    });
                    showToast.fire();
                }
            }
            
        });
        // enqueue the action 
        $A.enqueueAction(action);
    },
})
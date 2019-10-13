({
    /*
     *  Map the Schema.FieldSetMember to the desired component config, including specific attribute values
     *  Source: https://www.salesforce.com/us/developer/docs/apexcode/index_Left.htm#CSHID=apex_class_Schema_FieldSetMember.htm|StartTopic=Content%2Fapex_class_Schema_FieldSetMember.htm|SkinName=webhelp
     *
     *  Change the componentDef and attributes as needed for other components
     */
    configMap: {
        'anytype': { componentDef: 'ui:inputText', attributes: {} },
        'base64': { componentDef: 'ui:inputText', attributes: {} },
        'boolean': {componentDef: 'ui:inputCheckbox', attributes: {} },
        'combobox': { componentDef: 'ui:inputText', attributes: {} },
        'currency': { componentDef: 'ui:inputText', attributes: {} },
        'datacategorygroupreference': { componentDef: 'ui:inputText', attributes: {} },
        'date': {
            componentDef: 'ui:inputDate',
                attributes: {
                    displayDatePicker: true,
                    format: 'MM/dd/yyyy'
                }
            },
        'datetime': { componentDef: 'ui:inputDateTime', attributes: {} },
        'double': { componentDef: 'ui:inputNumber', attributes: {} },
        'email': { componentDef: 'ui:inputEmail', attributes: {} },
        'encryptedstring': { componentDef: 'ui:inputText', attributes: {} },
        'id': { componentDef: 'ui:inputText', attributes: {} },
        'integer': { componentDef: 'ui:inputNumber', attributes: {} },
        'multipicklist': { componentDef: 'ui:inputText', attributes: {} },
        'percent': { componentDef: 'ui:inputNumber', attributes: {} },
        'phone': { componentDef: 'ui:inputPhone', attributes: {} },
        'picklist': { componentDef: 'ui:inputSelect', attributes: {} },
        'reference': { componentDef: 'ui:inputText', attributes: {} },
        'string': { componentDef: 'ui:inputText', attributes: {} },
        'textarea': { componentDef: 'ui:inputText', attributes: {} },
        'time': { componentDef: 'ui:inputDateTime', attributes: {} },
        'url': { componentDef: 'ui:inputText', attributes: {} }
    },

    createForm: function(cmp) {
        console.log('FieldSetFormHelper.createForm');
        var fields = cmp.get('v.fields');
        var obj = cmp.get('v.record');
        console.log("Fields  : "+JSON.stringify(fields)+' and Records: '+JSON.stringify(obj));
        var inputDesc = [];
        var fieldPaths = [];
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
             var type = field.type.toLowerCase();

            var configTemplate = this.configMap[type];
            console.log("configTemplate: "+JSON.stringify(configTemplate));
         if (!configTemplate) {
                console.log(`type ${ type } not supported`);
                continue;
            }

            // Copy the config so that subsequent types don't overwrite a shared config for each type.
            var config = JSON.parse(JSON.stringify(configTemplate));
 			console.log("config: "+JSON.stringify(config));
           // config.attributes.label = field.label;
            
            if(field.fieldPath == 'Name'){
             config.attributes.placeholder = field.label;   
            }else{
              config.attributes.placeholder = field.label;  
            }
         
            
            config.attributes.required = field.required;
            config.attributes.value = cmp.getReference(' v.record.' + field.fieldPath);
            config.attributes.fieldPath = field.fieldPath;
            if(field.type == "PICKLIST"){
                  var opts = [
            { "class": "optionClass", label: "Option1", value: "opt1", selected: "true" },
            { "class": "optionClass", label: "Option2", value: "opt2" },
            { "class": "optionClass", label: "Option3", value: "opt3" }

        ];
                
                
              config.attributes.options = opts; 
              
            }
            

            if (!config.attributes['class']) {
                config.attributes['class'] = 'slds-m-vertical_x-small';
            }

            inputDesc.push([
                config.componentDef,
                config.attributes
            ]);
                fieldPaths.push(field.fieldPath);
            } 
        	console.log("config After: "+JSON.stringify(config));
        console.log("inputDesc: "+JSON.stringify(inputDesc));

        $A.createComponents(inputDesc, function(cmps) {
            console.log('createComponents');
           
            cmp.set('v.form', cmps);
           
        });
    }
})
/*********
@Lightning Component     : RPM_GetFieldSetComp.cmp
@Description             : It is used to Fetch (Site/School) Fields from FieldSet to Display on Search/List  Site/School Page.
@Created Date            : 20/11/17
@Author                  : Lirik Team

*********/
public class RPM_GetFieldSetCompController {
    
   

    @AuraEnabled
    public static List<FieldSetMember> getFields(String typeName, String fsName) {
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(typeName);
        Schema.DescribeSObjectResult describe = targetType.getDescribe();
        Map<String, Schema.FieldSet> fsMap = describe.fieldSets.getMap();
        Schema.FieldSet fs = fsMap.get(fsName);
        List<Schema.FieldSetMember> fieldSet = fs.getFields();
        List<FieldSetMember> fset = new List<FieldSetMember>();
        for (Schema.FieldSetMember f: fieldSet) {
            fset.add(new FieldSetMember(f));
        }
        system.debug('Field Set : '+fset);
        return fset;
    }

    public class FieldSetMember {

        public FieldSetMember(Schema.FieldSetMember f) {
            this.DBRequired = f.DBRequired;
            this.fieldPath = f.fieldPath;
            this.label = f.label;
            this.required = f.required;
            this.type = '' + f.getType();
        }

        public FieldSetMember(Boolean DBRequired) {
            this.DBRequired = DBRequired;
        }

        @AuraEnabled
        public Boolean DBRequired { get;set; }

        @AuraEnabled
        public String fieldPath { get;set; }

        @AuraEnabled
        public String label { get;set; }

        @AuraEnabled
        public Boolean required { get;set; }

        @AuraEnabled
        public String type { get; set; }
    }
    }
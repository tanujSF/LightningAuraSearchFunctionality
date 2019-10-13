/*********
@Lightning Component     : RPM_ListAccountsFromProject.cmp & RPM_SearchAccountsFromProject.cmp
@Description             : It is used for Search  Accounts/Schools which are Active
& also to show Accounts which are aded to Project-AccountJunction Object. & to Add/Delete the Accounts/Schools from the Project-Account Junction Object
@Created Date            : 4/12/17
@Author                  : Tanuj Tyagi

*********/ 
 
public with sharing class RPM_ListOfAccountsController {
    
    
    /************************************************************
Name: searchAccount
Type: Apex Method  
Purpose: Method Called for Search  Accounts/Schools which are Active
& also to show Accounts which are aded to Project-AccountJunction Object
lightning component :RPM_SearchAccountsFromProject.cmp

***********************************************************/
    
    @AuraEnabled
    public static AccountPagerWrapper searchAccount(String mapOfFieldSet,String sObjectAPIName,String fieldsetAPIName,Decimal pageNumber ,Integer recordToDisply, String recordId ,Boolean isCallFromAddPage) {
        
        system.debug('Record ID : '+recordId);
        system.debug('FieldMap: '+mapOfFieldSet);
        // system.debug('FieldTwo: '+FieldTwo);
        system.debug('sObjectAPIName :'+sObjectAPIName);
        system.debug('fieldsetAPIName :'+fieldsetAPIName);
        system.debug('isCallFromAddPage : '+isCallFromAddPage);
        
        String query;
        String whereClause;
        String whereClauseIfFilterEmpty;
        String orderByClause;
        String limitClause;
        String offsetClause;
        Integer pageSize = recordToDisply;
        system.debug('pageNumber: '+pageNumber);
        system.debug('pageSize: '+pageSize);
        Integer offset = ((Integer)pageNumber - 1) * pageSize;
        system.debug('offset: '+offset);
        Boolean isFieldSetNotEmpty =false;
        String queryToCalculateCount;
        
        
        // create a instance of wrapper class.
        AccountPagerWrapper obj =  new AccountPagerWrapper();
        try{
            
            Map<String, Object> MapOfFieldSetNew = (Map<String, Object>) JSON.deserializeUntyped(mapOfFieldSet);
            system.debug('MapOfFieldSetNew: '+MapOfFieldSetNew);
            
            // set the pageSize,Page(Number), total records and accounts List(using OFFSET)   
            obj.pageSize = pageSize;
            obj.page = (Integer) pageNumber;
            queryToCalculateCount = 'SELECT COUNT(Id) intVal FROM Account';
            query = 'SELECT ';
            query += 'Name, ';
            query += 'RPM_District_Agency_NCES_ID__c,owner.Name,createdby.Name, ';
            
            query += 'ID FROM '+sObjectAPIName;
            //whereClause;
            if(isCallFromAddPage){
                whereClause = ' WHERE id NOT IN (SELECT Account__c From RPM_Project_Account_Junction__c where RPM_Project__c =: recordId)';
            }else{
                whereClause = ' WHERE id IN (SELECT Account__c From RPM_Project_Account_Junction__c where RPM_Project__c =: recordId AND RPM_School_Site_Status__c = \'Active\')';
            }
            whereClause += ' AND  Id != null ';
            whereClauseIfFilterEmpty = whereClause;
            
            Integer i =0; 
            
            for(String key:MapOfFieldSetNew.keySet()){
                System.debug('Key :'+key);            	
                // String dataType = getFieldType(key,sObjectAPIName);
                // system.debug('dataType :'+dataType);
                System.debug(MapOfFieldSetNew.get(key));
                if((String)MapOfFieldSetNew.get(key) != null && String.isNotEmpty((String)MapOfFieldSetNew.get(key))){
                    isFieldSetNotEmpty = true;
                    String Filter = (String)MapOfFieldSetNew.get(key);
                    Filter = '%' + Filter.trim() + '%';
                    system.debug('Filter : '+Filter.length());
                    if(i<=0){
                        whereClause += ' AND ('+key+' LIKE: Filter';  
                    }
                    else{
                        whereClause += ' OR '+key+' LIKE: Filter';
                    }
                    i++;
                }
            }
            
            
            if(!isFieldSetNotEmpty){
                
                whereClauseIfFilterEmpty += ' AND RPM_Active_Site_School_Facility_Org__c = true AND RPM_Not_Eligible__c = false AND RPM_Declined__c = false';
                whereClause = whereClauseIfFilterEmpty;
                queryToCalculateCount += ' '+whereClauseIfFilterEmpty;
                
            }else{
                whereClause += ')'; 
                whereClause += ' AND RPM_Active_Site_School_Facility_Org__c = true AND RPM_Not_Eligible__c = false AND RPM_Declined__c = false';
                queryToCalculateCount += ' '+whereClause;
            }
            
            System.debug('queryToCalculateCount: '+queryToCalculateCount); 
            
            Integer intCount = 0;
            
            for(AggregateResult result :Database.query(queryToCalculateCount))
            {
                intCount+=(Integer)result.get('intVal');
            } 
            
            System.debug('No of records are: '+intCount);
            obj.total = intCount;
            
            orderByClause =' Order BY Name';
            whereClause += orderByClause;
            limitClause=' LIMIT :recordToDisply ';
            whereClause += limitClause;
            offsetClause=' OFFSET :offset ';
            whereClause +=offsetClause;
            query = query+' '+whereClause;
            system.debug('query:: '+query);
            obj.accounts=Database.query(query);
            system.debug('Final Search Result: '+obj.accounts);
        }catch(Exception dmlExec){
            System.debug('Error occured on SQL:  '+dmlExec);
            throw new AuraHandledException('Error Occoured while Processing. Please Contact your System Admin. Error Message is==>'+dmlExec);
        } 
        // return the wrapper class instance .
        return obj;
        
    }
    
    /************************************************************
Name: getFieldType
Type: Apex Method  
Purpose: Method Called to Get the DataType of Field which are used for Filter on the UI
***********************************************************/
    
    
    
    // create a wrapper class with @AuraEnabled Properties    
    public class AccountPagerWrapper {
        @AuraEnabled public Integer pageSize {get;set;}
        @AuraEnabled public Integer page {get;set;}
        @AuraEnabled public Integer total {get;set;}
        @AuraEnabled public List<Account> accounts {get;set;}
        
    }
    
    
    /************************************************************
Name: addRecords
Type: Apex Method  
Purpose: Method Called to Add the Accounts/Schools to the Project-Account Junction Object
Lightning Component Used : RPM_ListOfAccounts
***********************************************************/    
    
    
    @AuraEnabled
    public static List < String > addRecords(List < String > lstRecordId,String recordId) {
        // for store Error Messages  
        system.debug('Record ID : '+recordId);
        List < String > oErrorMsg = new List < String > ();
        // Query Records for delete where id in lstRecordId [which is pass from client side controller] 
        List < Account > insertAccount = [select Id,Name from account where id IN: lstRecordId];
        
        // delte contact list with Database.DeleteResult[] database class.
        // It deletes some queried contacts using <samp class="codeph apex_code">Database.<span class="statement">delete</span></samp> 
        // with a false second parameter to allow partial processing of records on failure.
        // Next, it iterates through the results to determine whether the operation was successful or not
        // for each record. and check if delete contact successful so print msg on debug, 
        // else add error message to oErrorMsg List and return the list  
        // Database.DeleteResult[] DR_Dels = Database.delete(insertAccount, false);
        
        
        List<RPM_Project_Account_Junction__c> newMembers = new List<RPM_Project_Account_Junction__c>();
        
        for(account c:insertAccount) {
            newMembers.add(new RPM_Project_Account_Junction__c(Name='Junction with '+c.Name,RPM_Project__c = recordId, account__c = c.Id));//'Add current project name and Record name also'
            system.debug('New menbers To be Added: '+newMembers);
        }
        Database.SaveResult[] srList = Database.insert(newMembers, false);
        
        
        
        // Iterate through each returned result
        for (Database.SaveResult dr: srList) {
            if (dr.isSuccess()) {
                system.debug('successful addedd Records');
                // Operation was successful
            } else {
                // Operation failed, so get all errors   
                oErrorMsg.add('');
                for (Database.Error err: dr.getErrors()) {
                    // add Error message to oErrorMsg list and return the list
                    oErrorMsg.add(err.getStatusCode() + ': ' + err.getMessage());
                }
            }
        }
        return oErrorMsg;
        
    }
    
    
    /************************************************************
Name: deleteRecords
Type: Apex Method  
Purpose: Method Called to Delete the Accounts/Schools from the Project-Account Junction Object
Lightning Component Used : RPM_ListOfAccounts
***********************************************************/      
    
    
    @AuraEnabled
    public static List < String > deleteRecords(List < String > lstRecordId,String recordId) {
        // for store Error Messages  
        List < String > oErrorMsg = new List < String > ();
        // Query Records for delete where id in lstRecordId [which is pass from client side controller] 
        List < RPM_Project_Account_Junction__c > lstDeleteRec = [select Id,RPM_School_Site_Status__c from RPM_Project_Account_Junction__c  where RPM_Project__c =: recordId AND Account__c IN: lstRecordId];
        
        
        for(RPM_Project_Account_Junction__c eachRecord : lstDeleteRec){
            eachRecord.RPM_School_Site_Status__c = 'Dropped';
        }      
        
        Database.SaveResult[] srList = Database.update(lstDeleteRec, false);
        // Iterate through each returned result
        for (Database.SaveResult dr: srList) {
            if (dr.isSuccess()) {
                system.debug('successful delete contact');
                // Operation was successful
            } else {
                // Operation failed, so get all errors   
                oErrorMsg.add('');
                for (Database.Error err: dr.getErrors()) {
                    // add Error message to oErrorMsg list and return the list
                    oErrorMsg.add(err.getStatusCode() + ': ' + err.getMessage());
                }
            }
        }
        
        return oErrorMsg;
        
    }
    
}
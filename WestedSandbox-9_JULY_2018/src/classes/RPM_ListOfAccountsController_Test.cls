/*
*@Desciption   :   Test class for RPM_ListOfAccountsController (Add/List Site/School Page).
*@Created Date :   19 Feb 2018
*@Author       :   Lirik Team
*/

@isTest
public class RPM_ListOfAccountsController_Test {
    
    
    private static testmethod void testsearchAccount(){
        
        Test.startTest();
        
        String sObjectAPIName = 'Account';
        String fieldsetAPIName = 'FieldSet';
        Decimal pageNumber = 1;
        Integer recordToDisply = 10;
        Boolean isCallFromAddPage ;
        
        List<Account>siteRecords = RPM_Utility_Test.createSiteRecords();
        List<String> accountRecordIdList = new List<String>();
        accountRecordIdList.add(siteRecords[0].Id);
        accountRecordIdList.add(siteRecords[1].Id);
        accountRecordIdList.add(siteRecords[2].Id);
        List<RPM_Project__c> projRecord =  RPM_Utility_Test.createProjectRecords() ;
        
        String mapOfFieldSet = '{"Name":"","BillingPostalCode":""}';
        
        
        String recordId = projRecord[0].Id;
        isCallFromAddPage = true;
        RPM_ListOfAccountsController.searchAccount(mapOfFieldSet, sObjectAPIName, fieldsetAPIName, pageNumber, recordToDisply, recordId, isCallFromAddPage);
        mapOfFieldSet = '{"Name":"howard","BillingPostalCode":"123"}';
        isCallFromAddPage = false;
        system.assert(RPM_ListOfAccountsController.searchAccount(mapOfFieldSet, sObjectAPIName, fieldsetAPIName, pageNumber, recordToDisply, recordId, isCallFromAddPage) != NULL);
        
        RPM_ListOfAccountsController.addRecords(accountRecordIdList, recordId);
        
        RPM_ListOfAccountsController.deleteRecords(accountRecordIdList, recordId);
        accountRecordIdList.add(projRecord[0].Id);
        
        RPM_ListOfAccountsController.addRecords(accountRecordIdList, recordId);
        
        
        Test.stopTest();
    }
    
    
}
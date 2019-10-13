<aura:application extends="force:slds">
    <aura:attribute name="account" type="Account" default="{Name: 'Smith'}"/>
    
    <div class="slds-container_large" style="margin: 0px auto;">
        <div class="slds-p-horizontal_small">
            <h1 class="slds-text-heading--large">Add School</h1>
            <c:RPM_GetFieldSetComp fsName="RPM_Account_Search_Fields" 
                            typeName="Account" 
                            record="{!v.account}"
                            />
        </div>
    </div>         
    
    
</aura:application>
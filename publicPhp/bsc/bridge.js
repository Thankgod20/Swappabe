let refrash= true;
   
        
initiate();
    
function setRefresh() {
    refrash = false;
    
}

window.setRefresh = setRefresh;

function useRefresh() {
   return refrash;
    
}

window.useRefresh = useRefresh;
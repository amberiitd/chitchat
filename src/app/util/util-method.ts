export function formatTime(timeInMillis: number) {
    const currentdate = new Date(timeInMillis);
    return currentdate.getHours() + ":"  
            + currentdate.getMinutes() ;
}

export function getTimeNow(){
    var currentdate = new Date(); 
     return currentdate.getTime();
    // return currentdate.getDate() + "/"
    //                 + (currentdate.getMonth()+1)  + "/" 
    //                 + currentdate.getFullYear() + " @ "  
    //                 + currentdate.getHours() + ":"  
    //                 + currentdate.getMinutes() + ":" 
    //                 + currentdate.getSeconds();
}
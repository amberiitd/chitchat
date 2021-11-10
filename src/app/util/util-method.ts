export function formatTime(timeInMillis: number) {
    const currentdate = new Date(timeInMillis);
    return currentdate.getHours() + ":"  
            + currentdate.getMinutes() ;
  }
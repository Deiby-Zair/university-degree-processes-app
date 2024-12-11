export function getCurrentDate(): string {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; //Enero es 0
    const year = currentDate.getFullYear();

    // Formato: AAAA-MM-DD
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    return formattedDate;
};
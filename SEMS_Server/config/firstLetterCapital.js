export const captialtheFirstLetter=(value)=>{
    let str = value?.toLowerCase()
    return str=str?.split("")[0]?.toUpperCase() + str?.split("").slice(1).join("");
}
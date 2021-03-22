let str = "kite flying"
spooner(str);
function spooner(str){
    let words = str.split(" ");
    let ans = words[1][0]+words[0].substring(1);
    ans = ans + "  " + words[0][0] + words[1].substring(1);
    console.log(ans);
     
}
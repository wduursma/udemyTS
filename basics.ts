function  add(n1: number,n2: number, showresult: boolean, phrase: string ) {

    const result = n1 + n2;

    console.log( typeof number1);
    if (showresult) {
        console.log(phrase +  result);
    }
    return result;
}
const number1 = 5;
const number2 = 2.8;
const printResult = false;
const resultPhrase = 'Result is:';

add(number1, number2, printResult, resultPhrase);

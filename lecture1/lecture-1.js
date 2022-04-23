console.log("Hello World!!");

const firstName = "Yash";

// console.log("Name is ", firstName);

// Window, document, alert 

function expo(n) {
    // if (n ===  1) {
    //     return 1;
    // }

    // return n * expo(n - 1);

    if (process.env.site === 'development') {
        console.log("n is", n);
    }

    return n === 1 ? 1 : n * expo(n - 1);
}

// console.log(expo(Number(process.argv[2])));

// -----------------------------------
console.log(process.env.myName);    // process.env - object

// console.log(process.argv);  // process.argv - array

function print(firstName, lastName, age) {
    console.log(`I am ${firstName} ${lastName}, and I am ${age} years old`);
}
print(process.argv[2], process.argv[3], process.argv[4]);
print("amit", "goyal", 22);
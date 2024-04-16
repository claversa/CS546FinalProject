<<<<<<< HEAD
import bcrypt from 'bcryptjs';


export let hashPassword = async (plainTextPassword) => {
    // salting, adds random data before hashing
    const saltRounds = 16;
    let hash = '';
    try {
        hash = await bcrypt.hash(plainTextPassword, saltRounds);
    }
    catch (e) {
        console.log(e);
    }
    return hash;

}

export let checkPassword = async (inputPassword, hash) => {
    let compare = false;
    try {
        compare = await bcrypt.compare(inputPassword, hash);
    } catch (e) {
        //no op
    }
    if (compare) {
        //LET IN
    }
    else {
        //DONT LET IN
    }
}
=======
import bcrypt from 'bcryptjs';


export let hashPassword = async (plainTextPassword) => {
    // salting, adds random data before hashing
    const saltRounds = 16;
    let hash = '';
    try {
        hash = await bcrypt.hash(plainTextPassword, saltRounds);
    }
    catch (e) {
        console.log(e);
    }
    return hash;

}

export let checkPassword = async (inputPassword, hash) => {
    let compare = false;
    try {
        compare = await bcrypt.compare(inputPassword, hash);
    } catch (e) {
        //no op
    }
    if (compare) {
        //LET IN
    }
    else {
        //DONT LET IN
    }
}
>>>>>>> dac752c (countdown works now)

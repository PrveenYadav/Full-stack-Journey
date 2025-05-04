class user {
    constructor(username) {
        this.username = username
    }

    printMe() {
        console.log(`Username is: ${this.username}`)
    }

    // static used: if you don't want to give access of createId to anyone also child classes
    static createId() {
        return `123`
    }
}

const userOne = new user("Rohan")
userOne.printMe()
// console.log(userOne.createId()); //can't access




// Just For Fun : Solve a DSA Problem
class root {
    // Solving DSA problem floor val of sqrt
    //iterative approach
    squareRoot(n) {
        let ans = 1;
        for(let i=1; i<=n; i++) {
            if(i*i <= n) {
                ans = i;
            }else {
                break;
            }
        }
        return ans;
    }

    squareRootBinarySearch(n) {
        let low = 1;
        let high = n;
        let ans = 1;
        while(low <= high) {
            let mid = Math.floor(low+(high-low/2));
            if(mid*mid <= n) {
                ans = mid;
                low = mid+1;
            }else{
                high = mid-1;
            }
        }
        // return high;
        return ans;
    }

    printMe(n) {
        console.log(this.squareRoot(n));
    }
    printMe1(n) {
        console.log(this.squareRootBinarySearch(n));
    }
}

const rootOne = new root()
rootOne.printMe(7)
rootOne.printMe1(35)
class user {
    constructor(username) {
        this.username = username
    }

    printMe() {
        console.log(`Username is: ${this.username}`)
    }
}
const userOne = new user("Shyam")
userOne.printMe()

// Another class extended to user class
class Teacher extends user {
    constructor(username, email, password) {
        super(username)
        this.email = email
        this.password = password
    }
}

const teacherOne = new Teacher("Hello", "hello@gamail.com", 123)
console.log(teacherOne)
teacherOne.printMe() //because inheriting user class

console.log(teacherOne instanceof Teacher)
console.log(teacherOne instanceof user)
console.log(userOne instanceof Teacher)
## JavaScript OOPs/Classes and Objects
Collection of properties and methods

**Core Concepts:**

* **Objects:**
    * Collections of key-value pairs.
    * Represent real-world entities.
    * Created using object literals `{}`, `new Object()`, or constructor functions/classes.
* **Classes:**
    * Blueprints for creating objects.
    * Define properties (data) and methods (behavior).
    * Introduced in ES6.
* **Instances:**
    * Objects created from a class.
    * Each instance has its own set of properties.

## OOPS 4 Pillers
* **Encapsulation:**
    * Bundling data and methods that operate on the data within a single unit (class).
    * Helps to hide internal details.
* **Inheritance:**
    * A class can inherit properties and methods from another class (parent/superclass).
    * Promotes code reusability.
    * Achieved using `extends`.
* **Polymorphism:**
    * Objects of different classes can respond to the same method call in different ways.
    * "Many forms."
* **Abstraction:**
    * Showing only necessary information and hiding unnecessary details.

**Classes Syntax:**

```javascript
class MyClass {
  constructor(prop1, prop2) {
    this.prop1 = prop1;
    this.prop2 = prop2;
  }

  myMethod() {
    // Method logic
    console.log(this.prop1);
  }
}

// Creating an instance:
const myObject = new MyClass("value1", "value2");
myObject.myMethod();
```

**Inheritance Syntax:**

```javascript
class ParentClass {
  constructor(parentProp) {
    this.parentProp = parentProp;
  }
  parentMethod(){
    console.log("parent method");
  }
}

class ChildClass extends ParentClass {
  constructor(parentProp, childProp) {
    super(parentProp); // Calls parent constructor
    this.childProp = childProp;
  }
  childMethod(){
    console.log("child method", this.parentProp);
  }
}

const childObject = new ChildClass("parentValue", "childValue");
childObject.parentMethod();
childObject.childMethod();

```

**Key Keywords:**

* `class`: Defines a class.
* `constructor`: Special method called when an object is created.
* `this`: Refers to the current object instance.
* `extends`: Used for inheritance.
* `super`: Calls the parent class constructor or method.


## Quick Revision Notes on JavaScript OOP

#### **1. Object-Oriented Programming (OOP) in JavaScript**  
JavaScript follows a prototype-based OOP approach. It allows creating objects using constructors, classes, and prototypes.

---

#### **2. Objects in JavaScript**  
Objects store key-value pairs and can contain methods.  
**Example:**
```js
const person = {
    name: "John",
    age: 30,
    greet: function() {
        console.log(`Hello, my name is ${this.name}`);
    }
};
person.greet(); // Output: Hello, my name is John
```

---

#### **3. Creating Objects using Constructor Function**
Before ES6 classes, objects were created using constructor functions.  
**Example:**
```js
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.greet = function() {
        console.log(`Hello, I am ${this.name}`);
    };
}
const p1 = new Person("Alice", 25);
p1.greet(); // Output: Hello, I am Alice
```

---

#### **4. JavaScript Classes (ES6)**
Classes provide a cleaner way to create objects.
**Syntax:**
```js
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        console.log(`Hello, I am ${this.name}`);
    }
}
const p2 = new Person("Bob", 28);
p2.greet(); // Output: Hello, I am Bob
```

---

### **Key Takeaways**
✅ **Objects** are key-value stores with methods.  
✅ **Classes** provide a structured way to create objects.  
✅ **Inheritance** allows extending classes to reuse code.  
✅ **Getters & Setters** control property access.  
✅ **Static Methods** belong to the class, not objects.  
✅ **Private Fields (`#`)** secure data within a class.  

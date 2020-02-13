// const person: {
//     name: string;
//     age: number;
// } = {
// const person: {
//     name: string;
//     age: number;
//     hobbies: string[];
//     role: [number, string];

// } =  {
//     name: 'Wietze',
//     age: 49,
//     hobbies: ['Sports', 'cooking' ],
//     role: [2, 'author']
// };

// const ADMIN = 0;
// const READ_ONLY = 1;
// const AUTHOR = 2;
enum Role {ADMIN = 10, READ_ONLY, AUTHOR};

const person =  {
    name: 'Wietze',
    age: 49,
    hobbies: ['Sports', 'cooking' ],
    role: Role.ADMIN
};

// person.role.push('admin');
// person.role[0] = 10;

let favoriteActivities: string[];
favoriteActivities = ['Sports']; 

console.log(person.name);

for(const hobby of person.hobbies) {
    console.log(hobby.toUpperCase());
}

if (person.role === Role.ADMIN) {
    console.log('is admin');
}
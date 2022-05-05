const book = require('./model/book');
const user = require('./model/user');
const { faker } = require('@faker-js/faker');
const { genHash } = require('./utils');

const AdminUser = {
    firstName: "Jon",
    lastName: "Doe",
    email: "jon.doe@gmail.com",
    userType: "ADMIN",
    password: "Admin123"
}

async function seed() {
    const isUserExist = await user.findOne({ email: AdminUser.email });
    if (!isUserExist) {
        const passwordHash = await genHash(AdminUser.password);
        await user.create({ ...AdminUser, password: passwordHash });
    }
    const books = await book.count();
    if (books === 0) {
        const booksToAdd = [];
        for(let i = 0; i < 25; i++) {
            booksToAdd.push({
                title: faker.commerce.productName(),
                author: faker.name.findName(),
                copies: Math.ceil(100 * Math.random()),
                year: [1995, 1996, 2000, 2021, 1980][Math.floor(5 * Math.random())]
            })
        }
        await book.insertMany(booksToAdd);
    }
}

async function deleteDb() {
    await user.deleteMany();
    await book.deleteMany();
}

module.exports = { seed, deleteDb };


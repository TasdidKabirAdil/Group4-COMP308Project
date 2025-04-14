const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const resolvers = {
    // Query: {
    //     users: async () => {
    //         try{
    //             const users = await User.find()
    //             return users.map((user) => ({
    //                 id: user._id.toString(),
    //                 ...user.toObject()
    //             }))
    //         } catch (error) {
    //             console.error('Error fetching users', error)
    //             throw new Error('Failed to fetch users')
    //         }
    //     },

    //     user: async(_, {id}) => {
    //         try {
    //             const user = await User.findById(id)
    //             if(!user) {
    //                 throw new Error(`User with ${id} doesn't exist`)
    //             }
    //             return {
    //                 id: user._id.toString(),
    //                 ...user.toObject()
    //             }
    //         } catch (error) {
    //             console.error(`Error fetching user with ${id}`, error)
    //             throw new Error('Failed to fetch user')
    //         }
    //     }
    // },

    Mutation: {
        login: async(_, { email, password }) => {
            try {
                const user = await User.findOne({ email })
                if(!user) {
                    throw new Error(`User with ${email} doesn't exist`)
                }
                const match = await bcrypt.compare(password, user.password)
                if(!match) {
                    throw new Error('Invalid email or password')
                }
                const token = jwt.sign({ userId: user._id, username: user.username}, process.env.JWT_SECRET, { expiresIn: '1h'})
                return {
                    token,
                    user: {
                        id: user._id.toString(),
                        username: user.username,
                        email: user.email,
                        role: user.role,
                    }
                }
            } catch (error) {
                console.log('Error loggin in', error)
                throw new Error('Failed to login')
            }
        },

        register: async(_, { username, email, password, role }) => {
            try {
                const existingUser = await User.findOne({ username })
                if(existingUser) {
                    throw new Error('User already exists')
                }
                const hashedPassword = await bcrypt.hash(password, 10)
                const newUser = new User({ username, email, password: hashedPassword, role })
                await newUser.save()
                return {
                    id: newUser._id.toString(),
                    ...newUser.toObject()
                }
            } catch (error) {
                console.error('Error creating user', error)
                throw new Error('Failed to create user')
            }
        }
    }
}

module.exports = resolvers;
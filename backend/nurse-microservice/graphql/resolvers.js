const VitalSign = require('../models/vitalSign')
const User = require('../../auth-microservice/models/user')
const MotivationalTip = require('../models/motivationalTip')

const vitalSignResolvers = {
    Query: {
        userVitalSigns: async (_, { userId, enteredBy }) => {
            try {  
                const entryUser = await User.findById(enteredBy)
                if(entryUser.role !== 'Nurse') {
                    throw new Error('Only nurses can access this data')
                }
                const vitalSigns = await VitalSign.find({userId, enteredBy})
                return vitalSigns.map((vitalSign) => ({
                    id: vitalSign._id.toString(),
                    ...vitalSign.toObject()
                }))        
            } catch (error) {
                console.error('Error fetching userVitalSigns', error)
                throw new Error('Failed to fetch userVitalSigns')
            }
        },

        dailyTip: async() => {
            try {
                const count = await MotivationalTip.countDocuments()
                const randomIndex = Math.floor(Math.random() * count)
                const randomTip = await MotivationalTip.findOne().skip(randomIndex)
                if(!randomTip) { throw new Error("No motivational tip found")}
                return {
                    id: randomTip._id.toString(),
                    ...randomTip.toObject()
                }
            } catch (error) {
                console.error('Error fetching dailyTip', error)
                throw new Error('Failed to fetch dailyTip')
            } 
        }
    },

    Mutation: {
        createVitalSign: async (_, args) => {
            try {
                const newVitalSign = new VitalSign(args)
                await newVitalSign.save()
                return ({
                    id: newVitalSign._id.toString(),
                    ...newVitalSign.toObject()
                })
            } catch (error) {
                console.error('Error creating newVitalSign', error)
                throw new Error('Failed to create newVitalSign')
            }
        }
    }
}

module.exports = vitalSignResolvers
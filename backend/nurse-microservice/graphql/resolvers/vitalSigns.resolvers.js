const VitalSigns = require('../../models/vitalSigns')
const User = require('../../../auth-microservice/models/user')

const vitalSignsResolvers = {
    Query: {
        userVitalSigns: async (_, { userId, enteredBy }) => {
            try {  
                const entryUser = await User.findById(enteredBy)
                if(entryUser.role !== 'Nurse') {
                    throw new Error('Only nurses can access this data')
                }
                const vitalSigns = await VitalSigns.find({userId, enteredBy})
                return vitalSigns.map((vitalSign) => ({
                    id: vitalSign._id.toString(),
                    ...vitalSign.toObject()
                }))        
            } catch (error) {
                console.error('Error fetching userVitalSigns', error)
                throw new Error('Failed to fetch userVitalSigns')
            }
        }
    },

    Mutation: {
        createVitalSign: async (_, args) => {
            try {
                const newVitalSign = new VitalSigns(args)
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

module.exports = vitalSignsResolvers
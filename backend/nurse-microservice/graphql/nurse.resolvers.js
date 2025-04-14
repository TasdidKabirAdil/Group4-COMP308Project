const VitalSign = require('../models/vitalSign')
const User = require('../../auth-microservice/models/user')
const MotivationalTip = require('../models/motivationalTip')
const DailyTip = require('../models/dailyTip')
const EmergencyAlert = require('../../patient-microservice/models/EmergencyAlert')

const resolvers = {
    Query: {
        userVitalSigns: async (_, { userId }) => {
            try {  
                const vitalSigns = await VitalSign.find({userId})
                return vitalSigns.map((vitalSign) => ({
                    id: vitalSign._id.toString(),
                    ...vitalSign.toObject()
                }))        
            } catch (error) {
                console.error('Error fetching userVitalSigns', error)
                throw new Error('Failed to fetch userVitalSigns')
            }
        }, 

        users: async () => {
            try{
                const users = await User.find()
                return users.map((user) => ({
                    id: user._id.toString(),
                    ...user.toObject()
                }))
            } catch (error) {
                console.error('Error fetching users', error)
                throw new Error('Failed to fetch users')
            }
        },

        user: async(_, {id}) => {
            try {
                const user = await User.findById(id)
                if(!user) {
                    throw new Error(`User with ${id} doesn't exist`)
                }
                return {
                    id: user._id.toString(),
                    ...user.toObject()
                }
            } catch (error) {
                console.error(`Error fetching user with ${id}`, error)
                throw new Error('Failed to fetch user')
            }
        },

        emergencyAlerts: async() => {
            try {
                const emergencyAlerts = await EmergencyAlert.find()
                return emergencyAlerts.map((emergencyAlert) => ({
                    id:emergencyAlert._id.toString(),
                    ...emergencyAlert.toObject()
                }))
            } catch (error) {
                console.error('Error fetching emergency alerts:', error);
                throw new Error('Failed to fetch emergency alerts');
            }
        },
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
        },

        sendDailyTip: async () => {
            const count = await MotivationalTip.countDocuments();
            const randomIndex = Math.floor(Math.random() * count);
            const randomTip = await MotivationalTip.findOne().skip(randomIndex);
          
            if (!randomTip) throw new Error("No motivational tip found");
          
            const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
          
            const savedTip = await DailyTip.findOneAndUpdate(
              { date: today },
              { message: randomTip.message },
              { upsert: true, new: true }
            );
          
            return savedTip;
          },   

          updateEmergencyAlerts: async (_, { id, message }) => {
            try {
                const alert = await EmergencyAlert.findByIdAndUpdate(id, {message}, {new: true})
                if(!alert) { throw new Error(`Updating alert with ${id} not found`)}
                return {
                    id: alert._id.toString(),
                    ...alert.toObject()
                }
            } catch (error) {
                console.error('Error updating alert', error)
                throw new Error('Failed to update alert')
            }
          },
    }
}

module.exports = resolvers
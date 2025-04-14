const DailyInfo = require('../models/DailyInfo');
const SymptomChecklist = require('../models/SymptomChecklist');
const EmergencyAlert = require('../models/EmergencyAlert');
const DailyTip = require('../../nurse-microservice/models/dailyTip')

const resolvers = {
    Query: {
        getDailyInfo: async (_, { patientId }) => {
            try {
                return await DailyInfo.find({ patientId }).sort({ entryDate: -1 });
            } catch (error) {
                console.error('Error fetching daily info:', error);
                throw new Error('Failed to fetch daily info');
            }
        },
        getSymptomChecklists: async (_, { patientId }) => {
            try {
                return await SymptomChecklist.find({ patientId }).sort({ submissionDate: -1 });
            } catch (error) {
                console.error('Error fetching symptom checklists:', error);
                throw new Error('Failed to fetch symptom checklists');
            }
        },
        getEmergencyAlerts: async (_, { patientId }) => {
            try {
                return await EmergencyAlert.find({ patientId }).sort({ timestamp: -1 });
            } catch (error) {
                console.error('Error fetching emergency alerts:', error);
                throw new Error('Failed to fetch emergency alerts');
            }
        },
        getTodayTip: async () => {
            const today = new Date().toISOString().split("T")[0];
            return await DailyTip.findOne({ date: today });
        }

    },
    Mutation: {
        createDailyInfo: async (_, { input }) => {
            try {
                console.log('Creating daily info:', input);
                const newDailyInfo = new DailyInfo(input);
                await newDailyInfo.save();
                return newDailyInfo;
            } catch (error) {
                console.error('Error creating daily info:', error);
                throw new Error('Failed to create daily info');
            }
        },
        submitSymptomChecklist: async (_, { input }) => {
            try {
                const newSymptomChecklist = new SymptomChecklist(input);
                await newSymptomChecklist.save();
                return newSymptomChecklist;
            } catch (error) {
                console.error('Error submitting symptom checklist:', error);
                throw new Error('Failed to submit symptom checklist');
            }
        },
        createEmergencyAlert: async (_, { patientId }) => {
            try {
                const newAlert = new EmergencyAlert({ patientId });
                await newAlert.save();
                return newAlert;
            } catch (error) {
                console.error('Error creating emergency alert:', error);
                throw new Error('Failed to create emergency alert');
            }
        }
    }
};

module.exports = resolvers;
/**
 * Task Scheduler
 * Runs background jobs for notifications and reminders
 */

import cron from 'node-cron';
import Activity from '../models/Activity.js';
import { createNotification } from '../controllers/notificationController.js';

const startScheduler = () => {
    console.log('⏰ Task Scheduler Started');

    // Run every hour to check for upcoming tasks (Example: due in next 24 hours)
    cron.schedule('0 * * * *', async () => {
        try {
            console.log('Running task reminder check...');

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            const now = new Date();

            // Find pending activities due within next 24 hours that haven't been reminded yet
            // Note: In a real app, we'd flag them as reminded to avoid duplicate notifications.
            // For this MVP, we'll check if a notification exists or just remind for testing. 
            // To strictly follow requirements "Task and follow-up reminders", we should check `reminder.enabled`.

            const upcomingTasks = await Activity.find({
                status: 'Pending',
                dueDate: { $gte: now, $lte: tomorrow },
                'reminder.enabled': true
            }).populate('assignedTo');

            for (const task of upcomingTasks) {
                // Create notification
                await createNotification(
                    task.assignedTo._id,
                    `Reminder: Task "${task.title}" is due on ${new Date(task.dueDate).toLocaleDateString()}`,
                    'system',
                    task.dueDate
                );
                console.log(`Sent reminder for task: ${task.title}`);
            }

        } catch (error) {
            console.error('Scheduler Error:', error);
        }
    });
};

export default startScheduler;

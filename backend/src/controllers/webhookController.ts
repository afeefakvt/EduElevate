import Stripe from "stripe";
import Enrollment from "../models/enrollmentModel";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatusCode";
import Course from "../models/courseModel";
import  Payment  from "../models/paymentModel";
import mongoose from "mongoose";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not defined in the .env.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-01-27.acacia"
});

export default class WebhookController {
    async stripeWebhook(req: Request, res: Response): Promise<void> {

        const sig = req.headers["stripe-signature"] as string | undefined;

        if (!sig) {
            console.error("Missing stripe-signature header.");
            res.status(HTTP_STATUS.BAD_REQUEST).send("Missing stripe-signature header.");
            return;
        }

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body, 
                sig,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
            console.log("Webhook signature verification succeeded.");
        } catch (error) {
            console.error("Webhook signature verification failed:", (error as Error).message);
            res.status(HTTP_STATUS.BAD_REQUEST).send(`Webhook Error: ${(error as Error).message}`);
            return;
        }

        let responseSent = false;

        try {
            switch (event.type) {
                case "checkout.session.completed":
                    const session = event.data.object as Stripe.Checkout.Session;
                    console.log("Checkout session completed.");

                    const studentId = session.metadata?.studentId;
                    const courseId = session.metadata?.courseId;
                    const paymentAmount = session.amount_total ? session.amount_total / 100 : 0;

                    console.log(`Student ${studentId} enrolled for course ${courseId} with amount ${paymentAmount}`);

                    await Enrollment.create({
                        studentId,
                        courseId,
                        paymentStatus: "success",
                        paymentAmount
                    });


                    const course = await Course.findById(courseId).select("price tutorId").populate({path:"tutorId",select:"name"})
                    if(!course){
                        return;
                    }
                    const tutorId = course.tutorId._id
                    const coursePrice = course.price

                    const existingPayment = await Payment.findOne({
                        courseId: new mongoose.Types.ObjectId(courseId),
                        tutorId: new mongoose.Types.ObjectId(tutorId),
                        settlementStatus:"pending"
                    })

                    const amountPayable = coursePrice * 0.8
                    if(existingPayment){
                        
                        existingPayment.settlementPrice+=amountPayable;
                        existingPayment.newEnrollments = (existingPayment.newEnrollments || 0)+1
                        await existingPayment.save()
                    }else{
                        
                        await Payment.create({
                            tutorId,
                            courseId,
                            settlementPrice : amountPayable,
                            settlementStatus : "pending",
                            newEnrollments:1
                        })
                    }

                    console.log("Enrollment created for student", studentId);
                    responseSent = true;
                    break;

                case "payment_intent.payment_failed":
                    const paymentIntent = event.data.object as Stripe.PaymentIntent;

                    const failedStudentId = paymentIntent.metadata?.studentId;
                    const failedAmount = paymentIntent.amount_received
                      ? paymentIntent.amount_received / 100
                      : 0;

                    responseSent = true; 
                    break;


                case "charge.succeeded":
                case "payment_intent.succeeded":
                case "payment_intent.created":
                    console.log(`Unhandled event typeee ${event.type}`);
                    break;

                case "checkout.session.expired":
                    console.log("Payment session expired.");
                    break; 

                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }
        } catch (error) {
            console.error("Error processing webhook:", (error as Error).message);
        }

        if (!responseSent) {
            res.status(HTTP_STATUS.OK).send("Event received");
        }
    }
}

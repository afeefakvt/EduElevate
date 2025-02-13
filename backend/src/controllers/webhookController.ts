import Stripe from "stripe";
import Enrollment from "../models/enrollmentModel";
import { Request, Response } from "express"; // Import types

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not defined in the .env.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-01-27.acacia"
});

export default class WebhookController {
    async stripeWebhook(req: Request, res: Response): Promise<void> {
        console.log("Received a request at webhook.");

        const sig = req.headers["stripe-signature"] as string | undefined;

        if (!sig) {
            res.status(400).send("Missing stripe-signature header.");
            return;
        }

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body as Buffer,  
                sig,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
            console.log("Webhook signature verification succeeded.");
        } catch (error) {
            console.error("Webhook signature verification failed:", (error as Error).message);
            res.status(400).send(`Webhook Error: ${(error as Error).message}`);
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
                        paymentStatus: "Success",
                        paymentAmount
                    });

                    console.log("Enrollment created for student", studentId);
                    responseSent = true;
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
            res.status(200).send("Event received");
        }
    }
}

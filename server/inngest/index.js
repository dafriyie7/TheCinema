import User from "../models/User.js"
import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

//save user data to a database
const syncUserCreation = inngest.createFunction(
	{ id: "sync-user-from-clerk" },
	{ event: 'clerk/user.created' },
	async ({ event }) => {
		const { id, first_name, last_name, email_addresses, image_url } = event.data
		const userData = {
			_id: id,
			email: email_addresses[0].email_address,
			name: first_name + " " + last_name,
			image: image_url
		}
		await User.create(userData)
	}
)

// delete user a user from database
const syncUserDeletion = inngest.createFunction(
	{ id: "delete-user-with-clerk" },
	{ event: "clerk/user.deleted" },
	async ({ event }) => {
		const { id } = event.data
		await User.findByIdAndDelete(id)
	}
);

// update user in the database
const syncUserUpdation = inngest.createFunction(
	{ id: "update-user-with-clerk" },
	{ event: "clerk/user.updated" },
	async ({ event }) => {
		const { id, first_name, last_name, email_addresses, image_url } = event.data
		const userData = {
			_id: id,
			email: email_addresses[0].email_address,
			name: first_name + " " + last_name,
			image: image_url,
		};
		await User.findByIdAndUpdate(id, userData)
	}
);


// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];
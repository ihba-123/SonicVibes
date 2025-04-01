import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = () => {
	const [newMessage, setNewMessage] = useState("");
	const { selectedUser, sendMessage, currentUserId } = useChatStore();

	const handleSend = () => {
		if (!selectedUser || !currentUserId || !newMessage.trim()) return;
		// Use clerkId for Clerk users, _id for manual users if available
		const receiverId = selectedUser.clerkId || selectedUser._id;
		sendMessage(receiverId, currentUserId, newMessage.trim());
		setNewMessage("");
	};

	return (
		<div className='p-4 mt-auto border-t border-zinc-800'>
			<div className='flex gap-2'>
				<Input
					placeholder='Type a message'
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className='bg-gray-800 border-none'
					onKeyDown={(e) => e.key === "Enter" && handleSend()}
				/>

				<Button size={"icon"} onClick={handleSend} disabled={!newMessage.trim()}>
					<Send className='size-4' />
				</Button>
			</div>
		</div>
	);
};
export default MessageInput;
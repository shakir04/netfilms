import { defaultAvatar } from "constants/global";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "libs/firebase-app";
import Message from "modules/Message";
import { useRouter } from "next/router";
import { FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAppSelector } from "store/global-store";
import styles from "styles/watch.module.scss";
import { IRoomInfo } from "types";
import classNames from "utils/classNames";
import { v4 as uuidv4 } from "uuid";

interface WatchTogetherChatProps {
  roomInfo: IRoomInfo;
}

const WatchTogetherChat = ({ roomInfo }: WatchTogetherChatProps) => {
  const router = useRouter();
  const refChat = useRef<HTMLDivElement | null>(null);
  const { currentUser } = useAppSelector((state) => state.auth);
  const id = router.query.id as string;
  const [commentValue, setCommentValue] = useState("");

  const handleAddComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Please sign in!");
      return;
    }
    try {
      const colRef = doc(db, "rooms", id as string);
      const cloneRoomInfo = roomInfo;
      cloneRoomInfo?.messages.push({
        id: uuidv4(),
        userId: currentUser.uid,
        avatar: currentUser.photoURL || defaultAvatar,
        fullname: currentUser.displayName,
        content: commentValue
      });
      await updateDoc(colRef, { messages: cloneRoomInfo?.messages });
      if (!refChat.current) return;
      refChat.current.scrollTop = refChat.current.scrollHeight;
    } catch (error: any) {
      toast.error(error?.message);
      console.log("error: ", error);
    } finally {
      setCommentValue("");
    }
  };

  return (
    <div className={styles.layoutSidebar}>
      <span className={styles.notification}>
        <b>Thuan Bach</b> has joined the room
      </span>
      <div className={classNames(styles.content, "scrollbar")} ref={refChat}>
        {roomInfo?.messages.map((message: any) => (
          <Message
            key={message.id}
            isMe={currentUser?.uid === message.userId}
            username={message.fullname}
            content={message.content}
            avatar={defaultAvatar}
          />
        ))}
      </div>
      <form className={styles.form} onSubmit={handleAddComment}>
        <input
          type="text"
          placeholder="Write comment"
          value={commentValue}
          onKeyDown={(e) => e.stopPropagation()}
          onKeyUp={(e) => e.stopPropagation()}
          onKeyPress={(e) => e.stopPropagation()}
          onChange={(e) => setCommentValue(e.target.value)}
        />
      </form>
    </div>
  );
};

export default WatchTogetherChat;

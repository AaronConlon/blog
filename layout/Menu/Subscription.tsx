import { AiOutlineMail } from "react-icons/ai";
import { useState } from "react";

function SubscriptionMe() {
  const [Email, setEmail] = useState("");
  const onSendSubscriptionRequest = () => {};
  return (
    <div className="bg-purple-100 rounded-xl p-4 my-2 w-full text-gray-700">
      <p className="pb-2 font-bold text-gray-600">订阅我的文章</p>
      <div className="flex items-center">
        <input
          className="p-2 rounded-l-sm flex-grow outline-none"
          type="text"
          value={Email}
          placeholder="你的电子邮件"
          onChange={(e) => setEmail(e.target.value.trim())}
        />
        <span
          className="flex items-center justify-center bg-purple-700 text-white h-10 w-10 cursor-pointer"
          onClick={onSendSubscriptionRequest}
        >
          <AiOutlineMail />
        </span>
      </div>
    </div>
  );
}

export default SubscriptionMe;

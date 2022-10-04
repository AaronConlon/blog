import { AiOutlineMail } from "react-icons/ai";
import { useState } from "react";

function SubscriptionMe() {
  const [Email, setEmail] = useState("");
  const onSendSubscriptionRequest = () => {};
  return (
    <div className="p-4 my-2 text-gray-700 max-w-[90vw] mx-auto">
      <p className="pb-2 font-bold text-gray-600">订阅我的文章</p>
      <div className="flex items-center">
        <input
          className="p-2 rounded-l-sm flex-grow outline-none w-[200px]"
          type="text"
          value={Email}
          placeholder="你的电子邮件"
          onChange={(e) => setEmail(e.target.value.trim())}
        />
        <span
          className="flex items-center justify-center bg-purple-700 text-white h-10 w-10 cursor-pointer rounded-r-sm"
          onClick={onSendSubscriptionRequest}
        >
          <AiOutlineMail />
        </span>
      </div>
    </div>
  );
}

export default SubscriptionMe;

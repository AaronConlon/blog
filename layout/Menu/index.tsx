import { AiOutlineRight } from "react-icons/ai";
import { SITE_NAME } from "@/configs";
import { motion } from "framer-motion";

function Menu() {
  return (
    <motion.header
      className="flex items-center gap-2 px-4 py-6 relative"
      initial={{ left: 30 }}
      animate={{ left: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <AiOutlineRight className="w-3 h-3 dark:text-purple-600" />
      <span className="text-purple-600 dark:text-white">{SITE_NAME}</span>
      <motion.span
        className="w-[3px] h-4 bg-purple-600 dark:bg-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{
          repeat: Infinity,
          type: "keyframes",
          duration: 1,
        }}
      ></motion.span>
      {/* nav list */}
      <ul className="flex items-center gap-1 ml-auto block">
        <li>作品集</li>
        <li>自述</li>
      </ul>
    </motion.header>
  );
}

export default Menu;
